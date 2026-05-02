import React, { useEffect } from 'react';
import { Award, BookOpen, ChevronRight, Filter, Download } from 'lucide-react';
import useGradeStore from '../../store/useGradeStore';
import useAuthStore from '../../store/useAuthStore';

const StudentTranscriptPage = () => {
  const { summaries, loading, fetchStudentSummaries, calculateGPA } = useGradeStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id) {
      fetchStudentSummaries(user.id);
    }
  }, [user, fetchStudentSummaries]);

  const gpa = calculateGPA();

  const getGradeColor = (letter) => {
    const colors = {
      'A': 'text-green-600 bg-green-100',
      'B': 'text-blue-600 bg-blue-100',
      'C': 'text-yellow-600 bg-yellow-100',
      'D': 'text-orange-600 bg-orange-100',
      'F': 'text-red-600 bg-red-100',
    };
    return colors[letter[0]] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* GPA Summary Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl shadow-blue-500/20 flex justify-between items-center relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold mb-2">Kết quả học tập</h1>
            <p className="opacity-80">Chào {user?.fullName}, đây là bảng điểm tích lũy của bạn.</p>
            <div className="mt-6 flex gap-4">
              <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-all text-sm font-bold backdrop-blur-md">
                <Download size={18} />
                Tải bảng điểm (PDF)
              </button>
            </div>
          </div>
          <div className="relative z-10 text-center bg-white/10 p-6 rounded-3xl backdrop-blur-xl border border-white/20 min-w-[140px]">
            <p className="text-xs uppercase font-bold tracking-widest opacity-70 mb-1">GPA Tích lũy</p>
            <p className="text-5xl font-black tracking-tighter">{gpa}</p>
          </div>
          <Award className="absolute -right-8 -bottom-8 text-white/10 w-48 h-48 rotate-12" />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
              <Filter className="text-blue-600" size={18} />
              Trạng thái học tập
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Tổng tín chỉ tích lũy</span>
                <span className="font-bold text-gray-800">{summaries.length * 3}</span> {/* Giả định mỗi môn 3 tín chỉ */}
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Trình độ đào tạo</span>
                <span className="font-bold text-blue-600">Đại học chính quy</span>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-xs text-blue-700 leading-relaxed italic">
              * Hệ thống đã tự động lọc các điểm cũ của môn học đã được học lại thành công.
            </p>
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="text-blue-600" size={20} />
            Bảng điểm chi tiết
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Môn học</th>
                  <th className="px-6 py-4 text-center">Điểm tổng kết</th>
                  <th className="px-6 py-4 text-center">Điểm chữ</th>
                  <th className="px-6 py-4 text-center">Thang 4</th>
                  <th className="px-6 py-4 text-center">Kết quả</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {summaries.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic">Chưa có dữ liệu điểm</td>
                  </tr>
                ) : (
                  summaries.map((s) => (
                    <tr key={s.id} className="hover:bg-blue-50/30 transition-all group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                            {s.courseName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">{s.courseName}</p>
                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">ID: {s.id.substring(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-black text-gray-700">{s.totalScore?.toFixed(1) || '--'}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-black ${getGradeColor(s.letterGrade || 'F')}`}>
                          {s.letterGrade || 'F'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-blue-600">{s.gpaValue?.toFixed(1) || '0.0'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          {s.result === 'PASS' ? (
                            <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold">ĐẠT</span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold">KHÔNG ĐẠT</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTranscriptPage;
