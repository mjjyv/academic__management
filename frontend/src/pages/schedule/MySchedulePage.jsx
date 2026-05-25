import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, User, BookOpen, ChevronLeft, ChevronRight, Download, Filter, RefreshCw } from 'lucide-react';
import scheduleApi from '../../api/scheduleApi';
import { toast } from 'react-hot-toast';

const MySchedulePage = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
    
    // Days of the week (Monday to Sunday)
    const days = [
        { label: 'Thứ 2', value: 2 },
        { label: 'Thứ 3', value: 3 },
        { label: 'Thứ 4', value: 4 },
        { label: 'Thứ 5', value: 5 },
        { label: 'Thứ 6', value: 6 },
        { label: 'Thứ 7', value: 7 },
        { label: 'Chủ Nhật', value: 8 },
    ];

    const fetchSchedule = async () => {
        setLoading(true);
        try {
            const response = await scheduleApi.getMySchedule();
            if (response.success) {
                setSchedules(response.data);
            }
        } catch (error) {
            console.error('Error fetching schedule:', error);
            toast.error('Không thể tải lịch học');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    const getSchedulesForDay = (dayValue) => {
        return schedules.filter(s => s.dayOfWeek === dayValue).sort((a, b) => a.startPeriod - b.startPeriod);
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                        <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-200">
                            <CalendarIcon size={32} />
                        </div>
                        Lịch biểu Cá nhân
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Theo dõi lịch học và lịch dạy của bạn trong tuần</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                    <button 
                        onClick={() => setViewMode('calendar')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${viewMode === 'calendar' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Lịch tuần
                    </button>
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Danh sách
                    </button>
                    <div className="w-px h-8 bg-gray-100 mx-2"></div>
                    <button 
                        onClick={fetchSchedule}
                        className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            {loading ? (
                <div className="grid grid-cols-7 gap-4 h-[600px]">
                    {Array(7).fill(0).map((_, i) => (
                        <div key={i} className="bg-gray-50 rounded-3xl animate-pulse"></div>
                    ))}
                </div>
            ) : viewMode === 'calendar' ? (
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                    {days.map((day) => {
                        const daySchedules = getSchedulesForDay(day.value);
                        const isToday = new Date().getDay() === (day.value === 8 ? 0 : day.value - 1);

                        return (
                            <div key={day.value} className={`flex flex-col gap-4 min-h-[500px]`}>
                                <div className={`p-4 rounded-2xl text-center border-2 transition-all ${isToday ? 'bg-indigo-50 border-indigo-200 shadow-md shadow-indigo-50' : 'bg-white border-transparent shadow-sm'}`}>
                                    <div className={`text-xs font-black uppercase tracking-widest ${isToday ? 'text-indigo-600' : 'text-gray-400'}`}>
                                        {day.label}
                                    </div>
                                    {isToday && <div className="text-[10px] font-bold text-indigo-400 mt-0.5">HÔM NAY</div>}
                                </div>

                                <div className="flex-1 flex flex-col gap-3">
                                    {daySchedules.length > 0 ? (
                                        daySchedules.map((s) => (
                                            <div 
                                                key={s.id} 
                                                className="group bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50 transition-all cursor-pointer relative overflow-hidden"
                                            >
                                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                                                
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-[10px] font-black px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md uppercase tracking-wider">
                                                        Tiết {s.startPeriod}-{s.endPeriod}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-gray-400">
                                                        {s.shift}
                                                    </span>
                                                </div>

                                                <h4 className="font-black text-gray-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                                                    {s.courseName}
                                                </h4>
                                                
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                                                        <MapPin size={12} className="text-indigo-400" />
                                                        <span>{s.roomName} • {s.buildingName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                                                        <User size={12} className="text-indigo-400" />
                                                        <span>{s.lecturerName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[11px] text-gray-400 font-bold italic">
                                                        <BookOpen size={12} />
                                                        <span>{s.classCode}</span>
                                                    </div>
                                                </div>

                                                {/* Hover decoration */}
                                                <div className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-10 transition-all transform scale-0 group-hover:scale-100 rotate-12">
                                                    <CalendarIcon size={64} className="text-indigo-900" />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex-1 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Trống</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Thứ</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tiết</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Học phần</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Phòng / Tòa</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Giảng viên</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Lớp HP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {schedules.length > 0 ? (
                                schedules.sort((a,b) => a.dayOfWeek - b.dayOfWeek || a.startPeriod - b.startPeriod).map((s) => (
                                    <tr key={s.id} className="hover:bg-indigo-50/20 transition-all group">
                                        <td className="px-8 py-5">
                                            <span className="font-black text-gray-900">Thứ {s.dayOfWeek}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="text-indigo-400" />
                                                <span className="text-sm font-bold text-gray-600">{s.startPeriod} - {s.endPeriod}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{s.courseName}</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{s.shift}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                                <MapPin size={14} className="text-indigo-400" />
                                                <span>{s.roomName} • {s.buildingName}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                                <User size={14} className="text-indigo-400" />
                                                <span>{s.lecturerName}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <span className="text-xs font-black text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100">
                                                {s.classCode}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center text-gray-400 font-bold opacity-50">
                                        Chưa có lịch học được ghi nhận
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Footer / Legend */}
            <div className="mt-10 flex flex-wrap items-center justify-between gap-6 p-6 bg-gray-900 rounded-[2rem] text-white">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50"></div>
                        <span className="text-xs font-bold uppercase tracking-widest opacity-80">Học phần chính</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock size={16} className="text-indigo-400" />
                        <span className="text-xs font-bold uppercase tracking-widest opacity-80">Ca học tiêu chuẩn: 45'/tiết</span>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                    <Download size={16} /> Xuất PDF
                </button>
            </div>
        </div>
    );
};

export default MySchedulePage;
