import { useState, useEffect } from 'react';
import { Calendar, Users, List, ChevronRight, Loader2, Info, ArrowRight } from 'lucide-react';
import { semesterApi } from '../../api/semesterApi';
import toast from 'react-hot-toast';

const AcademicOverviewPage = () => {
    const [semesters, setSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [sections, setSections] = useState([]);
    const [loadingSemesters, setLoadingSemesters] = useState(true);
    const [loadingSections, setLoadingSections] = useState(false);

    useEffect(() => {
        fetchSemesters();
    }, []);

    useEffect(() => {
        if (selectedSemester) {
            fetchSections(selectedSemester.id);
        }
    }, [selectedSemester]);

    const fetchSemesters = async () => {
        setLoadingSemesters(true);
        try {
            const res = await semesterApi.getAllSemesters();
            if (res.success) {
                setSemesters(res.data);
                // Mặc định chọn học kỳ active đầu tiên
                const active = res.data.find(s => s.isActive);
                if (active) setSelectedSemester(active);
                else if (res.data.length > 0) setSelectedSemester(res.data[0]);
            }
        } catch (error) {
            toast.error("Không thể tải danh sách học kỳ");
        } finally {
            setLoadingSemesters(false);
        }
    };

    const fetchSections = async (semesterId) => {
        setLoadingSections(true);
        try {
            const res = await semesterApi.getSectionsBySemester(semesterId);
            if (res.success) {
                setSections(res.data);
            }
        } catch (error) {
            toast.error("Không thể tải danh sách lớp học phần");
        } finally {
            setLoadingSections(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 animate-fadeIn pb-12 h-[calc(100vh-140px)]">
            {/* Sidebar: Semesters */}
            <div className="w-full lg:w-80 flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden shrink-0">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Calendar size={20} className="text-blue-500" />
                        Học kỳ đào tạo
                    </h2>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Lịch sử và Hiện tại</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {loadingSemesters ? (
                        <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-gray-300" /></div>
                    ) : semesters.map(semester => (
                        <button
                            key={semester.id}
                            onClick={() => setSelectedSemester(semester)}
                            className={`w-full text-left p-4 rounded-2xl transition-all group flex items-center justify-between ${
                                selectedSemester?.id === semester.id 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 ring-4 ring-blue-50' 
                                : 'hover:bg-gray-50 text-gray-700 border border-transparent hover:border-gray-100'
                            }`}
                        >
                            <div className="flex-1">
                                <div className="font-bold text-sm leading-tight">{semester.semesterName}</div>
                                <div className={`text-[10px] mt-1 ${selectedSemester?.id === semester.id ? 'text-blue-100' : 'text-gray-400'}`}>
                                    Năm học {semester.academicYear}
                                </div>
                            </div>
                            {semester.isActive && (
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                    selectedSemester?.id === semester.id ? 'bg-white text-blue-600' : 'bg-green-100 text-green-600'
                                }`}>Hiện tại</span>
                            )}
                            <ChevronRight size={16} className={`transition-transform ${selectedSemester?.id === semester.id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content: Course Sections */}
            <div className="flex-1 flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                            Lớp học phần
                            {selectedSemester && (
                                <span className="text-gray-300 mx-1 font-light">/</span>
                            )}
                            <span className="text-blue-600">{selectedSemester?.semesterName}</span>
                        </h2>
                        <p className="text-sm text-gray-400 mt-0.5">Danh sách các lớp học được tổ chức trong học kỳ này</p>
                    </div>

                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all border border-gray-100">
                            Thống kê
                        </button>
                        <button className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-all shadow-lg shadow-gray-200 flex items-center gap-2">
                            <PlusIcon size={16} /> Quản lý lớp
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loadingSections ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Loader2 size={40} className="animate-spin mb-4" />
                            <p>Đang tải danh sách lớp học phần...</p>
                        </div>
                    ) : sections.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 p-6">
                            {sections.map(section => (
                                <div key={section.id} className="group bg-gray-50/50 hover:bg-white border border-gray-50 hover:border-blue-100 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 relative overflow-hidden">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-2.5 bg-white border border-gray-100 rounded-xl text-blue-600 shadow-sm">
                                            <Users size={20} />
                                        </div>
                                        <div className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase ${
                                            section.status === 'open' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                            {section.status}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{section.classCode}</div>
                                        <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{section.courseName}</h4>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Info size={14} className="text-gray-300" />
                                            <span>GV: {section.lecturerName}</span>
                                        </div>
                                    </div>

                                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <div className="text-xs">
                                            <span className="font-bold text-gray-900">{section.currentStudents}</span>
                                            <span className="text-gray-400"> / {section.maxStudents} SV</span>
                                        </div>
                                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-300">
                            <List size={64} className="opacity-10 mb-4" />
                            <p className="text-sm">Chưa có lớp học phần nào cho học kỳ này</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const PlusIcon = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export default AcademicOverviewPage;
