import React, { useEffect, useState } from 'react';
import { Settings, Plus, Edit2, Check, X, DollarSign, Tag } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';
import toast from 'react-hot-toast';

const TuitionConfigPage = () => {
  const { tuitionFees, fetchTuitionFees, saveTuitionFee, loading } = useFinanceStore();
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ courseYear: '', pricePerCredit: '', feeType: 'NEW' });

  useEffect(() => {
    fetchTuitionFees();
  }, [fetchTuitionFees]);

  const handleEdit = (fee) => {
    setEditingId(fee.id);
    setFormData({ 
      id: fee.id, 
      courseYear: fee.courseYear, 
      pricePerCredit: fee.pricePerCredit, 
      feeType: fee.feeType 
    });
  };

  const handleSave = async () => {
    try {
      await saveTuitionFee(formData);
      toast.success("Đã lưu định mức học phí");
      setEditingId(null);
      fetchTuitionFees();
    } catch (error) {
      toast.error("Lỗi khi lưu dữ liệu");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cấu hình Định mức Học phí</h1>
          <p className="text-sm text-gray-500">Quản lý đơn giá tín chỉ cho các khóa học và loại đăng ký.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId('new');
            setFormData({ courseYear: 'K24', pricePerCredit: '', feeType: 'NEW' });
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={18} />
          Thêm định mức mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Khóa học</th>
              <th className="px-6 py-4">Loại phí</th>
              <th className="px-6 py-4">Đơn giá / Tín chỉ</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {editingId === 'new' && (
               <tr className="bg-blue-50/50 animate-in fade-in zoom-in-95 duration-200">
                <td className="px-6 py-4">
                  <input 
                    type="text" 
                    value={formData.courseYear}
                    onChange={(e) => setFormData({...formData, courseYear: e.target.value})}
                    className="w-24 px-3 py-1 border border-blue-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
                    placeholder="K24"
                  />
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={formData.feeType}
                    onChange={(e) => setFormData({...formData, feeType: e.target.value})}
                    className="px-3 py-1 border border-blue-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
                  >
                    <option value="NEW">Học mới (NEW)</option>
                    <option value="RETAKE">Học lại (RETAKE)</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="number" 
                      value={formData.pricePerCredit}
                      onChange={(e) => setFormData({...formData, pricePerCredit: e.target.value})}
                      className="pl-8 pr-4 py-1 border border-blue-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold w-40"
                      placeholder="0.00"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={handleSave} className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"><Check size={16} /></button>
                    <button onClick={() => setEditingId(null)} className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-all"><X size={16} /></button>
                  </div>
                </td>
              </tr>
            )}

            {tuitionFees.map((fee) => (
              <tr key={fee.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  {editingId === fee.id ? (
                    <input 
                      type="text" 
                      value={formData.courseYear}
                      onChange={(e) => setFormData({...formData, courseYear: e.target.value})}
                      className="w-24 px-3 py-1 border border-blue-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
                    />
                  ) : (
                    <span className="font-bold text-gray-800">{fee.courseYear}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === fee.id ? (
                    <select 
                      value={formData.feeType}
                      onChange={(e) => setFormData({...formData, feeType: e.target.value})}
                      className="px-3 py-1 border border-blue-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
                    >
                      <option value="NEW">Học mới (NEW)</option>
                      <option value="RETAKE">Học lại (RETAKE)</option>
                    </select>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black ${fee.feeType === 'NEW' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                      {fee.feeType}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === fee.id ? (
                    <div className="relative">
                      <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="number" 
                        value={formData.pricePerCredit}
                        onChange={(e) => setFormData({...formData, pricePerCredit: e.target.value})}
                        className="pl-8 pr-4 py-1 border border-blue-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold w-40"
                      />
                    </div>
                  ) : (
                    <span className="font-mono text-blue-600 font-bold">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(fee.pricePerCredit)}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {editingId === fee.id ? (
                    <div className="flex justify-end gap-2">
                      <button onClick={handleSave} className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"><Check size={16} /></button>
                      <button onClick={() => setEditingId(null)} className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-all"><X size={16} /></button>
                    </div>
                  ) : (
                    <button onClick={() => handleEdit(fee)} className="p-2 text-gray-400 hover:text-blue-600 transition-all">
                      <Edit2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tuitionFees.length === 0 && !loading && editingId !== 'new' && (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400 opacity-50">
            <Tag size={48} className="mb-4" />
            <p className="font-bold">Chưa có định mức nào được thiết lập</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TuitionConfigPage;
