import React, { useEffect, useState } from 'react';
import { Search, BookOpen, Clock, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import useRegistrationStore from '../../store/useRegistrationStore';
import useAuthStore from '../../store/useAuthStore';
import { semesterApi } from '../../api/semesterApi';
import registrationApi from '../../api/registrationApi';
import toast from 'react-hot-toast';

const CourseRegistrationPage = () => {
  const { periods, fetchPeriods, currentRegistrations, fetchStudentRegistrations, retakeableCourses, fetchRetakeableCourses } = useRegistrationStore();
  const { user } = useAuthStore();
  
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [availableSections, setAvailableSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Khởi tạo dữ liệu
  useEffect(() => {
    fetchPeriods();
  }, [fetchPeriods]);

  useEffect(() => {
    if (user?.id) {
      fetchStudentRegistrations(user.id);
      fetchRetakeableCourses(user.id);
    }
  }, [user, fetchStudentRegistrations]);

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
      const data = {
        studentId: user.id,
        courseSectionId: sectionId,
        registrationPeriodId: selectedPeriod.id,
        registrationType: 1 // Đăng ký mới
      };
      const response = await registrationApi.register(data);
      if (response.success) {
        toast.success("Đăng ký thành công!");
        fetchStudentRegistrations(user.id); // Tải lại danh sách đã đăng ký
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
          toast.success("Hủy đăng ký thành công");
          fetchStudentRegistrations(user.id);
        }
      } catch (error) {
        toast.error("Hủy đăng ký thất bại");
      }
    }
  };

  const filteredSections = availableSections.filter(s => 
    s.classCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activePeriods = periods.filter(p => {
    const now = new Date();
    return now >= new Date(p.startTime) && now <= new Date(p.endTime);
  });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* CỘT TRÁI: LỰA CHỌN & DANH SÁCH LỚP */}
      <div className="xl:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="text-blue-600" />
            Chọn Đợt Đăng ký
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activePeriods.length === 0 ? (
              <div className="md:col-span-2 flex items-center gap-3 p-4 bg-amber-50 text-amber-700 rounded-xl border border-amber-100">
                <AlertCircle size={20} />
                <p className="text-sm font-medium">Hiện không có đợt đăng ký nào đang diễn ra.</p>
              </div>
            ) : (
              activePeriods.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPeriod(p)}
                  className={`p-4 rounded-xl border transition-all text-left group ${
                    selectedPeriod?.id === p.id 
                    ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500/20' 
                    : 'border-gray-100 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <p className={`font-bold ${selectedPeriod?.id === p.id ? 'text-blue-700' : 'text-gray-700'}`}>{p.name}</p>
                  <p className="text-xs text-gray-500 mt-1">Kết thúc: {new Date(p.endTime).toLocaleString('vi-VN')}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {selectedPeriod && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-gray-800">Danh sách Lớp học phần</h2>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Tìm mã lớp, tên môn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                    <tr>
                      <th className="px-4 py-3 rounded-l-xl">Mã Lớp</th>
                      <th className="px-4 py-3">Tên Môn Học</th>
                      <th className="px-4 py-3">Tín chỉ</th>
                      <th className="px-4 py-3">Sĩ số</th>
                      <th className="px-4 py-3 rounded-r-xl">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredSections.map(section => {
                      const isRegistered = currentRegistrations.some(r => r.courseSectionId === section.id && r.status !== 3);
                      return (
                        <tr key={section.id} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-4 py-4 font-mono text-sm text-blue-600 font-bold">{section.classCode}</td>
                          <td className="px-4 py-4 text-sm font-semibold text-gray-700">{section.courseName}</td>
                          <td className="px-4 py-4 text-sm text-gray-500">{section.credits}</td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {section.currentEnrolled || 0}/{section.maxStudents || '--'}
                          </td>
                          <td className="px-4 py-4">
                            {isRegistered ? (
                              <span className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-100 px-3 py-1 rounded-full w-fit">
                                <CheckCircle2 size={14} />
                                Đã đăng ký
                              </span>
                            ) : (
                              <button
                                onClick={() => handleRegister(section.id)}
                                className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
                              >
                                Đăng ký
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
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen className="text-indigo-600" />
            Môn học đã Đăng ký
          </h2>
          
          <div className="space-y-4">
            {currentRegistrations.filter(r => r.status !== 3).length === 0 ? (
              <p className="text-center py-10 text-gray-400 italic text-sm">Chưa có môn học nào</p>
            ) : (
              currentRegistrations.filter(r => r.status !== 3).map(reg => (
                <div key={reg.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative group">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{reg.courseName}</p>
                      <p className="text-xs text-blue-600 font-mono mt-1">{reg.courseSectionCode}</p>
                    </div>
                    <button 
                      onClick={() => handleCancel(reg.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold">
                      {reg.isPaid ? 'ĐÃ ĐÓNG PHÍ' : 'CHƯA ĐÓNG PHÍ'}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {new Date(reg.registeredAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500 font-medium">Tổng tín chỉ:</span>
              <span className="text-lg font-bold text-blue-600">
                {currentRegistrations.filter(r => r.status !== 3).reduce((acc, curr) => acc + (curr.credits || 0), 0)}
              </span>
            </div>
            {selectedPeriod && (
              <div className="text-[10px] text-gray-400 text-right italic">
                Giới hạn tối đa: {selectedPeriod.maxCredits} TC
              </div>
            )}
          </div>
        </div>

        {/* Môn học có thể học lại */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertCircle className="text-orange-500" />
            Môn học có thể học lại
          </h2>
          <div className="space-y-3">
            {retakeableCourses.length === 0 ? (
              <p className="text-center py-6 text-gray-400 italic text-xs">Không có môn học gợi ý học lại</p>
            ) : (
              retakeableCourses.map(course => (
                <button
                  key={course.id}
                  onClick={() => setSearchTerm(course.courseCode)}
                  className="w-full p-3 text-left bg-orange-50/50 hover:bg-orange-50 border border-orange-100 rounded-xl transition-all group"
                >
                  <p className="text-sm font-bold text-gray-800 group-hover:text-orange-600 transition-colors">{course.courseName}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] font-mono text-orange-600">{course.courseCode}</span>
                    <span className="text-[10px] text-gray-400">{course.credits} Tín chỉ</span>
                  </div>
                </button>
              ))
            )}
          </div>
          <p className="mt-4 text-[10px] text-gray-400 leading-relaxed italic">
            * Danh sách bao gồm các môn học bạn đã trượt hoặc có điểm tích lũy thấp cần cải thiện.
          </p>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-2xl text-white shadow-xl shadow-blue-500/20">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <AlertCircle size={18} />
            Lưu ý quan trọng
          </h3>
          <ul className="text-xs space-y-2 opacity-90 list-disc pl-4">
            <li>Vui lòng kiểm tra kỹ lịch học để tránh trùng lịch.</li>
            <li>Đăng ký chỉ có hiệu lực khi bạn hoàn tất đóng học phí đúng hạn.</li>
            <li>Bạn có thể hủy đăng ký trong thời gian đợt đăng ký còn mở.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CourseRegistrationPage;
