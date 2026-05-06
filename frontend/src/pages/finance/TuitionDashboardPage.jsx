import React, { useEffect } from 'react';
import { Wallet, CheckCircle2, BookOpen, Calendar, CreditCard, History, AlertCircle, TrendingDown, ArrowRight } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';
import useAuthStore from '../../store/useAuthStore';
import { toast } from 'react-hot-toast';

const TuitionDashboardPage = () => {
  const { 
    tuitionData, 
    studentTuitions, 
    totalDebt,
    totalPaid,
    fetchCurrentTuition, 
    fetchDebtSummary, 
    calculateCurrentTuition, 
    loading 
  } = useFinanceStore();
  
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchCurrentTuition();
      fetchDebtSummary();
    }
  }, [user, fetchCurrentTuition, fetchDebtSummary]);

  const handleCalculate = async () => {
    if (!tuitionData?.semesterId && !user?.id) return;
    try {
      // If we don't have tuitionData yet, we might need a default semester or just wait
      const semesterId = tuitionData?.semesterId;
      if (semesterId) {
        await calculateCurrentTuition(user.id, semesterId);
        await fetchCurrentTuition();
        await fetchDebtSummary();
        toast.success("Đã cập nhật dữ liệu học phí kỳ này");
      }
    } catch (error) {
      toast.error("Không thể tính toán học phí");
    }
  };

  const currentTuition = tuitionData || {};
  const paidPercent = currentTuition.netAmount > 0 
    ? Math.round((currentTuition.paidAmount / currentTuition.netAmount) * 100) 
    : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const getTuitionBreakdown = () => {
    const details = currentTuition.details || [];
    const newCourses = details.filter(d => d.registrationType === 1);
    const retakeCourses = details.filter(d => d.registrationType === 2 || d.registrationType === 3);

    return {
      new: newCourses,
      retake: retakeCourses,
      newCredits: newCourses.reduce((acc, curr) => acc + (curr.credits || 0), 0),
      retakeCredits: retakeCourses.reduce((acc, curr) => acc + (curr.credits || 0), 0),
    };
  };

  // Only show semesters where student has registered courses
  const filteredHistory = studentTuitions.filter(t => t.totalCredits > 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. PREMIUM HERO SECTION */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col xl:flex-row gap-8 items-stretch">
        {/* Main Glassmorphism Card */}
        <div className="flex-[2] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-600/30">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-bold opacity-80 mb-1">Tổng học phí kỳ này</h1>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                    {currentTuition.semesterName || 'Học kỳ hiện tại'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {loading && <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />}
                  <button 
                    onClick={handleCalculate}
                    disabled={loading || !currentTuition.semesterId}
                    className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/10 transition-colors"
                    title="Cập nhật học phí"
                  >
                    <Wallet size={24} />
                  </button>
                </div>
              </div>
              <div className="mt-10">
                <h2 className="text-5xl font-black tracking-tighter">
                  {formatCurrency(currentTuition.netAmount || 0)}
                </h2>
                <div className="flex items-center gap-4 mt-6">
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/5 flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${currentTuition.status === 1 ? 'bg-green-400' : (currentTuition.totalCredits > 0 ? 'bg-red-400' : 'bg-gray-400')}`} />
                      Trạng thái: {currentTuition.status === 1 ? 'ĐÃ THANH TOÁN' : (currentTuition.totalCredits > 0 ? 'Còn nợ' : 'Chưa đăng ký môn học')}
                  </div>
                  {currentTuition.deadline && (
                    <div className="bg-orange-500/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-orange-500/20 flex items-center gap-3">
                      <Calendar size={14} className="text-orange-300" />
                      <span className="text-xs font-bold text-orange-100">Hạn: {new Date(currentTuition.deadline).toLocaleDateString('vi-VN')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-12 flex items-center gap-6 border-t border-white/10 pt-8">
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase opacity-60 mb-2">Tiến độ thanh toán</p>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400 rounded-full transition-all duration-1000" style={{ width: `${paidPercent}%` }} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black">{paidPercent}%</p>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
        </div>

        {/* Action & Stats Panel */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex-1 flex flex-col justify-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Số dư còn nợ</p>
            <h3 className="text-3xl font-black text-red-600 mb-6">{formatCurrency(totalDebt)}</h3>
        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3">
              <CreditCard size={20} />
              THANH TOÁN QUA VNPAY
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Đã nộp</p>
              <p className="text-lg font-black text-green-600">{formatCurrency(totalPaid)}</p>
            </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Miễn giảm</p>
              <p className="text-lg font-black text-amber-500">-{formatCurrency((currentTuition.scholarshipDeduction || 0) + (currentTuition.exemptionAmount || 0))}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BREAKDOWN & ANALYSIS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Detailed Breakdown */}
        <div className="xl:col-span-2 bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <TrendingDown size={20} />
                </div>
                Chi tiết các khoản phí
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black bg-gray-100 px-4 py-2 rounded-xl text-gray-500">Tổng: {currentTuition.totalCredits || 0} TC</span>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <CheckCircle2 size={12} className="text-blue-500" />
                Môn học học mới (500k/TC)
              </h4>
              {breakdown.new.length === 0 ? (
                <div className="py-10 flex flex-col items-center opacity-20">
                  <BookOpen size={32} />
                  <p className="text-[10px] font-black mt-2 italic">Không có môn học mới</p>
                </div>
              ) : (
                breakdown.new.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl group hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-600 shadow-sm">
                        <BookOpen size={14} />
                      </div>
                      <span className="text-sm font-bold text-gray-700 leading-tight">{item.courseName}</span>
                    </div>
                    <span className="text-xs font-black text-blue-600">{item.credits} TC</span>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <AlertCircle size={12} />
                Học lại / Cải thiện (750k/TC)
              </h4>
              {breakdown.retake.length === 0 ? (
                <div className="py-10 flex flex-col items-center opacity-20">
                  <TrendingDown size={32} />
                  <p className="text-[10px] font-black mt-2 italic">Không có môn học lại</p>
                </div>
              ) : (
                breakdown.retake.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-orange-50/50 rounded-2xl group hover:bg-white hover:shadow-lg transition-all border border-orange-100/20 hover:border-orange-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-orange-500 shadow-sm">
                        <AlertCircle size={14} />
                      </div>
                      <span className="text-sm font-bold text-gray-700 leading-tight">{item.courseName}</span>
                    </div>
                    <span className="text-xs font-black text-orange-600">{item.credits} TC</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Summary & History */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 h-full">
            <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <History size={20} />
              </div>
              Lịch sử các kỳ
            </h2>
            <div className="space-y-4">
              {filteredHistory.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-4">Chưa có lịch sử học phí</p>
              ) : (
                filteredHistory.map(t => (
                  <div key={t.id} className={`p-4 rounded-2xl border transition-all ${t.semesterId === currentTuition.semesterId ? 'border-blue-200 bg-blue-50/50' : 'border-gray-50 hover:bg-gray-50'}`}>
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-black text-gray-700">{t.semesterName}</p>
                      <span className={`text-[9px] font-black px-2 py-1 rounded-lg ${t.status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {t.status === 1 ? 'ĐÃ THANH TOÁN' : 'CÒN NỢ'}
                      </span>
                    </div>
                    <div className="flex justify-between items-end mt-3">
                      <p className="text-xs text-gray-400 font-bold tracking-wider">{t.totalCredits} Tín chỉ</p>
                      <p className="text-sm font-black text-gray-800">{formatCurrency(t.netAmount)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => window.location.href = '/registration'}
              className="w-full mt-8 py-4 text-xs font-black text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all uppercase tracking-widest flex items-center justify-center gap-2"
            >
              Tiếp tục đăng ký môn học
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Bar (Responsive Mobile Only) */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-white/20 z-50 flex justify-between items-center gap-4">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase">Còn nợ</p>
          <p className="text-sm font-black text-red-600">{formatCurrency(currentTuition.debtAmount)}</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-xs font-black shadow-lg shadow-blue-500/30">
          THANH TOÁN
        </button>
      </div>
    </div>
  );
};

export default TuitionDashboardPage;
