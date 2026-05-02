import React, { useEffect, useState } from 'react';
import { Wallet, CreditCard, History, AlertCircle, TrendingDown, DollarSign, ArrowRight } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';
import useAuthStore from '../../store/useAuthStore';
import useSemesterStore from '../../store/useSemesterStore';
import useRegistrationStore from '../../store/useRegistrationStore';
import toast from 'react-hot-toast';

const TuitionDashboardPage = () => {
  const { tuitionData, calculateCurrentTuition, loading } = useFinanceStore();
  const { currentRegistrations, fetchStudentRegistrations } = useRegistrationStore();
  const { semesters, fetchSemesters } = useSemesterStore();
  const { user } = useAuthStore();
  
  const [selectedSemesterId, setSelectedSemesterId] = useState('');

  useEffect(() => {
    fetchSemesters();
    if (user?.id) {
      fetchStudentRegistrations(user.id);
    }
  }, [fetchSemesters, user, fetchStudentRegistrations]);

  useEffect(() => {
    if (semesters.length > 0 && !selectedSemesterId) {
      setSelectedSemesterId(semesters[0].id);
    }
  }, [semesters, selectedSemesterId]);

  const handleCalculate = async () => {
    if (!selectedSemesterId) return;
    try {
      await calculateCurrentTuition(user.id, selectedSemesterId);
      toast.success("Đã cập nhật dữ liệu học phí kỳ này");
    } catch (error) {
      toast.error("Không thể tính toán học phí");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const getTuitionBreakdown = () => {
    const newCourses = currentRegistrations.filter(r => r.registrationType === 1 && r.status !== 3);
    const retakeCourses = currentRegistrations.filter(r => (r.registrationType === 2 || r.registrationType === 3) && r.status !== 3);
    
    return {
      new: newCourses,
      retake: retakeCourses,
      newCredits: newCourses.reduce((acc, curr) => acc + (curr.credits || 0), 0),
      retakeCredits: retakeCourses.reduce((acc, curr) => acc + (curr.credits || 0), 0),
    };
  };

  const breakdown = getTuitionBreakdown();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tài chính & Học phí</h1>
          <p className="text-sm text-gray-500">Quản lý các khoản phí và lịch sử thanh toán của bạn.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={selectedSemesterId}
            onChange={(e) => setSelectedSemesterId(e.target.value)}
            className="flex-1 md:w-48 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-semibold"
          >
            {semesters.map(s => (
              <option key={s.id} value={s.id}>{s.semesterName}</option>
            ))}
          </select>
          <button 
            onClick={handleCalculate}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold text-sm shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {loading ? 'Đang tính...' : 'Tính học phí'}
          </button>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <Wallet size={20} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-70">Tổng học phí kỳ này</p>
            <h3 className="text-3xl font-black mt-1">{formatCurrency(tuitionData)}</h3>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold bg-white/10 w-fit px-2 py-1 rounded">
              <TrendingDown size={14} />
              Đã bao gồm các khoản miễn giảm
            </div>
          </div>
          <DollarSign className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-500" />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Số dư công nợ</p>
              <h3 className="text-2xl font-black text-red-600 mt-1">{formatCurrency(tuitionData)}</h3>
            </div>
            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
              <AlertCircle size={20} />
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <button className="flex-1 bg-red-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-red-700 transition-all">
              Thanh toán ngay
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tổng tín chỉ đăng ký</p>
              <h3 className="text-2xl font-black text-indigo-600 mt-1">{breakdown.newCredits + breakdown.retakeCredits} TC</h3>
            </div>
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <CreditCard size={20} />
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-gray-400">Học mới:</span>
              <span className="text-gray-700">{breakdown.newCredits} TC</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-gray-400">Học lại:</span>
              <span className="text-orange-600">{breakdown.retakeCredits} TC</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Breakdown Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <TrendingDown className="text-blue-600" size={18} />
              Chi tiết các khoản phí
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Môn học lần đầu</h4>
              {breakdown.new.length === 0 ? (
                <p className="text-xs text-gray-400 italic">Không có môn đăng ký mới</p>
              ) : (
                breakdown.new.map(reg => (
                  <div key={reg.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-700">{reg.courseName}</span>
                    <span className="text-xs font-bold text-blue-600">{reg.credits} TC</span>
                  </div>
                ))
              )}
            </div>
            
            <div className="pt-4 border-t border-gray-50 space-y-3">
              <h4 className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Môn học lại / Cải thiện</h4>
              {breakdown.retake.length === 0 ? (
                <p className="text-xs text-gray-400 italic">Không có môn đăng ký học lại</p>
              ) : (
                breakdown.retake.map(reg => (
                  <div key={reg.id} className="flex justify-between items-center p-3 bg-orange-50 border border-orange-100 rounded-xl">
                    <span className="text-sm font-semibold text-gray-700">{reg.courseName}</span>
                    <span className="text-xs font-bold text-orange-600">{reg.credits} TC</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* History / Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <History className="text-indigo-600" size={18} />
              Giao dịch gần đây
            </h2>
            <button className="text-[10px] font-bold text-blue-600 hover:underline">Xem tất cả</button>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center py-10 opacity-40">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <History size={24} />
            </div>
            <p className="text-sm font-bold">Chưa có giao dịch nào</p>
            <p className="text-xs">Lịch sử thanh toán của bạn sẽ xuất hiện tại đây.</p>
          </div>
          <div className="p-6 bg-indigo-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                  <DollarSign size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Thông tin chuyển khoản</p>
                  <p className="text-[10px] text-gray-500">Ngân hàng TMCP Ngoại Thương (VCB)</p>
                </div>
              </div>
              <ArrowRight className="text-indigo-600" size={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TuitionDashboardPage;
