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
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="relative h-24 bg-gray-50 border-b border-gray-100 shrink-0">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors z-10">
                        <X size={20} />
                    </button>
                </div>

                {loading ? (
                    <div className="flex-1 p-20 flex flex-col items-center justify-center text-gray-400">
                        <Loader2 size={40} className="animate-spin mb-4 text-gray-400" />
                        <p>Đang tải hồ sơ cán bộ...</p>
                    </div>
                ) : detail ? (
                    <div className="flex-1 overflow-y-auto px-8 pb-8 pt-0 relative bg-white">
                        {/* Avatar & Basic Info */}
                        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end mt-4 mb-8">
                            <div className="w-28 h-28 rounded-full bg-white p-1.5 shadow-sm border border-gray-200 shrink-0 relative z-10">
                                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                    <User size={40} />
                                </div>
                            </div>
                            <div className="flex-1 pb-2">
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">{detail.fullName}</h2>
                                    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-md tracking-wide">
                                        {detail.employeeCode}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm flex items-center gap-2 mt-2">
                                    <Briefcase size={15} /> {detail.positionName || 'Chưa xếp chức danh'} — {detail.departmentName || 'Chưa xếp Đơn vị'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Cột 1: Thông tin cá nhân */}
                            <div className="space-y-6">
                                <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                                    <h3 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Thông tin liên hệ & Cá nhân</h3>
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-3">
                                            <Mail size={16} className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Email</p>
                                                <p className="text-sm text-gray-900 mt-0.5">{detail.email || 'N/A'}</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Phone size={16} className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</p>
                                                <p className="text-sm text-gray-900 mt-0.5">{detail.phone || 'N/A'}</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Calendar size={16} className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Ngày sinh</p>
                                                <p className="text-sm text-gray-900 mt-0.5">{detail.dateOfBirth || 'N/A'}</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <MapPin size={16} className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</p>
                                                <p className="text-sm text-gray-900 mt-0.5">{detail.address || 'N/A'}</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Cột 2: Thông tin công tác */}
                            <div className="space-y-6">
                                <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                                    <h3 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Hồ sơ Cán bộ & Học thuật</h3>
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-3">
                                            <Award size={16} className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Học hàm / Học vị</p>
                                                <p className="text-sm text-gray-900 mt-0.5">
                                                    {[detail.academicTitle, detail.academicDegree].filter(Boolean).join(' - ') || 'N/A'}
                                                </p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <BookOpen size={16} className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Chuyên môn sâu</p>
                                                <p className="text-sm text-gray-900 mt-0.5">{detail.specialization || 'N/A'}</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Calendar size={16} className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Ngày tuyển dụng</p>
                                                <p className="text-sm text-gray-900 mt-0.5">{detail.hireDate || 'N/A'}</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <DollarSign size={16} className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Loại hợp đồng & HS Lương</p>
                                                <p className="text-sm text-gray-900 mt-0.5">
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
                    <div className="p-10 text-center text-gray-400">Không có dữ liệu</div>
                )}
            </div>
        </div>
    );
};

export default LecturerDetailModal;
