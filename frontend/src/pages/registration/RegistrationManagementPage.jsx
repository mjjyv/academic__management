import React, { useEffect, useState } from 'react';
import { Plus, Calendar, Edit, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react';
import useRegistrationStore from '../../store/useRegistrationStore';
import RegistrationPeriodModal from '../../features/registration/components/RegistrationPeriodModal';

const RegistrationManagementPage = () => {
  const { periods, loading, fetchPeriods, removePeriod } = useRegistrationStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  useEffect(() => {
    fetchPeriods();
  }, [fetchPeriods]);

  const handleEdit = (period) => {
    setSelectedPeriod(period);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đợt đăng ký này?')) {
      removePeriod(id);
    }
  };

  const getStatus = (start, end) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (now < startDate) return { label: 'Sắp diễn ra', color: 'bg-blue-100 text-blue-700', icon: Clock };
    if (now > endDate) return { label: 'Đã kết thúc', color: 'bg-gray-100 text-gray-700', icon: XCircle };
    return { label: 'Đang diễn ra', color: 'bg-green-100 text-green-700', icon: CheckCircle };
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Calendar className="text-blue-600" />
            Quản lý Đợt Đăng ký
          </h1>
          <p className="text-gray-500 text-sm mt-1">Cấu hình thời gian và điều kiện đăng ký học phần cho sinh viên</p>
        </div>
        <button
          onClick={() => { setSelectedPeriod(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-blue-500/30 font-bold"
        >
          <Plus size={20} />
          Tạo đợt mới
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && periods.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 font-medium">Chưa có đợt đăng ký nào được tạo</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {periods.map((period) => {
          const status = getStatus(period.startTime, period.endTime);
          const StatusIcon = status.icon;

          return (
            <div key={period.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 group-hover:w-2 transition-all"></div>
              
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${status.color}`}>
                  <StatusIcon size={14} />
                  {status.label}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(period)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(period.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-4">{period.name}</h3>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600 gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="font-semibold">Học kỳ:</span> {period.semesterName}
                </div>
                <div className="flex items-center text-sm text-gray-600 gap-2">
                  <Clock size={16} className="text-gray-400" />
                  <span className="font-semibold">Thời gian:</span> 
                  {new Date(period.startTime).toLocaleString('vi-VN')} - {new Date(period.endTime).toLocaleString('vi-VN')}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-50">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Tín chỉ Tối đa</p>
                    <p className="text-lg font-bold text-gray-700">{period.maxCredits}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Tín chỉ Tối thiểu</p>
                    <p className="text-lg font-bold text-gray-700">{period.minCredits}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <RegistrationPeriodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPeriod={selectedPeriod}
      />
    </div>
  );
};

export default RegistrationManagementPage;
