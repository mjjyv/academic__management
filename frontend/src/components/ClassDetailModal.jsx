import { useState, useEffect } from 'react';
import { classApi } from '../api/studentApi';
import { trainingProgramApi } from '../api/trainingProgramApi';
import { X, Users, User, Info, School, Calendar, BookOpen, UserCheck, Search, ChevronRight, History, CheckCircle2, Clock, Zap, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ClassDetailModal = ({ isOpen, onClose, classId }) => {
    const [classDetail, setClassDetail] = useState(null);
    const [history, setHistory] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [selectedProgramId, setSelectedProgramId] = useState('');
    const [assigning, setAssigning] = useState(false);
    const [loading, setLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('students'); // 'students' | 'history'

    useEffect(() => {
        if (isOpen && classId) {
            fetchClassDetail();
            fetchClassHistory();
            fetchPrograms();
        }
    }, [isOpen, classId]);

    const fetchPrograms = async () => {
        try {
            const res = await trainingProgramApi.getAll();
            if (res.success) setPrograms(res.data);
        } catch (error) {
            console.error("Error fetching programs", error);
        }
    };

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

    const handleAssignProgram = async () => {
        if (!selectedProgramId) {
            toast.error("Vui lòng chọn chương trình đào tạo");
            return;
        }

        if (window.confirm("Hệ thống sẽ cập nhật CTĐT cho TOÀN BỘ sinh viên trong lớp. Bạn có chắc chắn?")) {
            setAssigning(true);
            try {
                const res = await classApi.assignProgram(classId, selectedProgramId);
                if (res.success) {
                    toast.success("Gán chương trình đào tạo thành công");
                    fetchClassDetail();
                }
            } catch (error) {
                toast.error("Lỗi khi gán chương trình đào tạo");
            } finally {
                setAssigning(false);
            }
        }
    };

    const fetchClassHistory = async () => {
        setHistoryLoading(true);
        try {
            const response = await classApi.getClassCourseHistory(classId);
            if (response.success) {
                setHistory(response.data);
            }
        } catch (error) {
            console.error('Lỗi khi tải lịch sử học phần lớp:', error);
        } finally {
            setHistoryLoading(false);
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

    const getSectionStatusBadge = (status) => {
        switch (status) {
            case 'finished': return 'bg-green-100 text-green-700 border-green-200';
            case 'open': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'planned': return 'bg-gray-100 text-gray-600 border-gray-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
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
                    <div className="flex items-center gap-4">
                        <div className="flex bg-white/10 p-1 rounded-xl backdrop-blur-md">
                            <button 
                                onClick={() => setActiveTab('students')}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'students' ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-100 hover:text-white'}`}
                            >
                                Sinh viên
                            </button>
                            <button 
                                onClick={() => setActiveTab('history')}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'history' ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-100 hover:text-white'}`}
                            >
                                Lịch sử học tập
                            </button>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>
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

                                <div className="bg-slate-800 p-4 rounded-2xl shadow-lg text-white">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                                        <Zap size={12} className="text-amber-400" /> Thiết lập CTĐT cho lớp
                                    </label>
                                    <select 
                                        value={selectedProgramId}
                                        onChange={(e) => setSelectedProgramId(e.target.value)}
                                        className="w-full bg-slate-700 border-none rounded-xl text-xs font-bold p-2.5 outline-none mb-3"
                                    >
                                        <option value="">-- Chọn chương trình --</option>
                                        {programs.map(p => (
                                            <option key={p.id} value={p.id}>{p.programName} ({p.programCode})</option>
                                        ))}
                                    </select>
                                    <button 
                                        onClick={handleAssignProgram}
                                        disabled={assigning}
                                        className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                    >
                                        {assigning ? <Loader2 size={12} className="animate-spin" /> : 'Gán cho cả lớp'}
                                    </button>
                                </div>

                                <div className="bg-blue-600 p-5 rounded-2xl shadow-lg shadow-blue-100 text-white">
                                    <label className="block text-[10px] font-bold text-blue-200 uppercase mb-1">Sĩ số lớp</label>
                                    <p className="text-3xl font-black">{classDetail.students?.length || 0} <span className="text-sm font-medium text-blue-100">sinh viên</span></p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Content Area */}
                    <div className="flex-1 flex flex-col bg-white overflow-hidden">
                        {activeTab === 'students' ? (
                            <>
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
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <History size={20} className="text-blue-600" /> Lịch sử học tập lớp hành chính
                                    </h4>
                                    <p className="text-xs text-gray-400 mt-1">Danh sách các lớp học phần mà sinh viên lớp này đã/đang tham gia</p>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6">
                                    {historyLoading ? (
                                        <div className="space-y-4">
                                            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-50 rounded-2xl animate-pulse"></div>)}
                                        </div>
                                    ) : history.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-400 italic">
                                            <History size={48} className="mb-4 opacity-20" />
                                            <p>Chưa có dữ liệu lịch sử học tập.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {history.map((item) => (
                                                <div key={item.sectionId} className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-blue-200 hover:shadow-md hover:shadow-blue-50/50 transition-all group">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                                <BookOpen size={18} />
                                                            </div>
                                                            <div>
                                                                <h5 className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">{item.courseName}</h5>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.courseCode}</span>
                                                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">{item.classCode}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="text-right">
                                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Trạng thái lớp</p>
                                                                <div className={`mt-1 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase ${getSectionStatusBadge(item.status)}`}>
                                                                    {item.status === 'finished' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                                                    {item.status === 'finished' ? 'Đã kết thúc' : item.status === 'open' ? 'Đang học' : 'Dự kiến'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                                                        <div>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Học kỳ</p>
                                                            <p className="text-xs font-bold text-gray-700">{item.semesterName}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Giảng viên</p>
                                                            <p className="text-xs font-bold text-gray-700">{item.lecturerName}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Số SV tham gia</p>
                                                            <p className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                                                <Users size={12} className="text-blue-500" /> {item.studentCount} sinh viên
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} className="px-6 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
                        Đóng cửa sổ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClassDetailModal;
