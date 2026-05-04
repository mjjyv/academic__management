import { X, Calendar, MapPin, Users, Book, Hash, Info, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const SectionDetailModal = ({ isOpen, onClose, section, onManageSchedule }) => {
    if (!isOpen || !section) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'bg-green-50 text-green-700 border-green-100';
            case 'planned': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'closed': return 'bg-gray-50 text-gray-700 border-gray-100';
            case 'canceled': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'open': return 'Đang mở đăng ký';
            case 'planned': return 'Đang lên kế hoạch';
            case 'closed': return 'Đã đóng lớp';
            case 'canceled': return 'Đã hủy lớp';
            default: return status;
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden border border-gray-100 animate-fadeInScale">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
                            <Book size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-2 py-0.5 rounded-lg uppercase tracking-widest">{section.classCode}</span>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest border ${getStatusColor(section.status)}`}>
                                    {getStatusLabel(section.status)}
                                </span>
                            </div>
                            <h2 className="text-xl font-extrabold text-gray-900 mt-1">{section.courseName}</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {onManageSchedule && (
                            <button 
                                onClick={() => onManageSchedule(section)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-all border border-blue-100"
                            >
                                <Calendar size={14} /> Quản lý lịch học
                            </button>
                        )}
                        <button onClick={onClose} className="p-2.5 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-full transition-all">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Cột trái: Thông tin cơ bản */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-2">
                                <Info size={16} className="text-blue-500" /> Thông tin lớp học
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loại lớp</p>
                                    <p className="text-sm font-bold text-gray-700 capitalize">{section.classType || 'Lý thuyết'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Môn học</p>
                                    <p className="text-sm font-bold text-gray-700">{section.courseCode}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Học kỳ</p>
                                    <p className="text-sm font-bold text-gray-700">{section.semesterName}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sĩ số dự kiến</p>
                                    <p className="text-sm font-bold text-gray-700">{section.minStudents} - {section.maxStudents} SV</p>
                                </div>
                            </div>

                            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-blue-600 border border-blue-50 shadow-sm">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Giảng viên phụ trách</p>
                                        <p className="text-base font-extrabold text-gray-800">{section.lecturerName}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cột phải: Địa điểm & Thời gian */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-2">
                                <MapPin size={16} className="text-orange-500" /> Địa điểm & Thời gian
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phòng học & Tòa nhà</p>
                                        <p className="text-sm font-bold text-gray-700">
                                            {section.roomId ? `Phòng ${section.roomId}` : 'Chưa xếp phòng'} 
                                            {section.buildingId ? `, Tòa ${section.buildingId}` : ''}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                        <Clock size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Thời gian đăng ký</p>
                                        <p className="text-sm font-bold text-gray-700">
                                            {section.registrationStart ? new Date(section.registrationStart).toLocaleDateString('vi-VN') : '---'} 
                                            <span className="mx-2 text-gray-300">→</span>
                                            {section.registrationEnd ? new Date(section.registrationEnd).toLocaleDateString('vi-VN') : '---'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {section.note && (
                                <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-2xl">
                                    <p className="text-[10px] font-bold text-yellow-700 uppercase tracking-widest flex items-center gap-1 mb-1">
                                        <AlertTriangle size={12} /> Ghi chú đặc biệt
                                    </p>
                                    <p className="text-xs text-yellow-800 leading-relaxed italic">"{section.note}"</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer / Stats */}
                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Đã đăng ký</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-black text-gray-900">{section.currentStudents || 0}</span>
                                    <span className="text-gray-400 font-bold">/ {section.maxStudents} SV</span>
                                </div>
                            </div>
                            <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-blue-600 rounded-full shadow-lg shadow-blue-200" 
                                    style={{ width: `${Math.min(100, ((section.currentStudents || 0) / section.maxStudents) * 100)}%` }}
                                ></div>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="px-8 py-3 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-black transition-all shadow-xl shadow-gray-200"
                        >
                            Đóng cửa sổ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SectionDetailModal;
