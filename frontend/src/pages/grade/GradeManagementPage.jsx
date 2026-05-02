import React, { useEffect, useState } from 'react';
import { Users, Search, Filter, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import useGradeStore from '../../store/useGradeStore';
import toast from 'react-hot-toast';

const GradeManagementPage = () => {
  const { summaries, fetchAllSummaries, loading } = useGradeStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllSummaries();
  }, [fetchAllSummaries]);

  const filteredSummaries = summaries.filter(s => 
    s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="text-blue-600" />
            Quản lý Kết quả học tập
          </h1>
          <p className="text-sm text-gray-500">Xem và quản lý điểm tổng kết của toàn bộ sinh viên.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm tên SV, tên môn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
          />
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
                  <th className="px-6 py-4">Môn học</th>
                  <th className="px-6 py-4 text-center">Tổng điểm</th>
                  <th className="px-6 py-4 text-center">Điểm chữ</th>
                  <th className="px-6 py-4 text-center">GPA</th>
                  <th className="px-6 py-4 text-center">Kết quả</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredSummaries.map((s) => (
                  <tr key={s.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 font-bold text-gray-800">{s.studentName}</td>
                    <td className="px-6 py-4 font-medium text-gray-700">{s.courseName}</td>
                    <td className="px-6 py-4 text-center font-bold">{s.totalScore?.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-black">
                        {s.letterGrade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-blue-600">{s.gpaValue?.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {s.result === 'PASS' ? (
                          <span className="flex items-center gap-1 text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full text-[10px]">
                            <CheckCircle2 size={12} /> ĐẠT
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full text-[10px]">
                            <AlertCircle size={12} /> KHÔNG ĐẠT
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-blue-600 transition-all p-2">
                        <FileText size={18} />
                      </button>
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

export default GradeManagementPage;
