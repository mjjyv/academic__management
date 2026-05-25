import { useState, useEffect } from 'react';
import { employeeApi, departmentApi, positionApi } from '../api/lecturerApi';
import { Search, Plus, MoreVertical, Edit2, Eye, Trash2, Filter, ChevronLeft, ChevronRight, Briefcase, Mail, Phone, MapPin, UserCheck, UserX } from 'lucide-react';
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
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                        <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100">
                            <Briefcase size={32} />
                        </div>
                        Nhân sự & Giảng viên
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Quản lý đội ngũ cán bộ, giảng viên và nhân viên toàn trường</p>
                </div>
                <button
                    onClick={() => openModal('CREATE')}
                    className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-slate-200 flex items-center gap-3 text-sm uppercase tracking-widest active:scale-95"
                >
                    <Plus size={20} /> Thêm Cán bộ mới
                </button>
            </div>

            {/* Quick Stats & Filters */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Stats Card */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                        <UserCheck size={32} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng nhân sự</p>
                        <p className="text-3xl font-black text-slate-900">{totalElements}</p>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="xl:col-span-3 bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                    <form onSubmit={handleSearch} className="flex-1 relative w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo mã, tên hoặc email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all text-sm font-bold text-slate-700"
                        />
                    </form>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="h-10 w-px bg-slate-100 hidden md:block"></div>
                        <select
                            className="bg-slate-50 border border-slate-100 text-slate-700 py-3.5 px-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none flex-1 md:w-56 text-xs font-black uppercase tracking-widest"
                            value={selectedDept}
                            onChange={(e) => { setSelectedDept(e.target.value); setCurrentPage(0); }}
                        >
                            <option value="">-- Tất cả Khoa --</option>
                            {departments.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>

                        <select
                            className="bg-slate-50 border border-slate-100 text-slate-700 py-3.5 px-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none flex-1 md:w-48 text-xs font-black uppercase tracking-widest"
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
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">
                                <th className="px-8 py-5">Nhân sự</th>
                                <th className="px-8 py-5">Công tác</th>
                                <th className="px-8 py-5">Thông tin liên hệ</th>
                                <th className="px-8 py-5 text-center">Trạng thái</th>
                                <th className="px-8 py-5 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Đang truy xuất dữ liệu...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : lecturers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <Search size={64} className="text-slate-400" />
                                            <p className="text-lg font-black text-slate-800 uppercase tracking-widest">Không tìm thấy kết quả</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                lecturers.map(lec => (
                                    <tr key={lec.id} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all overflow-hidden shrink-0">
                                                    {lec.avatarUrl ? (
                                                        <img src={lec.avatarUrl} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-lg font-black uppercase">{lec.fullName.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{lec.fullName}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {lec.employeeCode}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-slate-700">{lec.departmentName || 'Chưa xếp khoa'}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[9px] font-black uppercase tracking-widest">
                                                        {lec.positionName || 'Nhân viên'}
                                                    </span>
                                                    {lec.academicDegree && (
                                                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-500 rounded-md text-[9px] font-black uppercase tracking-widest">
                                                            {lec.academicDegree}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                                    <Mail size={12} className="text-slate-300" />
                                                    <span>{lec.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                                    <Phone size={12} className="text-slate-300" />
                                                    <span>{lec.phone || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                                                Đang làm việc
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                <button onClick={() => openModal('VIEW', lec)} className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all" title="Xem chi tiết">
                                                    <Eye size={18} />
                                                </button>
                                                <button onClick={() => openModal('EDIT', lec)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="Chỉnh sửa">
                                                    <Edit2 size={18} />
                                                </button>
                                                <div className="w-px h-4 bg-slate-100 mx-1"></div>
                                                <button onClick={() => handleDelete(lec.id)} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="Xóa">
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

                {/* Footer / Pagination */}
                <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Trang {currentPage + 1} / {totalPages} • Hiển thị {lecturers.length} trên {totalElements} kết quả
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={currentPage === 0}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="p-3 text-slate-400 hover:bg-white hover:text-indigo-600 rounded-xl disabled:opacity-30 transition-all shadow-sm border border-transparent hover:border-slate-100"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i)}
                                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === i ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:bg-white hover:text-slate-800'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={currentPage === totalPages - 1}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="p-3 text-slate-400 hover:bg-white hover:text-indigo-600 rounded-xl disabled:opacity-30 transition-all shadow-sm border border-transparent hover:border-slate-100"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
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
