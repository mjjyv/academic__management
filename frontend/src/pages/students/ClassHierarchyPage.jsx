// src/pages/students/ClassHierarchyPage.jsx
import { useState, useEffect } from 'react';
import { studentApi, classApi } from '../../api/studentApi';
import { ChevronRight, ChevronDown, Users, BookOpen, Layers, Search, Filter, RefreshCw, LayoutGrid, List, School, GraduationCap } from 'lucide-react';
import ClassDetailModal from '../../components/ClassDetailModal';

const ClassHierarchyPage = () => {
    const [hierarchy, setHierarchy] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedDepts, setExpandedDepts] = useState({});
    const [expandedMajors, setExpandedMajors] = useState({});

    const [selectedClassId, setSelectedClassId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchHierarchy();
    }, []);

    const fetchHierarchy = async () => {
        setLoading(true);
        try {
            const response = await classApi.getHierarchy();
            if (response.success) {
                setHierarchy(response.data);
                // Expand the first department by default
                if (response.data.length > 0) {
                    setExpandedDepts({ [response.data[0].id]: true });
                }
            }
        } catch (error) {
            console.error('Lỗi khi tải cấu trúc lớp:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleDept = (deptId) => {
        setExpandedDepts(prev => ({ ...prev, [deptId]: !prev[deptId] }));
    };

    const toggleMajor = (majorId) => {
        setExpandedMajors(prev => ({ ...prev, [majorId]: !prev[majorId] }));
    };

    const handleClassClick = (classId) => {
        setSelectedClassId(classId);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-black tracking-tight flex items-center gap-4">
                        <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200">
                            <Layers size={40} />
                        </div>
                        Cấu trúc Lớp & Ngành
                    </h1>
                    <p className="text-slate-800 mt-2 font-medium">Quản lý và tra cứu hệ thống lớp hành chính tập trung</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={fetchHierarchy} className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm">
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Đang tải cấu trúc...</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {hierarchy.map(dept => (
                        <div key={dept.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/30 overflow-hidden transition-all group">
                            {/* Department Header */}
                            <button
                                onClick={() => toggleDept(dept.id)}
                                className="w-full px-10 py-10 flex items-center justify-between hover:bg-slate-50/50 transition-all text-left"
                            >
                                <div className="flex items-center gap-8">
                                    <div className="w-18 h-18 bg-[#215B63] rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-slate-200">
                                        <School size={32} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black tracking-widest">KHOA</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-[#215B63] tracking-tight uppercase leading-tight">{dept.departmentName}</h3>
                                        <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mt-2">Cấu trúc: {dept.majors?.length || 0} Chuyên ngành đào tạo</p>
                                    </div>
                                </div>
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${expandedDepts[dept.id] ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-300'}`}>
                                    {expandedDepts[dept.id] ? <ChevronDown size={28} /> : <ChevronRight size={28} />}
                                </div>
                            </button>

                            {/* Majors List */}
                            {expandedDepts[dept.id] && (
                                <div className="px-10 pb-10 space-y-6 animate-in slide-in-from-top-4 duration-500">
                                    {dept.majors.map(major => (
                                        <div key={major.id} className="bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100">
                                            <button
                                                onClick={() => toggleMajor(major.id)}
                                                className="w-full flex items-center justify-between group/major"
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm group-hover/major:bg-indigo-600 group-hover/major:text-white transition-all">
                                                        <GraduationCap size={24} />
                                                    </div>
                                                    <div className="text-left">
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">CHUYÊN NGÀNH</span>
                                                        </div>
                                                        <h4 className="text-xl font-black text-black group-hover/major:text-indigo-600 transition-colors leading-none">{major.majorName}</h4>
                                                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1.5">{major.classes?.length || 0} Lớp hành chính đang quản lý</p>
                                                    </div>
                                                </div>
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${expandedMajors[major.id] ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}>
                                                    {expandedMajors[major.id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                                </div>
                                            </button>

                                            {/* Classes Grid */}
                                            {expandedMajors[major.id] && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8 animate-in zoom-in-95 duration-300">
                                                    {major.classes.map(cls => (
                                                        <div
                                                            key={cls.id}
                                                            onClick={() => handleClassClick(cls.id)}
                                                            className="group bg-white border border-slate-100 p-8 rounded-[2rem] hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-100/30 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[160px]"
                                                        >
                                                            <div className="absolute top-0 right-0 p-1">
                                                                <div className="w-12 h-12 bg-slate-50 rounded-bl-3xl flex items-center justify-center text-slate-200 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                                    <Users size={20} />
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <div className="text-[10px] font-black text-indigo-500 mb-2 uppercase tracking-widest">{cls.classCode}</div>
                                                                <h5 className="font-black text-black text-lg mb-4 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">{cls.className}</h5>
                                                            </div>

                                                            <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                                                                <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Khóa: {cls.courseYear || 'N/A'}</span>
                                                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 flex items-center gap-1">
                                                                    Chi tiết <ChevronRight size={14} />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {major.classes.length === 0 && (
                                                        <div className="col-span-full py-16 text-center bg-white/50 rounded-3xl border border-dashed border-slate-200">
                                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Chưa có lớp hành chính nào trong chuyên ngành này</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <ClassDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                classId={selectedClassId}
            />
        </div>
    );
};

export default ClassHierarchyPage;
