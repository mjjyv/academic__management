// src/pages/students/StudentListPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { studentApi } from '../../api/studentApi';
import useAuthStore from '../../store/useAuthStore';
import StudentFormModal from '../../components/StudentFormModal';
import StudentDetailModal from '../../components/StudentDetailModal';
import { Plus } from 'lucide-react';

const StudentListPage = () => {
    const { user } = useAuthStore();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);

    // State quản lý Modals (Hợp nhất logic: tập trung quản lý type và data)
    const [modalState, setModalState] = useState({
        type: null, // 'VIEW', 'EDIT', 'ADD'
        isOpen: false,
        data: null
    });


    // State cho bộ lọc và phân trang
    const [filters, setFilters] = useState({
        keyword: '',
        page: 0,
        size: 10,
        classId: '',
        statusId: ''
    });

    // Debounce tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');

    // --- Logic Handlers ---

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        try {
            const response = await studentApi.getAll(filters);
            if (response.success) {
                setStudents(response.data.content);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách sinh viên:', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Effect xử lý Debounce tìm kiếm
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setFilters(prev => ({ ...prev, keyword: searchTerm, page: 0 }));
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setFilters(prev => ({ ...prev, page: newPage }));
        }
    };

    // Các hàm mở Modal tập trung
    const openModal = (type, data = null) => {
        setModalState({ type, isOpen: true, data });
    };

    const closeModal = () => {
        setModalState({ type: null, isOpen: false, data: null });
    };

    // Kiểm tra quyền chỉnh sửa
    const canEdit = user?.roles?.some(r => ['ADMIN', 'GIAOVU'].includes(r));

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header & Toolbar */}
            <div className="p-6 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Quản lý Sinh viên</h2>
                    <p className="text-sm text-gray-500 mt-1">Danh sách hồ sơ và trạng thái học tập</p>
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="Tìm theo Tên hoặc MSSV..."
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {canEdit && (
                        <button
                            onClick={() => openModal('ADD')}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                        >
                            <Plus size={18} /> Thêm sinh viên
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                            <th className="p-4 border-b font-semibold">MSSV</th>
                            <th className="p-4 border-b font-semibold">Họ và Tên</th>
                            <th className="p-4 border-b font-semibold">Giới tính</th>
                            <th className="p-4 border-b font-semibold">Lớp</th>
                            <th className="p-4 border-b font-semibold">Trạng thái</th>
                            <th className="p-4 border-b font-semibold text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td>
                            </tr>
                        ) : students.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-500">Không tìm thấy sinh viên nào.</td>
                            </tr>
                        ) : (
                            students.map((student) => (
                                <tr key={student.id} className="hover:bg-blue-50/50 transition-colors">
                                    <td className="p-4 text-sm font-medium text-blue-600">{student.studentCode}</td>
                                    <td className="p-4 text-sm font-semibold text-gray-800">{student.fullName}</td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {student.gender === 'Nam' ? 'Nam' : student.gender === 'Nữ' ? 'Nữ' : 'Khác'}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{student.className || 'Chưa xếp lớp'}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${student.statusCode === 'ACTIVE'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {student.statusName || 'N/A'}
                                            {console.log(student)}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => openModal('VIEW', student)}
                                                className="text-gray-500 hover:text-blue-600 text-sm font-medium"
                                            >
                                                Xem
                                            </button>
                                            {canEdit && (
                                                <button
                                                    onClick={() => openModal('EDIT', student)}
                                                    className="text-gray-500 hover:text-amber-600 text-sm font-medium"
                                                >
                                                    Sửa
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm">
                <span className="text-gray-600">
                    Trang {filters.page + 1} / {totalPages || 1}
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => handlePageChange(filters.page - 1)}
                        disabled={filters.page === 0 || loading}
                        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
                    >
                        Trước
                    </button>
                    <button
                        onClick={() => handlePageChange(filters.page + 1)}
                        disabled={filters.page >= totalPages - 1 || loading}
                        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
                    >
                        Sau
                    </button>
                </div>
            </div>

            {/* --- Modals Section --- */}

            {/* Modal Xem chi tiết */}
            <StudentDetailModal
                isOpen={modalState.isOpen && modalState.type === 'VIEW'}
                onClose={closeModal}
                studentData={modalState.data}
            />

            {/* Modal Thêm/Sửa (Dùng chung StudentFormModal) */}
            <StudentFormModal
                isOpen={modalState.isOpen && (modalState.type === 'ADD' || modalState.type === 'EDIT')}
                onClose={closeModal}
                onSuccess={() => {
                    fetchStudents(); // Tải lại dữ liệu
                    closeModal();    // Đóng modal
                }}
                initialData={modalState.type === 'EDIT' ? modalState.data : null}
            />
        </div>
    );
};

export default StudentListPage;