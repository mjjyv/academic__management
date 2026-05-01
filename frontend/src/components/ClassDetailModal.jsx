import { useState, useEffect } from 'react';
import { classApi } from '../api/studentApi';
import { X, Users, User, Info, School, Calendar, BookOpen, UserCheck, Search, ChevronRight } from 'lucide-react';

const ClassDetailModal = ({ isOpen, onClose, classId }) => {
    const [classDetail, setClassDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen && classId) {
            fetchClassDetail();
        }
    }, [isOpen, classId]);

    const fetchClassDetail = async () => {
        setLoading(true);
        try {
            const response = await classApi.getById(classId);
            if (response.success) {
                setClassDetail(response.data);
            }
        } catch (error) {
            console.error('Lỗi khi tải chi tiết lớp:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const filteredStudents = classDetail?.students?.filter(s =>
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentCode.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const getStatusBadgeClass = (code) => {
        switch (code) {
            case 'ACTIVE': return 'bg-green-100 text-green-700';
            case 'RESERVED': return 'bg-amber-100 text-amber-700';
            case 'DROPPED': return 'bg-red-100 text-red-700';
            case 'GRADUATED': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-8 py-6 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex justify-between items-start shrink-0">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <Users size={24} className="text-blue-200" />
                            <h3 className="text-2xl font-black tracking-tight">Chi tiết Lớp hành chính</h3>
                        </div>
                        {classDetail && (
                            <p className="text-blue-100 text-sm font-medium">
                                {classDetail.className} — <span className="text-white font-bold">{classDetail.classCode}</span>
                            </p>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">

                    {/* Left: General Info */}
                    <div className="w-full md:w-80 bg-gray-50 border-r border-gray-100 p-6 overflow-y-auto shrink-0">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Info size={14} /> Thông tin chung
                        </h4>

                        {loading ? (
                            <div className="space-y-4 animate-pulse">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-12 bg-gray-200 rounded-xl"></div>)}
                            </div>
                        ) : classDetail && (
                            <div className="space-y-6">
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Ngành học</label>
                                    <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                        <BookOpen size={14} className="text-blue-500" /> {classDetail.majorName}
                                    </p>
                                </div>

                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Khoa / Viện</label>
                                    <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                        <School size={14} className="text-indigo-500" /> {classDetail.departmentName}
                                    </p>
                                </div>

                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Khóa học</label>
                                    <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                        <Calendar size={14} className="text-emerald-500" /> {classDetail.courseYear || 'N/A'}
                                    </p>
                                </div>

                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Cố vấn học tập</label>
                                    <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                        <UserCheck size={14} className="text-amber-500" /> {classDetail.advisorName || 'Chưa phân công'}
                                    </p>
                                </div>

                                <div className="bg-blue-600 p-5 rounded-2xl shadow-lg shadow-blue-100 text-white">
                                    <label className="block text-[10px] font-bold text-blue-200 uppercase mb-1">Sĩ số lớp</label>
                                    <p className="text-3xl font-black">{classDetail.students?.length || 0} <span className="text-sm font-medium text-blue-100">sinh viên</span></p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Students List */}
                    <div className="flex-1 flex flex-col bg-white">
                        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <User size={20} className="text-blue-600" /> Danh sách sinh viên
                            </h4>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Tìm sinh viên trong lớp..."
                                    className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64 transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {loading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse"></div>)}
                                </div>
                            ) : filteredStudents.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 italic">
                                    <User size={48} className="mb-4 opacity-20" />
                                    <p>Không có dữ liệu sinh viên phù hợp.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-3">
                                    {filteredStudents.map((student, idx) => (
                                        <div key={student.id} className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <h5 className="text-sm font-bold text-gray-800 group-hover:text-blue-700 transition-colors">{student.fullName}</h5>
                                                    <p className="text-xs text-gray-500 font-medium">MSSV: <span className="text-gray-900">{student.studentCode}</span></p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="hidden sm:block text-right">
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Trạng thái</p>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${getStatusBadgeClass(student.statusCode)}`}>
                                                        {student.statusName}
                                                    </span>
                                                </div>
                                                <button className="p-2 text-gray-300 hover:text-blue-600 hover:bg-white rounded-lg transition-all shadow-sm">
                                                    <ChevronRight size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} className="px-6 py-2 text-sm font-bold text-gray-600 hover:text-gray-900">
                        Đóng cửa sổ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClassDetailModal;
