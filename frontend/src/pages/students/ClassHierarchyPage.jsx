// src/pages/students/ClassHierarchyPage.jsx
import { useState, useEffect } from 'react';
import { studentApi, classApi } from '../../api/studentApi';
import { ChevronRight, ChevronDown, Users, BookOpen, Layers, Search, Filter, RefreshCw, LayoutGrid, List } from 'lucide-react';
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
            const response = await studentApi.getClassHierarchy();
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
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                        <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100">
                            <Layers size={32} />
                        </div>
                        Cấu trúc Lớp & Ngành
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Khám phá hệ thống lớp hành chính theo Khoa và Chuyên ngành</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={fetchHierarchy} className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm">
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                        <button className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100"><LayoutGrid size={20} /></button>
                        <button className="p-2 text-slate-300 hover:text-slate-600 transition-all"><List size={20} /></button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Đang truy xuất cấu trúc dữ liệu...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {hierarchy.map(dept => (
                        <div key={dept.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden transition-all group">
                            {/* Department Header */}
                            <button 
                                onClick={() => toggleDept(dept.id)}
                                className="w-full px-10 py-8 flex items-center justify-between hover:bg-slate-50/50 transition-all text-left"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                        <BookOpen size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{dept.name}</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Gồm {dept.majors?.length || 0} chuyên ngành</p>
                                    </div>
                                </div>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${expandedDepts[dept.id] ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-300'}`}>
                                    {expandedDepts[dept.id] ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
                                </div>
                            </button>

                            {/* Majors List */}
                            {expandedDepts[dept.id] && (
                                <div className="px-10 pb-10 space-y-6 animate-in slide-in-from-top-4 duration-500">
                                    {dept.majors.map(major => (
                                        <div key={major.id} className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
                                            <button 
                                                onClick={() => toggleMajor(major.id)}
                                                className="w-full flex items-center justify-between group/major"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
                                                        <Users size={20} />
                                                    </div>
                                                    <div className="text-left">
                                                        <h4 className="font-black text-slate-800 group-hover/major:text-indigo-600 transition-colors">{major.name}</h4>
                                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{major.classes?.length || 0} lớp hành chính</p>
                                                    </div>
                                                </div>
                                                <div className="text-slate-300">
                                                    {expandedMajors[major.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                                </div>
                                            </button>

                                            {/* Classes Grid */}
                                            {expandedMajors[major.id] && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 animate-in zoom-in-95 duration-300">
                                                    {major.classes.map(cls => (
                                                        <div 
                                                            key={cls.id} 
                                                            onClick={() => handleClassClick(cls.id)}
                                                            className="group bg-white border border-slate-100 p-6 rounded-[1.5rem] hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all cursor-pointer relative overflow-hidden"
                                                        >
                                                            <div className="absolute top-0 right-0 p-1">
                                                                <div className="w-10 h-10 bg-slate-50 rounded-bl-2xl flex items-center justify-center text-slate-200 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                                    <Users size={16} />
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="text-[10px] font-black text-indigo-500 mb-2 uppercase tracking-widest">{cls.classCode}</div>
                                                            <h5 className="font-black text-slate-800 text-sm mb-4 line-clamp-1">{cls.className}</h5>
                                                            
                                                            <div className="flex items-center justify-between mt-auto">
                                                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Khóa: {cls.courseYear || 'N/A'}</span>
                                                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 flex items-center gap-1">
                                                                    Chi tiết <ChevronRight size={12} />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {major.classes.length === 0 && (
                                                        <div className="col-span-full py-12 text-center">
                                                            <p className="text-xs font-black text-slate-300 uppercase tracking-widest italic">Chưa có lớp hành chính nào được tạo</p>
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
