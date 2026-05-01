import { useState, useEffect } from 'react';
import { X, Briefcase, User, Mail, Phone, MapPin, Award, BookOpen, Calendar, DollarSign, Loader2 } from 'lucide-react';
import { employeeApi } from '../api/lecturerApi';

const LecturerDetailModal = ({ isOpen, onClose, lecturerId }) => {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && lecturerId) {
            fetchDetail();
        }
    }, [isOpen, lecturerId]);

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const res = await employeeApi.getById(lecturerId);
            if (res.success) {
                setDetail(res.data);
            }
        } catch (error) {
            console.error("Lỗi khi tải chi tiết:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in zoom-in-95 duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="relative h-32 bg-gradient-to-br from-slate-800 to-slate-900 shrink-0">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors z-10">
                        <X size={20} />
                    </button>
                </div>

                {loading ? (
                    <div className="flex-1 p-20 flex flex-col items-center justify-center text-slate-400">
                        <Loader2 size={40} className="animate-spin mb-4 text-blue-500" />
                        <p>Đang tải hồ sơ cán bộ...</p>
                    </div>
                ) : detail ? (
                    <div className="flex-1 overflow-y-auto px-8 pb-8 pt-0 relative">
                        {/* Avatar & Basic Info */}
                        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16 mb-8">
                            <div className="w-32 h-32 rounded-2xl bg-white p-2 shadow-lg border border-slate-100 shrink-0 relative z-10">
                                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-50 rounded-xl flex items-center justify-center text-blue-500">
                                    <User size={48} />
                                </div>
                            </div>
                            <div className="flex-1 pb-2">
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{detail.fullName}</h2>
                                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                                        {detail.employeeCode}
                                    </span>
                                </div>
                                <p className="text-slate-500 font-medium flex items-center gap-2">
                                    <Briefcase size={16} /> {detail.positionName || 'Chưa xếp chức danh'} — {detail.departmentName || 'Chưa xếp Đơn vị'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Cột 1: Thông tin cá nhân */}
                            <div className="space-y-6">
                                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">Thông tin liên hệ & Cá nhân</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <Mail size={18} className="text-slate-400 mt-0.5" />
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Email</p>
                                                <p className="text-sm text-slate-700 font-medium">{detail.email || 'N/A'}</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Phone size={18} className="text-slate-400 mt-0.5" />
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Số điện thoại</p>
                                                <p className="text-sm text-slate-700 font-medium">{detail.phone || 'N/A'}</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Calendar size={18} className="text-slate-400 mt-0.5" />
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Ngày sinh</p>
                                                <p className="text-sm text-slate-700 font-medium">{detail.dateOfBirth || 'N/A'}</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <MapPin size={18} className="text-slate-400 mt-0.5" />
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Địa chỉ</p>
                                                <p className="text-sm text-slate-700 font-medium">{detail.address || 'N/A'}</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Cột 2: Thông tin công tác */}
                            <div className="space-y-6">
                                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">Hồ sơ Cán bộ & Học thuật</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <Award size={18} className="text-amber-500 mt-0.5" />
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Học hàm / Học vị</p>
                                                <p className="text-sm text-slate-700 font-medium">
                                                    {[detail.academicTitle, detail.academicDegree].filter(Boolean).join(' - ') || 'N/A'}
                                                </p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <BookOpen size={18} className="text-indigo-500 mt-0.5" />
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Chuyên môn sâu</p>
                                                <p className="text-sm text-slate-700 font-medium">{detail.specialization || 'N/A'}</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Calendar size={18} className="text-blue-500 mt-0.5" />
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Ngày tuyển dụng</p>
                                                <p className="text-sm text-slate-700 font-medium">{detail.hireDate || 'N/A'}</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <DollarSign size={18} className="text-emerald-500 mt-0.5" />
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Loại hợp đồng & HS Lương</p>
                                                <p className="text-sm text-slate-700 font-medium">
                                                    {detail.contractType || 'N/A'} {detail.salaryCoefficient ? `(Hệ số: ${detail.salaryCoefficient})` : ''}
                                                </p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-10 text-center text-slate-500">Không có dữ liệu</div>
                )}
            </div>
        </div>
    );
};

export default LecturerDetailModal;
