import { useState, useEffect } from 'react';
import { classApi } from '../api/studentApi';
import { trainingProgramApi } from '../api/trainingProgramApi';
import { X, Users, User, Info, School, Calendar, BookOpen, UserCheck, Search, ChevronRight, History, CheckCircle2, Clock, Zap, Loader2, Award } from 'lucide-react';
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
            case 'ACTIVE': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'RESERVED': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'DROPPED': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'GRADUATED': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            default: return 'bg-slate-50 text-slate-500 border-slate-100';
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-6xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-400 border border-white/20">

                {/* Header Section */}
                <div className="px-10 py-8 bg-slate-900 text-white flex flex-col md:flex-row justify-between items-center gap-6 shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                    
                    <div className="relative z-10 flex items-center gap-6">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-[1.5rem] border border-white/10 flex items-center justify-center text-indigo-400">
                            <Users size={32} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h3 className="text-3xl font-black tracking-tight uppercase">{classDetail?.classCode || 'Đang tải...'}</h3>
                                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-[10px] font-black tracking-widest border border-indigo-500/30">HÀNH CHÍNH</span>
                            </div>
                            <p className="text-slate-400 font-bold mt-1 uppercase tracking-wider text-xs">
                                {classDetail?.className || '...'} — {classDetail?.majorName}
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center gap-4">
                        <div className="flex bg-white/5 p-1.5 rounded-2xl backdrop-blur-xl border border-white/10">
                            <button 
                                onClick={() => setActiveTab('students')}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'students' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white'}`}
                            >
                                Sinh viên
                            </button>
                            <button 
                                onClick={() => setActiveTab('history')}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white'}`}
                            >
                                Học tập
                            </button>
                        </div>
                        <button onClick={onClose} className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all border border-white/10 group">
                            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-white">

                    {/* Sidebar: Info & Actions */}
                    <div className="w-full md:w-[320px] bg-slate-50/50 border-r border-slate-100 p-8 overflow-y-auto shrink-0 space-y-8">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Info size={14} /> Tổng quan lớp học
                            </h4>

                            <div className="space-y-3">
                                {[
                                    { label: 'Khoa đào tạo', val: classDetail?.departmentName, icon: School, color: 'text-indigo-500' },
                                    { label: 'Khóa / Năm học', val: classDetail?.courseYear, icon: Calendar, color: 'text-emerald-500' },
                                    { label: 'Cố vấn học tập', val: classDetail?.advisorName || 'Chưa phân công', icon: UserCheck, color: 'text-amber-500' },
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm group hover:border-indigo-200 transition-all">
                                        <label className="block text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">{item.label}</label>
                                        <p className="text-sm font-black text-slate-800 flex items-center gap-2">
                                            <item.icon size={14} className={item.color} />
                                            {item.val || '...'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTĐT Assignment Box */}
                        <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-slate-200 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Award size={14} className="text-amber-400" /> Chương trình đào tạo
                            </h5>
                            <select 
                                value={selectedProgramId}
                                onChange={(e) => setSelectedProgramId(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold p-3 outline-none mb-4 focus:ring-2 focus:ring-indigo-500 transition-all"
                            >
                                <option value="">-- Chọn CTĐT --</option>
                                {programs.map(p => (
                                    <option key={p.id} value={p.id}>{p.programCode}</option>
                                ))}
                            </select>
                            <button 
                                onClick={handleAssignProgram}
                                disabled={assigning}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/50 active:scale-95"
                            >
                                {assigning ? <Loader2 size={14} className="animate-spin" /> : 'Áp dụng cho cả lớp'}
                            </button>
                        </div>
                    </div>

                    {/* Content View Area */}
                    <div className="flex-1 flex flex-col bg-white overflow-hidden p-8">
                        {activeTab === 'students' ? (
                            <>
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-slate-900 tracking-tight">Danh sách lớp</h4>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sĩ số: {classDetail?.students?.length || 0} sinh viên</p>
                                        </div>
                                    </div>
                                    <div className="relative group w-72">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm sinh viên..."
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {filteredStudents.map((student, idx) => (
                                            <div key={student.id} className="group p-5 bg-white border border-slate-100 rounded-[1.5rem] hover:border-indigo-100 hover:bg-indigo-50/20 transition-all flex items-center justify-between shadow-sm hover:shadow-lg">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 font-black group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                        {idx + 1}
                                                    </div>
                                                    <div>
                                                        <h5 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{student.fullName}</h5>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MSSV: {student.studentCode}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStatusBadgeClass(student.statusCode)}`}>
                                                    {student.statusName}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col overflow-hidden">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                                        <History size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-slate-900 tracking-tight">Lịch sử đào tạo</h4>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Các lớp học phần lớp đã tham gia</p>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                    <div className="space-y-4">
                                        {history.map((item) => (
                                            <div key={item.sectionId} className="p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] hover:bg-white hover:border-indigo-100 hover:shadow-xl transition-all group">
                                                <div className="flex items-start justify-between gap-6 mb-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                                            <BookOpen size={24} />
                                                        </div>
                                                        <div>
                                                            <h5 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{item.courseName}</h5>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{item.classCode}</span>
                                                                <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Môn: {item.courseCode}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Tình trạng</p>
                                                        <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                                                            item.status === 'finished' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                                        }`}>
                                                            {item.status === 'finished' ? 'Đã kết thúc' : 'Đang học'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-6 bg-white p-5 rounded-[1.5rem] border border-slate-50 shadow-sm">
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Học kỳ</p>
                                                        <p className="text-xs font-bold text-slate-700">{item.semesterName}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Giảng viên</p>
                                                        <p className="text-xs font-bold text-slate-700">{item.lecturerName}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Sĩ số</p>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-indigo-400 rounded-full" />
                                                            <p className="text-xs font-black text-slate-700">{item.studentCount} SV</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassDetailModal;
