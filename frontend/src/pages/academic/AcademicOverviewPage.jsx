import { useState, useEffect } from 'react';
import { Calendar, Users, List, ChevronRight, Loader2, Info, ArrowRight, Plus, Edit2, Trash2, Settings } from 'lucide-react';
import { semesterApi } from '../../api/semesterApi';
import useAuthStore from '../../store/useAuthStore';
import SemesterFormModal from '../../components/SemesterFormModal';
import SectionFormModal from '../../components/SectionFormModal';
import toast from 'react-hot-toast';

const AcademicOverviewPage = () => {
    const [semesters, setSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [sections, setSections] = useState([]);
    const [loadingSemesters, setLoadingSemesters] = useState(true);
    const [loadingSections, setLoadingSections] = useState(false);

    // Modal state
    const [isSemesterModalOpen, setIsSemesterModalOpen] = useState(false);
    const [selectedSemesterForEdit, setSelectedSemesterForEdit] = useState(null);
    
    const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
    const [selectedSectionForEdit, setSelectedSectionForEdit] = useState(null);

    const user = useAuthStore((state) => state.user);
    const canManage = user?.roles?.some(role => ['ADMIN', 'GIAOVU'].includes(role));

    useEffect(() => {
        fetchSemesters();
    }, []);

    useEffect(() => {
        if (selectedSemester) {
            fetchSections(selectedSemester.id);
        } else {
            setSections([]);
        }
    }, [selectedSemester]);

    const fetchSemesters = async () => {
        setLoadingSemesters(true);
        try {
            const res = await semesterApi.getAllSemesters();
            if (res.success) {
                setSemesters(res.data);
                // Mặc định chọn học kỳ active đầu tiên nếu chưa chọn
                if (!selectedSemester) {
                    const active = res.data.find(s => s.isActive);
                    if (active) setSelectedSemester(active);
                    else if (res.data.length > 0) setSelectedSemester(res.data[0]);
                } else {
                    const updated = res.data.find(s => s.id === selectedSemester.id);
                    if (updated) setSelectedSemester(updated);
                }
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

    // Semester Handlers
    const handleAddSemester = () => {
        setSelectedSemesterForEdit(null);
        setIsSemesterModalOpen(true);
    };

    const handleEditSemester = (semester, e) => {
        e.stopPropagation();
        setSelectedSemesterForEdit(semester);
        setIsSemesterModalOpen(true);
    };

    const handleDeleteSemester = async (id, e) => {
        e.stopPropagation();
        if (window.confirm("Bạn có chắc chắn muốn xóa học kỳ này? Hệ thống sẽ xóa các lớp liên quan!")) {
            try {
                const res = await semesterApi.deleteSemester(id);
                if (res.success) {
                    toast.success("Xóa học kỳ thành công");
                    if (selectedSemester?.id === id) setSelectedSemester(null);
                    fetchSemesters();
                }
            } catch (error) {
                toast.error("Lỗi khi xóa học kỳ");
            }
        }
    };

    // Section Handlers
    const handleAddSection = () => {
        if (!selectedSemester) {
            toast.error("Vui lòng chọn học kỳ trước");
            return;
        }
        setSelectedSectionForEdit(null);
        setIsSectionModalOpen(true);
    };

    const handleEditSection = (section) => {
        setSelectedSectionForEdit(section);
        setIsSectionModalOpen(true);
    };

    const handleDeleteSection = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa lớp học phần này?")) {
            try {
                const res = await semesterApi.deleteSection(id);
                if (res.success) {
                    toast.success("Xóa lớp học phần thành công");
                    fetchSections(selectedSemester.id);
                }
            } catch (error) {
                toast.error("Lỗi khi xóa lớp học phần");
            }
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 animate-fadeIn pb-12 h-[calc(100vh-140px)]">
            {/* Sidebar: Semesters */}
            <div className="w-full lg:w-80 flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden shrink-0">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Calendar size={20} className="text-blue-500" />
                            Học kỳ
                        </h2>
                        <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-widest font-bold">Lịch sử & Hiện tại</p>
                    </div>
                    {canManage && (
                        <button 
                            onClick={handleAddSemester}
                            className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                            title="Thêm học kỳ"
                        >
                            <Plus size={18} />
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {loadingSemesters ? (
                        <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-gray-300" /></div>
                    ) : semesters.map(semester => (
                        <div key={semester.id} className="relative group">
                            <button
                                onClick={() => setSelectedSemester(semester)}
                                className={`w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between ${
                                    selectedSemester?.id === semester.id 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                                    : 'hover:bg-gray-50 text-gray-700 border border-transparent'
                                }`}
                            >
                                <div className="flex-1">
                                    <div className="font-bold text-sm leading-tight">{semester.semesterName}</div>
                                    <div className={`text-[10px] mt-1 ${selectedSemester?.id === semester.id ? 'text-blue-100' : 'text-gray-400'}`}>
                                        {semester.academicYear}
                                    </div>
                                </div>
                                {semester.isActive && selectedSemester?.id !== semester.id && (
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                )}
                            </button>
                            
                            {canManage && (
                                <div className={`absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 transition-opacity duration-200 ${
                                    selectedSemester?.id === semester.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                }`}>
                                    <button 
                                        onClick={(e) => handleEditSemester(semester, e)}
                                        className={`p-1.5 rounded-lg transition-colors ${
                                            selectedSemester?.id === semester.id ? 'bg-blue-500 hover:bg-blue-400 text-white' : 'bg-white hover:bg-gray-100 text-blue-600 border border-gray-100'
                                        }`}
                                    >
                                        <Edit2 size={12} />
                                    </button>
                                    <button 
                                        onClick={(e) => handleDeleteSemester(semester.id, e)}
                                        className={`p-1.5 rounded-lg transition-colors ${
                                            selectedSemester?.id === semester.id ? 'bg-red-500 hover:bg-red-400 text-white' : 'bg-white hover:bg-gray-100 text-red-600 border border-gray-100'
                                        }`}
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            )}
                        </div>
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
                                <>
                                    <span className="text-gray-300 mx-1 font-light">/</span>
                                    <span className="text-blue-600">{selectedSemester.semesterName}</span>
                                </>
                            )}
                        </h2>
                        <p className="text-sm text-gray-400 mt-0.5">Quản lý danh sách các lớp học được tổ chức</p>
                    </div>

                    <div className="flex gap-2">
                        {canManage && (
                            <button 
                                onClick={handleAddSection}
                                className="px-5 py-2.5 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center gap-2"
                            >
                                <Plus size={18} /> Mở lớp mới
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-gray-50/30">
                    {loadingSections ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Loader2 size={40} className="animate-spin mb-4" />
                            <p className="font-medium">Đang tải danh sách lớp học phần...</p>
                        </div>
                    ) : sections.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 p-8">
                            {sections.map(section => (
                                <div key={section.id} className="group bg-white border border-gray-100 hover:border-blue-200 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 relative overflow-hidden">
                                    <div className="flex items-start justify-between mb-5">
                                        <div className="p-3 bg-blue-50 border border-blue-100/50 rounded-2xl text-blue-600">
                                            <Users size={22} />
                                        </div>
                                        <div className="flex gap-1.5">
                                            <div className={`text-[10px] font-bold px-2.5 py-1 rounded-xl uppercase tracking-wider ${
                                                section.status === 'open' ? 'bg-green-100 text-green-700' : 
                                                section.status === 'planned' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                                {section.status}
                                            </div>
                                            {canManage && (
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => handleEditSection(section)}
                                                        className="p-1.5 bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-all"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteSection(section.id)}
                                                        className="p-1.5 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-all"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-1.5">
                                        <div className="text-[11px] font-extrabold text-blue-500 uppercase tracking-widest">{section.classCode}</div>
                                        <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-lg leading-snug">{section.courseName}</h4>
                                        <div className="flex items-center gap-2 mt-3 p-3 bg-gray-50 rounded-2xl">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 border border-gray-100">
                                                <Users size={14} />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Giảng viên</div>
                                                <div className="text-xs font-bold text-gray-700 truncate">{section.lecturerName}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="text-xs">
                                                <span className="font-extrabold text-gray-900 text-base">{section.currentStudents}</span>
                                                <span className="text-gray-400 font-bold ml-1">/ {section.maxStudents}</span>
                                            </div>
                                            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-blue-500 rounded-full" 
                                                    style={{ width: `${Math.min(100, (section.currentStudents / section.maxStudents) * 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <button className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                                            Chi tiết <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-300">
                            <List size={80} className="opacity-10 mb-6" />
                            <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Trống danh sách</p>
                            <p className="text-xs mt-1">Chưa có lớp học phần nào cho học kỳ này</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <SemesterFormModal 
                isOpen={isSemesterModalOpen}
                onClose={() => setIsSemesterModalOpen(false)}
                initialData={selectedSemesterForEdit}
                onUpdate={() => fetchSemesters()}
            />

            <SectionFormModal
                isOpen={isSectionModalOpen}
                onClose={() => setIsSectionModalOpen(false)}
                semesterId={selectedSemester?.id}
                initialData={selectedSectionForEdit}
                onUpdate={() => fetchSections(selectedSemester.id)}
            />
        </div>
    );
};

export default AcademicOverviewPage;
