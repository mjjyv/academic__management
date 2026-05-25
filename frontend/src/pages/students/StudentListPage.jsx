// src/pages/students/StudentListPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { studentApi } from '../../api/studentApi';
import useAuthStore from '../../store/useAuthStore';
import StudentFormModal from '../../components/StudentFormModal';
import StudentDetailModal from '../../components/StudentDetailModal';
import StudentStatusModal from '../../components/StudentStatusModal';
import { Plus, ArrowUpDown, ArrowUp, ArrowDown, UserCheck, Search, Users, GraduationCap, Mail, MapPin, Filter, Eye, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';

const StudentListPage = () => {
    const { user } = useAuthStore();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [modalState, setModalState] = useState({
        type: null,
        isOpen: false,
        data: null
    });

    const [filters, setFilters] = useState({
        keyword: '',
        page: 0,
        size: 10,
        classId: '',
        statusId: '',
        sortBy: 'studentCode',
        sortDir: 'asc'
    });

    const [searchTerm, setSearchTerm] = useState('');

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        try {
            const apiParams = {
                ...filters,
                sort: `${filters.sortBy},${filters.sortDir}`
            };

            const response = await studentApi.getAll(apiParams);
            if (response.success) {
                setStudents(response.data.content);
                setTotalPages(response.data.totalPages);
                setTotalElements(response.data.totalElements);
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách sinh viên:', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

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

    const handleSort = (field) => {
        setFilters(prev => {
            if (prev.sortBy === field) {
                return { ...prev, sortDir: prev.sortDir === 'asc' ? 'desc' : 'asc' };
            }
            return { ...prev, sortBy: field, sortDir: 'asc' };
        });
    };

    const openModal = (type, data = null) => {
        setModalState({ type, isOpen: true, data });
    };

    const closeModal = () => {
        setModalState({ type: null, isOpen: false, data: null });
    };

    const canEdit = user?.roles?.some(r => ['ADMIN', 'GIAOVU'].includes(r));

    const renderSortableHeader = (label, field) => {
        const isActive = filters.sortBy === field;
        return (
            <th
                className="px-8 py-5 cursor-pointer hover:bg-slate-100 transition-colors select-none group"
                onClick={() => handleSort(field)}
            >
                <div className="flex items-center gap-2">
                    {label}
                    <span className="text-slate-300 group-hover:text-indigo-500 transition-colors">
                        {!isActive ? (
                            <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-100" />
                        ) : filters.sortDir === 'asc' ? (
                            <ArrowUp size={14} className="text-indigo-600" />
                        ) : (
                            <ArrowDown size={14} className="text-indigo-600" />
                        )}
                    </span>
                </div>
            </th>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                        <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100">
                            <GraduationCap size={32} />
                        </div>
                        Quản lý Sinh viên
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Theo dõi hồ sơ, tiến độ học tập và trạng thái của toàn bộ sinh viên</p>
                </div>
                {canEdit && (
                    <button
                        onClick={() => openModal('ADD')}
                        className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-slate-200 flex items-center gap-3 text-sm uppercase tracking-widest active:scale-95"
                    >
                        <Plus size={20} /> Thêm sinh viên mới
                    </button>
                )}
            </div>

            {/* Stats & Search */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0 shadow-lg shadow-indigo-100/20">
                        <Users size={32} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng sinh viên</p>
                        <p className="text-3xl font-black text-slate-900">{totalElements}</p>
                    </div>
                </div>

                <div className="xl:col-span-3 bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 relative w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo MSSV, Họ tên..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all text-sm font-bold text-slate-700"
                        />
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="h-10 w-px bg-slate-100 hidden md:block"></div>
                        <button className="flex items-center gap-2 px-6 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                            <Filter size={16} /> Lọc nâng cao
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">
                                {renderSortableHeader('Mã sinh viên', 'studentCode')}
                                <th className="px-8 py-5">Hồ sơ sinh viên</th>
                                {renderSortableHeader('Lớp học', 'studentClass.className')}
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
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Đang tải hồ sơ sinh viên...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <Search size={64} className="text-slate-400" />
                                            <p className="text-lg font-black text-slate-800 uppercase tracking-widest">Không tìm thấy sinh viên nào</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student.id} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                                                {student.studentCode}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all overflow-hidden shrink-0">
                                                    <span className="text-lg font-black uppercase">{student.fullName.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{student.fullName}</p>
                                                    <div className="flex items-center gap-3 mt-1.5">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                            {student.gender === '1' || student.gender === 'Nam' ? 'Nam' : 'Nữ'}
                                                        </span>
                                                        <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                            {student.email || 'No email'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-slate-700">{student.className || 'Chưa xếp lớp'}</p>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Khóa: {student.studentCode?.substring(0, 2)}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${student.statusCode === 'ACTIVE' || student.statusCode === 'STUDYING'
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                : 'bg-slate-50 text-slate-400 border-slate-100'
                                                }`}>
                                                <div className={`w-1 h-1 rounded-full ${student.statusCode === 'ACTIVE' || student.statusCode === 'STUDYING' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                                {student.statusName || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                <button onClick={() => openModal('VIEW', student)} className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all" title="Xem chi tiết">
                                                    <Eye size={18} />
                                                </button>
                                                {canEdit && (
                                                    <>
                                                        <button onClick={() => openModal('EDIT', student)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="Chỉnh sửa">
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <div className="w-px h-4 bg-slate-100 mx-1"></div>
                                                        <button onClick={() => openModal('STATUS', student)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest" title="Thay đổi trạng thái">
                                                            <UserCheck size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Section */}
                <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Trang {filters.page + 1} / {totalPages || 1} • {totalElements} hồ sơ sinh viên
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(filters.page - 1)}
                            disabled={filters.page === 0 || loading}
                            className="p-3 text-slate-400 hover:bg-white hover:text-indigo-600 rounded-xl disabled:opacity-30 transition-all shadow-sm border border-transparent hover:border-slate-100"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageChange(i)}
                                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${filters.page === i ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:bg-white hover:text-slate-800'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => handlePageChange(filters.page + 1)}
                            disabled={filters.page >= totalPages - 1 || loading}
                            className="p-3 text-slate-400 hover:bg-white hover:text-indigo-600 rounded-xl disabled:opacity-30 transition-all shadow-sm border border-transparent hover:border-slate-100"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <StudentDetailModal
                isOpen={modalState.isOpen && modalState.type === 'VIEW'}
                onClose={closeModal}
                studentData={modalState.data}
            />

            <StudentFormModal
                isOpen={modalState.isOpen && (modalState.type === 'ADD' || modalState.type === 'EDIT')}
                onClose={closeModal}
                onSuccess={() => {
                    fetchStudents();
                    closeModal();
                }}
                initialData={modalState.type === 'EDIT' ? modalState.data : null}
            />

            <StudentStatusModal
                isOpen={modalState.isOpen && modalState.type === 'STATUS'}
                onClose={closeModal}
                studentData={modalState.data}
                onSuccess={() => {
                    fetchStudents();
                    closeModal();
                }}
            />
        </div>
    );
};

export default StudentListPage;