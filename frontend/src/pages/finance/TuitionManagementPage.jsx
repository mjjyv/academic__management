import React, { useEffect, useState } from 'react';
import { Landmark, Search, Filter, DollarSign, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';
import { departmentApi } from '../../api/departmentApi';
import toast from 'react-hot-toast';

const TuitionManagementPage = () => {
  const { studentTuitions, fetchAllTuitions, loading } = useFinanceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchAllTuitions(selectedDeptId || null);
  }, [fetchAllTuitions, selectedDeptId]);

  const fetchDepartments = async () => {
    try {
      const res = await departmentApi.getAllActive();
      if (res.success) setDepartments(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách khoa", error);
    }
  };

  const filteredTuitions = studentTuitions.filter(t =>
    (t.studentName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (t.studentCode?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 1: return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 size={12} /> ĐÃ NỘP</span>;
      case 2: return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={12} /> NỘP MỘT PHẦN</span>;
      case 3: return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><AlertCircle size={12} /> CÒN NỢ</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">KHÔNG XÁC ĐỊNH</span>;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Landmark className="text-indigo-600" />
            Quản lý Học phí Sinh viên
          </h1>
          <p className="text-sm text-gray-500">Theo dõi công nợ và trạng thái thanh toán của toàn bộ sinh viên.</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 w-full md:w-auto">
            <Filter size={16} className="text-gray-400" />
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="bg-transparent text-sm text-gray-600 outline-none min-w-[150px]"
            >
              <option value="">Tất cả các khoa</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm MSSV, tên SV..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Sinh viên</th>
                  <th className="px-6 py-4">Học kỳ</th>
                  <th className="px-6 py-4 text-right">Phải nộp</th>
                  <th className="px-6 py-4 text-right">Đã nộp</th>
                  <th className="px-6 py-4 text-right">Còn nợ</th>
                  <th className="px-6 py-4 text-center">Trạng thái</th>
                  <th className="px-6 py-4 text-center">Hạn chót</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredTuitions.map((t) => (
                  <tr key={t.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-gray-800">{t.studentName}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{t.studentCode}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-600">{t.semesterName}</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-800">{formatCurrency(t.netAmount)}</td>
                    <td className="px-6 py-4 text-right font-bold text-green-600">{formatCurrency(t.paidAmount)}</td>
                    <td className="px-6 py-4 text-right font-bold text-red-600">{formatCurrency(t.debtAmount)}</td>
                    <td className="px-6 py-4 text-center">{getStatusBadge(t.status)}</td>
                    <td className="px-6 py-4 text-center text-gray-500 font-mono text-xs">
                      {t.deadline ? new Date(t.deadline).toLocaleDateString('vi-VN') : '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TuitionManagementPage;
