import { useState, useEffect } from 'react';
import { employeeApi, departmentApi, positionApi } from '../api/lecturerApi';
import { Search, Plus, MoreVertical, Edit2, Eye, Trash2, Filter, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import LecturerFormModal from '../components/LecturerFormModal';
import LecturerDetailModal from '../components/LecturerDetailModal';

const LecturerListPage = () => {
    const [lecturers, setLecturers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Pagination & Filter State
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDept, setSelectedDept] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('');

    const [modalState, setModalState] = useState({
        type: null, // 'CREATE', 'EDIT', 'VIEW', 'DELETE'
        data: null
    });

    useEffect(() => {
        fetchDropdownData();
    }, []);

    useEffect(() => {
        fetchLecturers();
    }, [currentPage, selectedDept, selectedPosition]);

    const fetchDropdownData = async () => {
        try {
            const [deptRes, posRes] = await Promise.all([
                departmentApi.getAllActive(),
                positionApi.getAllActive()
            ]);
            if (deptRes.success) setDepartments(deptRes.data);
            if (posRes.success) setPositions(posRes.data);
        } catch (error) {
            console.error("Lỗi tải danh mục:", error);
        }
    };

    const fetchLecturers = async (search = searchTerm) => {
        setLoading(true);
        try {
            const response = await employeeApi.getAll({
                page: currentPage,
                size: pageSize,
                keyword: search,
                departmentId: selectedDept || undefined,
                positionId: selectedPosition || undefined
            });
            if (response.success) {
                setLecturers(response.data.content);
                setTotalPages(response.data.totalPages);
                setTotalElements(response.data.totalElements);
            }
        } catch (error) {
            toast.error("Không thể tải danh sách giảng viên");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(0);
        fetchLecturers();
    };

    const openModal = (type, data = null) => {
        setModalState({ type, data });
    };

    const closeModal = () => {
        setModalState({ type: null, data: null });
        fetchLecturers(); // Refresh data after close
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa cán bộ/giảng viên này?')) {
            try {
                const res = await employeeApi.delete(id);
                if (res.success) {
                    toast.success('Đã xóa thành công');
                    fetchLecturers();
                }
            } catch (error) {
                toast.error('Lỗi khi xóa');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                        <Briefcase className="text-blue-600" /> Quản lý Giảng viên & Cán bộ
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Tổng số: {totalElements} cán bộ</p>
                </div>
                <button
                    onClick={() => openModal('CREATE')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm shadow-blue-200 flex items-center gap-2"
                >
                    <Plus size={18} /> Thêm Cán bộ
                </button>
            </div>

            {/* Bộ lọc */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm theo mã CB, tên..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </form>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Filter className="text-slate-400" size={18} />
                    <select
                        className="bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none flex-1 md:w-48"
                        value={selectedDept}
                        onChange={(e) => { setSelectedDept(e.target.value); setCurrentPage(0); }}
                    >
                        <option value="">-- Tất cả Khoa/Viện --</option>
                        {departments.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>

                    <select
                        className="bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none flex-1 md:w-40"
                        value={selectedPosition}
                        onChange={(e) => { setSelectedPosition(e.target.value); setCurrentPage(0); }}
                    >
                        <option value="">-- Chức danh --</option>
                        {positions.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                                <th className="p-4 font-bold">Mã CB</th>
                                <th className="p-4 font-bold">Họ tên</th>
                                <th className="p-4 font-bold">Đơn vị công tác</th>
                                <th className="p-4 font-bold">Chức danh / Học vị</th>
                                <th className="p-4 font-bold text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-400">Đang tải dữ liệu...</td>
                                </tr>
                            ) : lecturers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-400">Không tìm thấy cán bộ/giảng viên nào</td>
                                </tr>
                            ) : (
                                lecturers.map(lec => (
                                    <tr key={lec.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 font-bold text-blue-600">{lec.employeeCode}</td>
                                        <td className="p-4">
                                            <p className="font-bold text-slate-800">{lec.fullName}</p>
                                            <p className="text-xs text-slate-500">{lec.email}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-semibold">
                                                {lec.departmentName || 'Chưa xếp'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-slate-800 font-medium">{lec.positionName || 'N/A'}</p>
                                            <p className="text-xs text-slate-500">{lec.academicDegree || ''}</p>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => openModal('VIEW', lec)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Xem chi tiết">
                                                    <Eye size={18} />
                                                </button>
                                                <button onClick={() => openModal('EDIT', lec)} className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors" title="Chỉnh sửa">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(lec.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm">
                        <span className="text-slate-500">Trang {currentPage + 1} / {totalPages}</span>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage === 0}
                                onClick={() => setCurrentPage(p => p - 1)}
                                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                disabled={currentPage === totalPages - 1}
                                onClick={() => setCurrentPage(p => p + 1)}
                                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {modalState.type === 'CREATE' && (
                <LecturerFormModal isOpen={true} onClose={closeModal} departments={departments} positions={positions} />
            )}
            {modalState.type === 'EDIT' && (
                <LecturerFormModal isOpen={true} onClose={closeModal} data={modalState.data} departments={departments} positions={positions} />
            )}
            {modalState.type === 'VIEW' && (
                <LecturerDetailModal isOpen={true} onClose={closeModal} lecturerId={modalState.data?.id} />
            )}
        </div>
    );
};

export default LecturerListPage;
