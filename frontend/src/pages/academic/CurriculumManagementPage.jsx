import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Book, CheckCircle2, AlertCircle, Clock, Hash, Layout, Loader2 } from 'lucide-react';
import { trainingProgramApi } from '../../api/trainingProgramApi';
import { trainingProgramCourseApi } from '../../api/trainingProgramCourseApi';
import ProgramCourseFormModal from '../../components/ProgramCourseFormModal';
import toast from 'react-hot-toast';

const CurriculumManagementPage = () => {
    const { programId } = useParams();
    const navigate = useNavigate();
    const [program, setProgram] = useState(null);
    const [curriculum, setCurriculum] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        fetchData();
    }, [programId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [progRes, currRes] = await Promise.all([
                trainingProgramApi.getById(programId),
                trainingProgramCourseApi.getCoursesByProgram(programId)
            ]);

            if (progRes.success) setProgram(progRes.data);
            if (currRes.success) setCurriculum(currRes.data);
        } catch (error) {
            toast.error("Không thể tải thông tin khung chương trình");
        } finally {
            setLoading(false);
        }
    };

    // Group curriculum by semester
    const groupedCurriculum = curriculum.reduce((acc, course) => {
        const semester = course.semester || 0;
        if (!acc[semester]) acc[semester] = [];
        acc[semester].push(course);
        return acc;
    }, {});

    const semesters = Object.keys(groupedCurriculum).sort((a, b) => a - b);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa môn học này khỏi chương trình?")) {
            try {
                const res = await trainingProgramCourseApi.removeCourseFromProgram(id);
                if (res.success) {
                    toast.success("Xóa môn học thành công");
                    fetchData();
                }
            } catch (error) {
                toast.error("Lỗi khi xóa môn học");
            }
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh]">
            <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
            <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">Đang tải khung chương trình...</p>
        </div>
    );

    return (
        <div className="max-w-[1400px] mx-auto p-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/academic-hierarchy')}
                        className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-blue-600 hover:shadow-lg transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-md uppercase tracking-wider">
                                {program?.programCode}
                            </span>
                            <span className="text-gray-300">/</span>
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Khung chương trình</span>
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 leading-tight">{program?.programName}</h1>
                    </div>
                </div>
                <button 
                    onClick={() => {
                        setSelectedCourse(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold shadow-xl shadow-gray-200 hover:bg-black transition-all"
                >
                    <Plus size={20} />
                    Thêm môn học vào khung
                </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Tổng tín chỉ', value: program?.totalCredits, icon: Hash, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Số môn học', value: curriculum.length, icon: Book, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Thời gian đào tạo', value: `${program?.durationYears} năm`, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Môn bắt buộc', value: curriculum.filter(c => c.isRequired).length, icon: CheckCircle2, color: 'text-indigo-600', bg: 'bg-indigo-50' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-lg font-black text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Curriculum Tree */}
            <div className="space-y-12">
                {semesters.map((sem) => (
                    <div key={sem} className="relative">
                        <div className="flex items-center gap-4 mb-6 sticky top-0 z-10 py-2">
                            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-900 text-white font-black text-xl shadow-lg shadow-gray-200">
                                {sem}
                            </div>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Học kỳ {sem}</h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent"></div>
                            <span className="text-xs font-bold text-gray-400">
                                {groupedCurriculum[sem].reduce((sum, c) => sum + (c.credits || 0), 0)} Tín chỉ
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {groupedCurriculum[sem].map((course) => (
                                <div key={course.id} className="group bg-white border border-gray-100 hover:border-blue-200 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 relative overflow-hidden">
                                    {/* Decoration */}
                                    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-5 transition-transform group-hover:scale-110 ${course.isRequired ? 'text-blue-600' : 'text-emerald-600'}`}>
                                        <Layout size={96} />
                                    </div>

                                    <div className="flex items-start justify-between mb-4 relative z-10">
                                        <div className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                                            course.isRequired ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                                        }`}>
                                            {course.isRequired ? 'Bắt buộc' : 'Tự chọn'}
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => {
                                                    setSelectedCourse(course);
                                                    setIsModalOpen(true);
                                                }}
                                                className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl transition-all"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(course.id)}
                                                className="p-2 hover:bg-red-50 text-red-600 rounded-xl transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1 relative z-10">
                                        <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{course.courseCode}</div>
                                        <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                                            {course.courseName}
                                        </h4>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-1.5 font-black text-gray-700">
                                            <Hash size={14} className="text-gray-300" />
                                            <span className="text-sm">{course.credits} Tín chỉ</span>
                                        </div>
                                        {course.prerequisiteCourseName && (
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                                                <AlertCircle size={12} />
                                                Tiên quyết: {course.prerequisiteCourseName}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {semesters.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-300 bg-white rounded-3xl border border-dashed border-gray-200">
                        <Book size={64} className="opacity-10 mb-4" />
                        <p className="font-bold uppercase tracking-widest text-sm">Chưa có môn học nào</p>
                        <p className="text-xs mt-1">Hãy bắt đầu xây dựng khung chương trình bằng cách thêm môn học</p>
                    </div>
                )}
            </div>

            <ProgramCourseFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                programId={programId}
                initialData={selectedCourse}
                onUpdate={fetchData}
            />
        </div>
    );
};

export default CurriculumManagementPage;
