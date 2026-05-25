import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Book, MoreVertical, Loader2 } from 'lucide-react';
import { courseApi } from '../../api/courseApi';
import { departmentApi } from '../../api/departmentApi';
import useAuthStore from '../../store/useAuthStore';
import CourseFormModal from '../../components/CourseFormModal';
import toast from 'react-hot-toast';

const CourseListPage = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [selectedDeptId, setSelectedDeptId] = useState('');

    const user = useAuthStore((state) => state.user);
    const canManage = user?.roles?.some(role => ['ADMIN', 'GIAOVU'].includes(role));

    useEffect(() => {
        fetchDepartments();
        fetchCourses();
    }, [selectedDeptId]);

    const fetchDepartments = async () => {
        try {
            const res = await departmentApi.getAllActive();
            if (res.success) setDepartments(res.data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách khoa", error);
        }
    };

    useEffect(() => {
        const results = courses.filter(course => 
            course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCourses(results);
    }, [searchTerm, courses]);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await courseApi.getAllCourses(selectedDeptId || null);
            if (res.success) {
                setCourses(res.data);
                setFilteredCourses(res.data);
            }
        } catch (error) {
            toast.error("Không thể tải danh sách môn học");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (course) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa môn học này?")) {
            try {
                const res = await courseApi.deleteCourse(id);
                if (res.success) {
                    toast.success("Xóa môn học thành công");
                    fetchCourses();
                }
            } catch (error) {
                toast.error("Lỗi khi xóa môn học");
            }
        }
    };

    const handleAdd = () => {
        setSelectedCourse(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <Book size={24} />
                        </div>
                        Danh mục môn học
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Quản lý các môn học và học phần trong toàn hệ thống</p>
                </div>

                {canManage && (
                    <button 
                        onClick={handleAdd}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                    >
                        <Plus size={20} />
                        Thêm môn học
                    </button>
                )}
            </div>

            {/* Filter Section */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                <div className="relative flex-1 w-full">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Tìm theo tên hoặc mã môn học..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <span className="text-sm font-medium text-gray-500 whitespace-nowrap">Theo khoa:</span>
                    <select 
                        value={selectedDeptId}
                        onChange={(e) => setSelectedDeptId(e.target.value)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all min-w-[200px]"
                    >
                        <option value="">Tất cả các khoa</option>
                        {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-all ml-auto">
                    <Filter size={18} />
                    <span>Lọc nâng cao</span>
                </button>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                        <Loader2 size={40} className="animate-spin mb-4" />
                        <p>Đang tải dữ liệu môn học...</p>
                    </div>
                ) : filteredCourses.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                                    <th className="px-6 py-4">Mã môn</th>
                                    <th className="px-6 py-4">Tên môn học</th>
                                    <th className="px-6 py-4">Tín chỉ</th>
                                    <th className="px-6 py-4">Khoa phụ trách</th>
                                    <th className="px-6 py-4">Loại môn</th>
                                    {canManage && <th className="px-6 py-4 text-right">Thao tác</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm">
                                {filteredCourses.map((course) => (
                                    <tr key={course.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-mono font-medium text-blue-600">{course.courseCode}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{course.courseName}</div>
                                            <div className="text-xs text-gray-400 italic">{course.courseNameEn}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg font-medium">
                                                {course.credits} TC
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{course.departmentName || '---'}</td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">{course.courseType}</td>
                                        {canManage && (
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => handleEdit(course)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Sửa"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(course.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                        <Book size={48} className="mb-4 opacity-20" />
                        <p>Không tìm thấy môn học nào</p>
                    </div>
                )}
            </div>

            {/* Pagination Placeholder */}
            <div className="flex items-center justify-between px-6 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-sm text-gray-500">
                <p>Hiển thị {filteredCourses.length} trên tổng số {courses.length} môn học</p>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50">Trước</button>
                    <button className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50">Sau</button>
                </div>
            </div>

            {/* Modal */}
            <CourseFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={selectedCourse}
                onUpdate={fetchCourses}
            />
        </div>
    );
};

export default CourseListPage;
