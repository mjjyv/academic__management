import React, { useEffect, useState } from 'react';
import { Search, BookOpen, Clock, AlertCircle, CheckCircle2, Trash2, ArrowRight } from 'lucide-react';
import useRegistrationStore from '../../store/useRegistrationStore';
import useAuthStore from '../../store/useAuthStore';
import useFinanceStore from '../../store/useFinanceStore';
import { semesterApi } from '../../api/semesterApi';
import registrationApi from '../../api/registrationApi';
import toast from 'react-hot-toast';

const CourseRegistrationPage = () => {
  const { periods, fetchPeriods, currentRegistrations, fetchStudentRegistrations, retakeableCourses, fetchRetakeableCourses } = useRegistrationStore();
  const { tuitionData, fetchCurrentTuition, calculateCurrentTuition } = useFinanceStore();
  const { user } = useAuthStore();
  
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [availableSections, setAvailableSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReg, setSelectedReg] = useState(null); // Cho modal chi tiết
  const [regTab, setRegTab] = useState('unpaid'); // 'unpaid' hoặc 'paid'

  // 1. Khởi tạo dữ liệu
  useEffect(() => {
    fetchPeriods();
  }, [fetchPeriods]);

  useEffect(() => {
    if (user?.id) {
      fetchStudentRegistrations(user.id);
      fetchRetakeableCourses(user.id);
      fetchCurrentTuition();
    }
  }, [user, fetchStudentRegistrations, fetchRetakeableCourses, fetchCurrentTuition]);

  // 2. Khi chọn đợt đăng ký, lấy danh sách lớp học phần của học kỳ đó
  useEffect(() => {
    const fetchSections = async () => {
      if (selectedPeriod) {
        setLoading(true);
        try {
          const response = await semesterApi.getSectionsBySemester(selectedPeriod.semesterId);
          if (response.success) {
            setAvailableSections(response.data);
          }
        } catch (error) {
          toast.error("Không thể tải danh sách lớp học phần");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchSections();
  }, [selectedPeriod]);

  const handleRegister = async (sectionId) => {
    try {
      const section = availableSections.find(s => s.id === sectionId);
      const isRetake = retakeableCourses.some(c => c.id === section.courseId);
      
      const data = {
        studentId: user.id,
        courseSectionId: sectionId,
        registrationPeriodId: selectedPeriod.id,
        registrationType: isRetake ? 2 : 1 // 1: Mới, 2: Học lại
      };
      
      const response = await registrationApi.register(data);
      if (response.success) {
        const addedFee = isRetake ? 750000 * section.credits : 500000 * section.credits;
        toast.success(
          <div className="flex flex-col">
            <span className="font-bold">{isRetake ? "Đăng ký học lại thành công!" : "Đăng ký thành công!"}</span>
            <span className="text-[10px] opacity-80">Học phí tăng: +{addedFee.toLocaleString('vi-VN')} đ</span>
          </div>
        );
        fetchStudentRegistrations(user.id); 
        
        if (selectedPeriod?.semesterId) {
          await calculateCurrentTuition(user.id, selectedPeriod.semesterId);
          await fetchCurrentTuition();
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Đăng ký thất bại";
      toast.error(msg);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đăng ký này?")) {
      try {
        const response = await registrationApi.cancelRegistration(id);
        if (response.success) {
          toast.success("Hủy đăng ký thành công.");
          fetchStudentRegistrations(user.id);
          if (selectedPeriod?.semesterId) {
            await calculateCurrentTuition(user.id, selectedPeriod.semesterId);
            await fetchCurrentTuition();
          }
        }
      } catch (error) {
        toast.error("Hủy đăng ký thất bại");
      }
    }
  };

  const isRetakePeriod = selectedPeriod?.name?.toLowerCase().includes('học lại') || selectedPeriod?.name?.toLowerCase().includes('cải thiện');

  const filteredSections = availableSections.filter(s => {
    const matchesSearch = s.classCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    const isCourseInRetakeList = retakeableCourses.some(rc => rc.id === s.courseId);
    
    // Nếu là đợt học lại, chỉ hiện các môn có trong danh sách nợ môn/cải thiện
    if (isRetakePeriod) {
      return isCourseInRetakeList;
    } 
    // Nếu là đợt chính thức, ẩn các môn thuộc danh sách học lại
    return !isCourseInRetakeList;
  });

  const activePeriods = periods.filter(p => {
    const now = new Date();
    return now >= new Date(p.startTime) && now <= new Date(p.endTime);
  });

  const registeredCount = currentRegistrations.filter(r => r.status !== 3).length;
  const totalCredits = currentRegistrations.filter(r => r.status !== 3).reduce((acc, curr) => acc + (curr.credits || 0), 0);
  const maxCredits = selectedPeriod?.maxCredits || 24;
  const progressWidth = Math.min((totalCredits / maxCredits) * 100, 100);

  // Tính toán học phí dự kiến (Chỉ tính các khoản chưa nộp và CHƯA hoàn thành)
  const unpaidAmount = currentRegistrations
    .filter(r => r.status !== 3 && !r.isPaid && !r.isFinished)
    .reduce((acc, curr) => {
      const price = curr.registrationType === 1 ? 500000 : 750000;
      return acc + (curr.credits * price);
    }, 0);

  // Ưu tiên dùng dữ liệu từ store nếu có
  const expectedTuition = tuitionData?.debtAmount !== undefined ? tuitionData.debtAmount : unpaidAmount;

  // Modal Chi Tiết Đăng Ký
  const RegistrationDetailModal = ({ registration, onClose }) => {
    if (!registration) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white relative">
            <button 
              onClick={onClose}
              className="absolute right-6 top-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <Trash2 className="rotate-45" size={20} />
            </button>
            <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Chi tiết đăng ký</p>
            <h3 className="text-2xl font-black leading-tight">{registration.courseName}</h3>
            <div className="mt-4 flex items-center gap-3">
              <span className="px-3 py-1 bg-white/20 rounded-lg text-xs font-bold backdrop-blur-md">
                {registration.courseSectionCode}
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-lg text-xs font-bold backdrop-blur-md">
                {registration.credits} Tín chỉ
              </span>
            </div>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Trạng thái</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${registration.status === 1 ? 'bg-green-500' : 'bg-orange-500'}`} />
                  <span className="text-sm font-bold text-gray-700">
                    {registration.status === 1 ? 'Thành công' : 'Đang xử lý'}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Thanh toán</p>
                <span className={`text-sm font-bold ${registration.isPaid ? 'text-green-600' : 'text-orange-600'}`}>
                  {registration.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Loại đăng ký</p>
                <span className="text-sm font-bold text-gray-700">
                  {registration.registrationType === 2 ? 'Học lại / Cải thiện' : 'Học mới'}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Ngày đăng ký</p>
                <span className="text-sm font-bold text-gray-700">
                  {new Date(registration.registeredAt).toLocaleString('vi-VN')}
                </span>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Giảng viên</p>
                <span className="text-sm font-bold text-gray-700">
                  {registration.lecturerName || 'Chưa cập nhật'}
                </span>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  handleCancel(registration.id);
                  onClose();
                }}
                className="flex-1 py-4 px-6 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                HỦY ĐĂNG KÝ
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-4 px-6 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl text-sm font-black transition-all"
              >
                ĐÓNG
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {selectedReg && (
        <RegistrationDetailModal 
          registration={selectedReg} 
          onClose={() => setSelectedReg(null)} 
        />
      )}

      {/* 1. HEADER SUMMARY BAR */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="flex-1 w-full space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-black text-gray-800">Đăng ký Học phần</h1>
              <p className="text-sm text-gray-500 font-medium">Học kỳ: {selectedPeriod?.semesterName || 'Chưa chọn học kỳ'}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-blue-600">{totalCredits}</span>
              <span className="text-sm text-gray-400 font-bold"> / {maxCredits} Tín chỉ</span>
            </div>
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out rounded-full ${
                progressWidth > 90 ? 'bg-red-500' : progressWidth > 70 ? 'bg-orange-500' : 'bg-blue-600'
              }`}
              style={{ width: `${progressWidth}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-6 w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-8">
          <div className="bg-blue-50 p-4 rounded-2xl flex items-center gap-4 border border-blue-100/50 relative group cursor-pointer hover:bg-blue-100 transition-all" onClick={() => window.location.href = '/finance'}>
            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1">
                Học phí dự kiến
                <ArrowRight size={10} />
              </p>
              <p className="text-xl font-black text-gray-800">
                {expectedTuition.toLocaleString('vi-VN')} đ
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* CỘT TRÁI: LỰA CHỌN & DANH SÁCH LỚP */}
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="text-blue-600" />
              Đợt Đăng ký đang mở
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activePeriods.length === 0 ? (
                <div className="md:col-span-2 flex items-center gap-3 p-4 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100">
                  <AlertCircle size={20} />
                  <p className="text-sm font-medium">Hiện không có đợt đăng ký nào đang diễn ra.</p>
                </div>
              ) : (
                activePeriods.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPeriod(p)}
                    className={`p-5 rounded-2xl border transition-all text-left relative group overflow-hidden ${
                      selectedPeriod?.id === p.id 
                      ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500/20' 
                      : 'border-gray-100 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="relative z-10">
                      <p className={`font-black text-base ${selectedPeriod?.id === p.id ? 'text-blue-700' : 'text-gray-700'}`}>{p.name}</p>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5 font-medium">
                        <Clock size={12} className="text-gray-400" />
                        Hạn chót: {new Date(p.endTime).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    {selectedPeriod?.id === p.id && (
                      <CheckCircle2 className="absolute -right-2 -bottom-2 w-16 h-16 text-blue-600/5 rotate-12" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {selectedPeriod && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[400px]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                  <h2 className="text-xl font-black text-gray-800">Lớp học phần khả dụng</h2>
                  <p className="text-xs text-gray-500 font-medium mt-1">Tìm kiếm và đăng ký các lớp học trong học kỳ này.</p>
                </div>
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Tìm theo mã lớp, tên môn..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-3 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-semibold"
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                  <p className="text-sm font-bold text-gray-400">Đang tải dữ liệu...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-50">
                        <th className="px-4 py-4">Mã Lớp</th>
                        <th className="px-4 py-4">Tên Môn Học</th>
                        <th className="px-4 py-4">Tín chỉ</th>
                        <th className="px-4 py-4">Sĩ số</th>
                        <th className="px-4 py-4 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredSections.map(section => {
                        const isRegistered = currentRegistrations.some(r => r.courseSectionId === section.id && r.status !== 3);
                        return (
                          <tr key={section.id} className="hover:bg-blue-50/40 transition-all duration-300 group">
                            <td className="px-4 py-5 font-mono text-sm text-blue-600 font-black">{section.classCode}</td>
                            <td className="px-4 py-5">
                              <p className="text-sm font-bold text-gray-700 group-hover:text-blue-700 transition-colors">{section.courseName}</p>
                              <p className="text-[10px] text-gray-400 font-bold mt-0.5">GIẢNG VIÊN: {section.lecturerName || 'Đang cập nhật'}</p>
                            </td>
                            <td className="px-4 py-5">
                              <span className="text-sm font-black text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">
                                {section.credits}
                              </span>
                            </td>
                            <td className="px-4 py-5">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-bold ${section.currentEnrolled >= section.maxStudents ? 'text-red-500' : 'text-gray-600'}`}>
                                  {section.currentEnrolled || 0}/{section.maxStudents || '--'}
                                </span>
                                <div className="hidden md:block w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-blue-400 rounded-full"
                                    style={{ width: `${(section.currentEnrolled / (section.maxStudents || 1)) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-5 text-right">
                              {isRegistered ? (
                                <div className="inline-flex items-center gap-1.5 text-green-600 text-[10px] font-black bg-green-50 border border-green-100 px-4 py-2 rounded-xl">
                                  <CheckCircle2 size={14} />
                                  ĐÃ ĐĂNG KÝ
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleRegister(section.id)}
                                  disabled={section.currentEnrolled >= section.maxStudents}
                                  className={`text-xs font-black px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 ${
                                    section.currentEnrolled >= section.maxStudents
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                  }`}
                                >
                                  {section.currentEnrolled >= section.maxStudents ? 'LỚP ĐÃ ĐẦY' : 'ĐĂNG KÝ'}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CỘT PHẢI: KẾT QUẢ ĐĂNG KÝ */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full max-h-[600px]">
            <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <BookOpen size={20} />
              </div>
              Lớp đã chọn
            </h2>

            {/* Tabs phân loại */}
            <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
              <button
                onClick={() => setRegTab('unpaid')}
                className={`flex-1 py-2 text-[10px] font-black rounded-xl transition-all ${
                  regTab === 'unpaid' 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                CHƯA THANH TOÁN ({currentRegistrations.filter(r => r.status !== 3 && !r.isPaid && !r.isFinished).length})
              </button>
              <button
                onClick={() => setRegTab('paid')}
                className={`flex-1 py-2 text-[10px] font-black rounded-xl transition-all ${
                  regTab === 'paid' 
                  ? 'bg-white text-green-600 shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                ĐÃ THANH TOÁN ({currentRegistrations.filter(r => r.status !== 3 && r.isPaid && !r.isFinished).length})
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {currentRegistrations.filter(r => r.status !== 3 && !r.isFinished && (regTab === 'paid' ? r.isPaid : !r.isPaid)).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 opacity-30">
                  <BookOpen size={48} className="mb-4" />
                  <p className="text-sm font-black italic">
                    {regTab === 'paid' ? 'Chưa có lớp nào đã thanh toán' : 'Không có lớp nào chưa thanh toán'}
                  </p>
                </div>
              ) : (
                currentRegistrations
                  .filter(r => r.status !== 3 && !r.isFinished && (regTab === 'paid' ? r.isPaid : !r.isPaid))
                  .map(reg => (
                  <div key={reg.id} className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 group hover:border-blue-200 transition-colors relative">
                    <div className="absolute -right-2 -top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                      <button 
                        onClick={() => setSelectedReg(reg)}
                        className="w-8 h-8 bg-white text-blue-600 hover:shadow-lg rounded-xl flex items-center justify-center border border-gray-100"
                        title="Xem chi tiết"
                      >
                        <Search size={14} />
                      </button>
                      <button 
                        onClick={() => handleCancel(reg.id)}
                        className="w-8 h-8 bg-white text-red-300 hover:text-red-500 hover:shadow-lg rounded-xl flex items-center justify-center border border-gray-100"
                        title="Hủy đăng ký"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <div>
                        <p className="font-black text-gray-800 text-sm leading-tight mb-1">{reg.courseName}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-blue-600 font-black bg-blue-50 px-2 py-0.5 rounded-md">{reg.courseSectionCode}</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">{reg.credits || 0} TÍN CHỈ</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${reg.isPaid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {reg.isPaid ? 'ĐÃ THANH TOÁN' : 'CHƯA NỘP TIỀN'}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold">
                          {new Date(reg.registeredAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-100">
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">TỔNG CỘNG</span>
                <span className="text-xl font-black text-blue-600">{totalCredits} TÍN CHỈ</span>
              </div>
            </div>
          </div>

          {/* Môn học gợi ý học lại */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
                  <AlertCircle size={20} />
                </div>
                Học lại / Cải thiện
              </h2>
            </div>
            <div className="space-y-4">
              {retakeableCourses.length === 0 ? (
                <p className="text-center py-6 text-gray-400 italic text-xs font-bold">Không có gợi ý nào</p>
              ) : (
                retakeableCourses.map(course => {
                  // Tìm xem có section nào đang mở cho môn này không
                  const availableSection = availableSections.find(s => s.courseId === course.id);
                  
                  return (
                    <div
                      key={course.id}
                      className="w-full p-4 bg-orange-50/30 border border-orange-100/50 rounded-2xl transition-all group relative overflow-hidden"
                    >
                      <div className="relative z-10 flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="text-sm font-black text-gray-800 leading-tight mb-1">{course.courseName}</p>
                          <p className="text-[10px] font-mono font-bold text-orange-500">{course.courseCode}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-gray-400 uppercase">{course.credits} TC</p>
                          {availableSection ? (
                            <button
                              onClick={() => handleRegister(availableSection.id)}
                              className="mt-2 text-[10px] font-black bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                            >
                              ĐĂNG KÝ NGAY
                            </button>
                          ) : (
                            <button
                              onClick={() => setSearchTerm(course.courseCode)}
                              className="mt-2 text-[10px] font-black bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              TÌM LỚP
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity">
                        <AlertCircle size={40} className="rotate-12 translate-x-4 translate-y-4" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
              <p className="text-[10px] text-gray-400 leading-relaxed font-bold italic">
                * Đây là các môn bạn có kết quả chưa tốt (D/F). Hãy ưu tiên học lại để cải thiện điểm tích lũy (GPA).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseRegistrationPage;
