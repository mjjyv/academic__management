import React, { useEffect } from 'react';
import { Calendar, Clock, MapPin, User, BookOpen, ChevronLeft, ChevronRight, X } from 'lucide-react';
import useScheduleStore from '../../store/useScheduleStore';
import useAuthStore from '../../store/useAuthStore';
import ScheduleFormModal from '../../components/ScheduleFormModal';
import { Settings } from 'lucide-react';

const SchedulePage = () => {
  const { schedules, loading, fetchStudentSchedule, fetchLecturerSchedule, fetchDepartmentSchedule, fetchSectionSchedule, fetchClassSchedule } = useScheduleStore();
  const { user } = useAuthStore();

  const [departments, setDepartments] = React.useState([]);
  const [sections, setSections] = React.useState([]);
  const [studentClasses, setStudentClasses] = React.useState([]);
  const [selectedDeptId, setSelectedDeptId] = React.useState(user?.departmentId || '');
  const [selectedClassId, setSelectedClassId] = React.useState('');
  const [selectedSectionId, setSelectedSectionId] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const isAdminOrStaff = user?.roles?.some(role => ['ADMIN', 'GIAOVU'].includes(role));
  const isLecturer = user?.roles?.includes('GIANGVIEN');
  const canManage = isAdminOrStaff || isLecturer;

  useEffect(() => {
    if (isAdminOrStaff) {
      fetchDepartments();
    }
    if (isLecturer) {
      fetchLecturerSections();
    }
  }, []);

  useEffect(() => {
    if (isAdminOrStaff && selectedDeptId) {
      fetchSections(selectedDeptId);
      fetchClasses(selectedDeptId);
      fetchDepartmentSchedule(selectedDeptId);
      setSelectedSectionId('');
      setSelectedClassId('');
    }
  }, [selectedDeptId]);

  useEffect(() => {
    if (selectedClassId) {
      fetchClassSchedule(selectedClassId);
      setSelectedSectionId('');
    } else if (selectedSectionId) {
      fetchSectionSchedule(selectedSectionId);
      setSelectedClassId('');
    } else if (isAdminOrStaff && selectedDeptId) {
      fetchDepartmentSchedule(selectedDeptId);
    } else if (isLecturer) {
      fetchLecturerSchedule(user.id);
    }
  }, [selectedSectionId, selectedClassId]);

  useEffect(() => {
    if (user && user.roles.includes('SINHVIEN')) {
      fetchStudentSchedule(user.id);
    }
  }, [user]);

  const fetchDepartments = async () => {
    try {
      const { departmentApi } = await import('../../api/departmentApi');
      const res = await departmentApi.getAllActive();
      if (res.success) setDepartments(res.data);
    } catch (error) { }
  };

  const fetchClasses = async (deptId) => {
    try {
      const { studentApi } = await import('../../api/studentApi');
      const res = await studentApi.getClassesByDepartment(deptId);
      if (res.success) setStudentClasses(res.data);
    } catch (error) { }
  };

  const fetchSections = async (deptId) => {
    try {
      const { semesterApi } = await import('../../api/semesterApi');
      const res = await semesterApi.getSectionsByDepartment(deptId);
      if (res.success) setSections(res.data);
    } catch (error) { }
  };

  const fetchLecturerSections = async () => {
    try {
      const { semesterApi } = await import('../../api/semesterApi');
      const res = await semesterApi.getSectionsByLecturer(user.id);
      if (res.success) setSections(res.data);
    } catch (error) { }
  };

  const days = [
    { label: 'Thứ 2', value: 2 },
    { label: 'Thứ 3', value: 3 },
    { label: 'Thứ 4', value: 4 },
    { label: 'Thứ 5', value: 5 },
    { label: 'Thứ 6', value: 6 },
    { label: 'Thứ 7', value: 7 },
    { label: 'Chủ nhật', value: 8 },
  ];

  const [selectedDetail, setSelectedDetail] = React.useState(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  const handleBlockClick = (s) => {
    setSelectedDetail(s);
    setIsDetailOpen(true);
  };

  const periods = Array.from({ length: 15 }, (_, i) => i + 1);

  const getScheduleForCell = (day, period) => {
    return schedules.filter(s => s.dayOfWeek === day && period >= s.startPeriod && period <= s.endPeriod);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="text-blue-600" />
            {user?.roles?.includes('SINHVIEN') ? 'Thời khóa biểu cá nhân' :
              user?.roles?.includes('GIANGVIEN') ? 'Lịch giảng dạy cá nhân' :
                'Lịch học khoa / lớp / đơn vị'}
          </h1>
          <p className="text-sm text-gray-500">
            {user?.roles?.includes('SINHVIEN') ? 'Theo dõi lịch học trong tuần.' :
              user?.roles?.includes('GIANGVIEN') ? 'Theo dõi lịch giảng dạy trong tuần.' :
                'Quản lý lịch học của khoa / lớp / đơn vị phụ trách.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {canManage && (
            <div className="flex gap-2 mr-4">
              {isAdminOrStaff && (
                <>
                  <select
                    value={selectedDeptId}
                    onChange={(e) => setSelectedDeptId(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-700 outline-none shadow-sm"
                  >
                    <option value="">-- Chọn Khoa --</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </>
              )}
              <select
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-700 outline-none shadow-sm min-w-[150px]"
              >
                <option value="">{isLecturer && !isAdminOrStaff ? 'Lịch giảng dạy tất cả lớp' : '-- Theo Lớp học phần --'}</option>
                {sections.map(sec => (
                  <option key={sec.id} value={sec.id}>{sec.classCode} - {sec.courseName}</option>
                ))}
              </select>

              {selectedSectionId && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
                >
                  <Settings size={14} /> Quản lý lịch
                </button>
              )}
            </div>
          )}
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors"><ChevronLeft size={20} /></button>
            <span className="text-sm font-bold px-4 text-gray-700">Tuần hiện tại</span>
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors"><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Học phần chính</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <span>Học phần tự chọn</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>ONLINE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>OFFLINE</span>
            </div>
          </div>
          <div className="text-xs font-bold text-blue-600 uppercase tracking-widest">Học kỳ 2025-2026</div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600"></div>
            <p className="text-sm font-bold text-gray-400 animate-pulse">Đang tải lịch học...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[1000px] table-fixed">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="p-4 border-b border-gray-100 w-24"></th>
                  {days.map(day => (
                    <th key={day.value} className="p-4 border-b border-gray-100 text-center">
                      <div className="text-xs uppercase text-gray-400 font-black tracking-widest">{day.label}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map(period => (
                  <tr key={period} className="group">
                    <td className="p-2 border-r border-gray-50 text-center align-middle bg-gray-50/30">
                      <div className="text-[10px] font-black text-gray-400 uppercase">Tiết {period}</div>
                    </td>
                    {days.map(day => {
                      const cellSchedules = getScheduleForCell(day.value, period);

                      return (
                        <td key={`${day.value}-${period}`} className="border border-gray-100 p-0 h-16 relative group/cell">
                          {cellSchedules.map((s, idx) => {
                            if (s.startPeriod !== period) return null;
                            const height = (s.endPeriod - s.startPeriod + 1);

                            return (
                              <div
                                key={s.id}
                                onClick={() => handleBlockClick(s)}
                                className={`absolute inset-x-1.5 top-1.5 z-10 p-3 rounded-xl border-2 shadow-lg transition-all hover:scale-[1.02] hover:z-20 cursor-pointer overflow-hidden group/block
                                  ${s.mode === 'ONLINE'
                                    ? 'bg-green-50 border-green-200 text-green-900 shadow-green-100'
                                    : 'bg-blue-50 border-blue-200 text-blue-900 shadow-blue-100'}`}
                                style={{ height: `calc(${height * 100}% + ${(height - 1) * 8}px - 12px)` }}
                              >
                                <div className="font-black text-[18px] leading-tight mb-2 group-hover/block:text-blue-600 transition-colors">
                                  {s.courseName}
                                </div>
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-70">
                                    <MapPin size={12} className="text-red-500" />
                                    <span className="bg-white/50 px-1.5 py-0.5 rounded-md border border-black/5">
                                      {s.roomName} • {s.buildingName}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-70">
                                    <User size={12} className="text-blue-500" /> {s.lecturerName}
                                  </div>
                                </div>

                                <div className="absolute bottom-2 right-2 flex items-center gap-2">
                                  <span className={`text-[9px] px-2 py-0.5 rounded-lg font-black uppercase tracking-wider shadow-sm
                                    ${s.mode === 'ONLINE' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
                                    {s.mode}
                                  </span>
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
        )}
      </div>

      {/* Detail Modal */}
      {isDetailOpen && selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className={`p-8 text-white relative ${selectedDetail.mode === 'ONLINE' ? 'bg-green-600' : 'bg-blue-600'}`}>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen size={32} />
              </div>
              <h2 className="text-2xl font-black mb-2 tracking-tight leading-tight">{selectedDetail.courseName}</h2>
              <p className="text-white/80 font-bold uppercase tracking-widest text-xs">{selectedDetail.classCode}</p>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thời gian</span>
                  <div className="flex items-center gap-2 text-gray-800 font-bold">
                    <Clock size={16} className="text-blue-500" />
                    <span>Tiết {selectedDetail.startPeriod} - {selectedDetail.endPeriod}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thứ</span>
                  <div className="flex items-center gap-2 text-gray-800 font-bold">
                    <Calendar size={16} className="text-indigo-500" />
                    <span>Thứ {selectedDetail.dayOfWeek}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Địa điểm</span>
                <div className="flex items-start gap-2 text-gray-800 font-bold bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <MapPin size={20} className="text-red-500 mt-1 shrink-0" />
                  <div>
                    <div className="text-base">{selectedDetail.roomName}</div>
                    <div className="text-xs text-gray-400 font-medium">{selectedDetail.buildingName}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Giảng viên</span>
                <div className="flex items-center gap-3 text-gray-800 font-bold">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <User size={20} />
                  </div>
                  <span>{selectedDetail.lecturerName}</span>
                </div>
              </div>

              <button
                onClick={() => setIsDetailOpen(false)}
                className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black rounded-2xl transition-all mt-4"
              >
                ĐÓNG CỬA SỔ
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
          <BookOpen className="mb-4 opacity-80" size={32} />
          <h3 className="text-lg font-bold mb-1">Ghi chú học tập</h3>
          <p className="text-blue-100 text-xs leading-relaxed">
            Kiểm tra kỹ phòng học và tòa nhà trước khi di chuyển. Đối với các lớp Online, vui lòng truy cập đường link trong chi tiết môn học.
          </p>
        </div>

        <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-gray-800 font-bold mb-4 flex items-center gap-2">
            <Clock className="text-orange-500" size={20} />
            Khung giờ tiết học
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 bg-gray-50 rounded-xl">
              <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Sáng (T1-T6)</div>
              <div className="text-xs font-bold text-gray-700">07:00 - 12:00</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Chiều (T7-T11)</div>
              <div className="text-xs font-bold text-gray-700">13:00 - 18:00</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Tối (T12-T15)</div>
              <div className="text-xs font-bold text-gray-700">18:30 - 20:15</div>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <div className="text-[10px] text-blue-400 font-bold uppercase mb-1">Học kỳ</div>
              <div className="text-xs font-bold text-blue-600">2025 - 2026</div>
            </div>
          </div>
        </div>
      </div>

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
