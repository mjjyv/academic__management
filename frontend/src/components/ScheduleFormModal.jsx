import { useState, useEffect } from 'react';
import { X, Save, Calendar, Clock, MapPin, User, Trash2, Plus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import scheduleApi from '../api/scheduleApi';
import { lecturerApi } from '../api/lecturerApi';

const ScheduleFormModal = ({ isOpen, onClose, section, onUpdate }) => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    // Form for new schedule entry
    const [formData, setFormData] = useState({
        dayOfWeek: 2,
        shift: 'Sáng',
        startPeriod: 1,
        endPeriod: 3,
        lecturerId: '',
        roomId: '',
        buildingId: '',
        mode: 'OFFLINE',
        note: ''
    });

    const [lecturers, setLecturers] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        if (isOpen && section) {
            fetchSectionSchedules();
            fetchInfrastructure();
            fetchLecturers();
            setFormData(prev => ({ ...prev, lecturerId: section.lecturerId || '', roomId: section.roomId || '', buildingId: section.buildingId || '' }));
        }
    }, [isOpen, section]);

    const fetchSectionSchedules = async () => {
        setLoading(true);
        try {
            const res = await scheduleApi.getSectionSchedules(section.id);
            if (res.success) setSchedules(res.data);
        } catch (error) {
            toast.error("Không thể tải lịch học");
        } finally {
            setLoading(false);
        }
    };

    const fetchLecturers = async () => {
        try {
            const res = await lecturerApi.getAllLecturers();
            if (res.success) setLecturers(res.data.content || []);
        } catch (error) {}
    };

    const fetchInfrastructure = async () => {
        try {
            const bRes = await scheduleApi.getBuildings();
            if (bRes.success) setBuildings(bRes.data);
        } catch (error) {}
    };

    const fetchRooms = async (buildingId) => {
        try {
            const rRes = await scheduleApi.getRooms(buildingId);
            if (rRes.success) setRooms(rRes.data);
        } catch (error) {}
    };

    useEffect(() => {
        if (formData.buildingId) {
            fetchRooms(formData.buildingId);
        }
    }, [formData.buildingId]);

    const handleAddSchedule = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await scheduleApi.createSchedule({
                ...formData,
                courseSectionId: section.id
            });
            if (res.success) {
                toast.success("Thêm lịch học thành công");
                fetchSectionSchedules();
                if (onUpdate) onUpdate();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi thêm lịch học");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteSchedule = async (id) => {
        if (!window.confirm("Xóa lịch học này?")) return;
        try {
            const res = await scheduleApi.deleteSchedule(id);
            if (res.success) {
                toast.success("Đã xóa lịch học");
                fetchSectionSchedules();
                if (onUpdate) onUpdate();
            }
        } catch (error) {
            toast.error("Lỗi khi xóa lịch học");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-md p-4 animate-fadeIn">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-100 flex flex-col animate-fadeInScale">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                            <Calendar className="text-blue-600" size={24} />
                            Quản lý lịch học: <span className="text-blue-600">{section?.classCode}</span>
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5 font-bold uppercase tracking-widest">{section?.courseName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-200 rounded-full transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 flex flex-col lg:flex-row gap-8">
                    {/* Left: Add Form */}
                    <div className="w-full lg:w-80 shrink-0">
                        <form onSubmit={handleAddSchedule} className="space-y-4 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                            <h3 className="text-sm font-black text-gray-800 flex items-center gap-2 mb-4">
                                <Plus size={16} className="text-blue-500" /> Thêm lịch mới
                            </h3>
                            
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Thứ</label>
                                        <select 
                                            value={formData.dayOfWeek}
                                            onChange={e => setFormData({...formData, dayOfWeek: parseInt(e.target.value)})}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        >
                                            {[2,3,4,5,6,7,8].map(d => <option key={d} value={d}>{d === 8 ? 'Chủ nhật' : `Thứ ${d}`}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ca</label>
                                        <select 
                                            value={formData.shift}
                                            onChange={e => setFormData({...formData, shift: e.target.value})}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        >
                                            <option value="Sáng">Sáng</option>
                                            <option value="Chiều">Chiều</option>
                                            <option value="Tối">Tối</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tiết bắt đầu</label>
                                        <input 
                                            type="number" min="1" max="15"
                                            value={formData.startPeriod}
                                            onChange={e => setFormData({...formData, startPeriod: parseInt(e.target.value)})}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tiết kết thúc</label>
                                        <input 
                                            type="number" min="1" max="15"
                                            value={formData.endPeriod}
                                            onChange={e => setFormData({...formData, endPeriod: parseInt(e.target.value)})}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tòa nhà</label>
                                    <select 
                                        value={formData.buildingId}
                                        onChange={e => setFormData({...formData, buildingId: e.target.value})}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                                    >
                                        <option value="">-- Chọn tòa nhà --</option>
                                        {buildings.map(b => <option key={b.id} value={b.id}>{b.buildingName}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phòng học</label>
                                    <select 
                                        value={formData.roomId}
                                        onChange={e => setFormData({...formData, roomId: e.target.value})}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                                    >
                                        <option value="">-- Chọn phòng --</option>
                                        {rooms.map(r => <option key={r.id} value={r.id}>{r.roomName}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Giảng viên (Tùy chọn)</label>
                                    <select 
                                        value={formData.lecturerId}
                                        onChange={e => setFormData({...formData, lecturerId: e.target.value})}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                                    >
                                        <option value="">-- Theo mặc định lớp --</option>
                                        {lecturers.map(l => <option key={l.id} value={l.id}>{l.fullName}</option>)}
                                    </select>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3 bg-blue-600 text-white rounded-2xl text-xs font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
                                >
                                    {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                                    Thêm vào lịch
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right: List */}
                    <div className="flex-1 space-y-4">
                        <h3 className="text-sm font-black text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
                            <Clock size={16} className="text-indigo-500" /> Danh sách buổi học
                        </h3>

                        {loading ? (
                            <div className="flex justify-center py-12 text-gray-300"><Loader2 size={32} className="animate-spin" /></div>
                        ) : schedules.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {schedules.map(s => (
                                    <div key={s.id} className="p-4 bg-white border border-gray-100 rounded-2xl flex items-start justify-between group hover:border-blue-200 transition-all shadow-sm hover:shadow-md">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg">
                                                    {s.dayOfWeek === 8 ? 'CN' : `Thứ ${s.dayOfWeek}`}
                                                </span>
                                                <span className="text-xs font-bold text-gray-700">Ca {s.shift}</span>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                                    <Clock size={12} /> Tiết {s.startPeriod} - {s.endPeriod}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                                    <MapPin size={12} /> {s.roomName} ({s.buildingName})
                                                </div>
                                                {s.lecturerName && (
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                                        <User size={12} /> {s.lecturerName}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteSchedule(s.id)}
                                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                                <Calendar size={48} className="opacity-10 mb-4" />
                                <p className="text-xs font-bold uppercase tracking-widest">Chưa có lịch học</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-8 border-t border-gray-50 bg-gray-50/30">
                    <button 
                        onClick={onClose}
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-black transition-all shadow-xl shadow-gray-200"
                    >
                        Hoàn tất cấu hình
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleFormModal;
