import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, User, BookOpen, ChevronLeft, ChevronRight, Settings, Filter, Download, RefreshCw, X } from 'lucide-react';
import useScheduleStore from '../../store/useScheduleStore';
import useAuthStore from '../../store/useAuthStore';
import ScheduleFormModal from '../../components/ScheduleFormModal';
import { toast } from 'react-hot-toast';

const SchedulePage = () => {
    const { 
        schedules, 
        loading, 
        fetchMySchedule, 
        fetchStudentSchedule, 
        fetchLecturerSchedule, 
        fetchDepartmentSchedule, 
        fetchSectionSchedule, 
        fetchClassSchedule 
    } = useScheduleStore();
    
    const { user } = useAuthStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'

    // Administrative filters
    const [departments, setDepartments] = useState([]);
    const [sections, setSections] = useState([]);
    const [selectedDeptId, setSelectedDeptId] = useState('');
    const [selectedSectionId, setSelectedSectionId] = useState('');

    const isAdminOrStaff = user?.roles?.some(role => ['ADMIN', 'GIAOVU'].includes(role));
    const isLecturer = user?.roles?.includes('GIANGVIEN');
    const isStudent = user?.roles?.includes('SINHVIEN');

    useEffect(() => {
        if (isStudent || (isLecturer && !isAdminOrStaff)) {
            fetchMySchedule();
        }
        if (isAdminOrStaff) {
            fetchInitialData();
        }
    }, [user]);

    const fetchInitialData = async () => {
        try {
            const { departmentApi } = await import('../../api/departmentApi');
            const res = await departmentApi.getAllActive();
            if (res.success) setDepartments(res.data);
        } catch (error) {}
    };

    const handleDeptChange = async (deptId) => {
        setSelectedDeptId(deptId);
        setSelectedSectionId('');
        if (deptId) {
            fetchDepartmentSchedule(deptId);
            try {
                const { semesterApi } = await import('../../api/semesterApi');
                const res = await semesterApi.getSectionsByDepartment(deptId);
                if (res.success) setSections(res.data);
            } catch (error) {}
        }
    };

    const handleSectionChange = (sectionId) => {
        setSelectedSectionId(sectionId);
        if (sectionId) {
            fetchSectionSchedule(sectionId);
        } else if (selectedDeptId) {
            fetchDepartmentSchedule(selectedDeptId);
        }
    };

    const days = [
        { label: 'Thứ 2', value: 2 },
        { label: 'Thứ 3', value: 3 },
        { label: 'Thứ 4', value: 4 },
        { label: 'Thứ 5', value: 5 },
        { label: 'Thứ 6', value: 6 },
        { label: 'Thứ 7', value: 7 },
        { label: 'CN', value: 8 },
    ];

    const periods = Array.from({ length: 15 }, (_, i) => i + 1);

    const getScheduleForCell = (day, period) => {
        return schedules.filter(s => s.dayOfWeek === day && period >= s.startPeriod && period <= s.endPeriod);
    };

    const handleBlockClick = (s) => {
        setSelectedDetail(s);
        setIsDetailOpen(true);
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                        <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-200">
                            <CalendarIcon size={32} />
                        </div>
                        {isStudent ? 'Thời khóa biểu' : isLecturer ? 'Lịch giảng dạy' : 'Quản lý Lịch học'}
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        {isStudent ? 'Theo dõi lịch học các môn đã hoàn tất học phí.' : 'Quản lý và theo dõi lịch trình đào tạo.'}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    {isAdminOrStaff && (
                        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                            <select 
                                value={selectedDeptId}
                                onChange={e => handleDeptChange(e.target.value)}
                                className="px-4 py-2 bg-transparent text-sm font-bold text-gray-700 outline-none min-w-[180px]"
                            >
                                <option value="">-- Theo Khoa --</option>
                                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                            <div className="w-px h-6 bg-gray-100"></div>
                            <select 
                                value={selectedSectionId}
                                onChange={e => handleSectionChange(e.target.value)}
                                className="px-4 py-2 bg-transparent text-sm font-bold text-gray-700 outline-none min-w-[200px]"
                            >
                                <option value="">-- Lớp học phần --</option>
                                {sections.map(s => <option key={s.id} value={s.id}>{s.classCode} - {s.courseName}</option>)}
                            </select>
                            {selectedSectionId && (
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="ml-2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                                >
                                    <Settings size={20} />
                                </button>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
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
                    </div>
                </div>
            </div>

            {/* Main Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                    <RefreshCw size={48} className="text-indigo-600 animate-spin" />
                    <p className="text-gray-400 font-black uppercase tracking-widest animate-pulse">Đang tải dữ liệu...</p>
                </div>
            ) : viewMode === 'calendar' ? (
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-indigo-50/50 border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse min-w-[1200px] table-fixed">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="w-24 p-6 border-b border-gray-100"></th>
                                    {days.map(day => (
                                        <th key={day.value} className="p-6 border-b border-gray-100 text-center">
                                            <div className="text-xs font-black text-gray-400 uppercase tracking-widest">{day.label}</div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {periods.map(period => (
                                    <tr key={period} className="group">
                                        <td className="p-4 border-r border-gray-50 text-center align-middle bg-gray-50/20">
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Tiết {period}</div>
                                        </td>
                                        {days.map(day => {
                                            const cellSchedules = getScheduleForCell(day.value, period);
                                            return (
                                                <td key={`${day.value}-${period}`} className="border border-gray-100 p-0 h-20 relative group/cell">
                                                    {cellSchedules.map((s) => {
                                                        if (s.startPeriod !== period) return null;
                                                        const height = (s.endPeriod - s.startPeriod + 1);
                                                        return (
                                                            <div
                                                                key={s.id}
                                                                onClick={() => handleBlockClick(s)}
                                                                className={`absolute inset-x-1.5 top-1.5 z-10 p-3 rounded-2xl border-2 shadow-lg transition-all hover:scale-[1.03] hover:z-20 cursor-pointer overflow-hidden group/block
                                                                    ${s.mode === 'ONLINE' ? 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-emerald-100' : 'bg-indigo-50 border-indigo-200 text-indigo-900 shadow-indigo-100'}`}
                                                                style={{ height: `calc(${height * 100}% + ${(height - 1) * 4}px - 12px)` }}
                                                            >
                                                                <div className="font-black text-sm leading-tight mb-2 group-hover/block:text-indigo-600 transition-colors line-clamp-2">
                                                                    {s.courseName}
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center gap-1.5 text-[9px] font-bold opacity-70">
                                                                        <MapPin size={10} className="text-rose-500" />
                                                                        <span>{s.roomName} • {s.buildingName}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 text-[9px] font-bold opacity-70">
                                                                        <User size={10} className="text-indigo-500" /> 
                                                                        <span className="truncate">{s.lecturerName}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Lớp HP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {schedules.length > 0 ? (
                                [...schedules].sort((a,b) => a.dayOfWeek - b.dayOfWeek || a.startPeriod - b.startPeriod).map((s) => (
                                    <tr key={s.id} onClick={() => handleBlockClick(s)} className="hover:bg-indigo-50/20 transition-all group cursor-pointer">
                                        <td className="px-8 py-5">
                                            <span className="font-black text-gray-900">Thứ {s.dayOfWeek}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="text-indigo-400" />
                                                <span className="text-sm font-bold text-gray-600">Tiết {s.startPeriod} - {s.endPeriod}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{s.courseName}</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{s.lecturerName}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                                <MapPin size={14} className="text-rose-400" />
                                                <span>{s.roomName} • {s.buildingName}</span>
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
                                    <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-bold opacity-50 uppercase tracking-widest">
                                        Không tìm thấy lịch trình phù hợp
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Detail Modal */}
            {isDetailOpen && selectedDetail && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-white/20">
                        <div className={`p-10 text-white relative ${selectedDetail.mode === 'ONLINE' ? 'bg-emerald-600' : 'bg-indigo-600'}`}>
                            <button onClick={() => setIsDetailOpen(false)} className="absolute top-8 right-8 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                            <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                                <BookOpen size={32} />
                            </div>
                            <h2 className="text-2xl font-black mb-2 tracking-tight leading-tight">{selectedDetail.courseName}</h2>
                            <p className="text-white/80 font-bold uppercase tracking-widest text-[10px]">{selectedDetail.classCode}</p>
                        </div>

                        <div className="p-10 space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thời gian</span>
                                    <div className="flex items-center gap-2 text-gray-900 font-bold">
                                        <Clock size={16} className="text-indigo-500" />
                                        <span>Tiết {selectedDetail.startPeriod}-{selectedDetail.endPeriod}</span>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngày học</span>
                                    <div className="flex items-center gap-2 text-gray-900 font-bold">
                                        <CalendarIcon size={16} className="text-indigo-500" />
                                        <span>Thứ {selectedDetail.dayOfWeek}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Địa điểm</span>
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-3">
                                    <MapPin size={20} className="text-rose-500 mt-1 shrink-0" />
                                    <div>
                                        <div className="text-sm font-black text-gray-900">{selectedDetail.roomName}</div>
                                        <div className="text-xs text-gray-400 font-bold">{selectedDetail.buildingName}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Giảng viên</span>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                        <User size={24} />
                                    </div>
                                    <span className="font-black text-gray-900">{selectedDetail.lecturerName}</span>
                                </div>
                            </div>

                            <button onClick={() => setIsDetailOpen(false)} className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl transition-all shadow-xl shadow-gray-200">
                                ĐÓNG CHI TIẾT
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ScheduleFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                section={sections.find(s => s.id === selectedSectionId)}
                onUpdate={() => fetchSectionSchedule(selectedSectionId)}
            />
        </div>
    );
};

export default SchedulePage;
