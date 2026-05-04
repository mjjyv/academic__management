import React, { useEffect } from 'react';
import { Calendar, Clock, MapPin, User, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import useScheduleStore from '../../store/useScheduleStore';
import useAuthStore from '../../store/useAuthStore';
import ScheduleFormModal from '../../components/ScheduleFormModal';
import { Settings } from 'lucide-react';

const SchedulePage = () => {
  const { schedules, loading, fetchStudentSchedule, fetchLecturerSchedule, fetchDepartmentSchedule, fetchSectionSchedule } = useScheduleStore();
  const { user } = useAuthStore();
  
  const [departments, setDepartments] = React.useState([]);
  const [sections, setSections] = React.useState([]);
  const [selectedDeptId, setSelectedDeptId] = React.useState(user?.departmentId || '');
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
      fetchDepartmentSchedule(selectedDeptId);
      setSelectedSectionId('');
    }
  }, [selectedDeptId]);

  useEffect(() => {
    if (canManage && selectedSectionId) {
      fetchSectionSchedule(selectedSectionId);
    } else if (isAdminOrStaff && selectedDeptId && !selectedSectionId) {
      fetchDepartmentSchedule(selectedDeptId);
    } else if (isLecturer && !selectedSectionId) {
      fetchLecturerSchedule(user.id);
    }
  }, [selectedSectionId]);

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
    } catch (error) {}
  };

  const fetchSections = async (deptId) => {
    try {
      const { semesterApi } = await import('../../api/semesterApi');
      const res = await semesterApi.getSectionsByDepartment(deptId);
      if (res.success) setSections(res.data);
    } catch (error) {}
  };

  const fetchLecturerSections = async () => {
    try {
      const { semesterApi } = await import('../../api/semesterApi');
      const res = await semesterApi.getSectionsByLecturer(user.id);
      if (res.success) setSections(res.data);
    } catch (error) {}
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
             'Lịch học khoa / đơn vị'}
          </h1>
          <p className="text-sm text-gray-500">
            {user?.roles?.includes('SINHVIEN') ? 'Theo dõi lịch học trong tuần.' : 
             user?.roles?.includes('GIANGVIEN') ? 'Theo dõi lịch giảng dạy trong tuần.' : 
             'Quản lý lịch học của khoa / đơn vị phụ trách.'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {canManage && (
            <div className="flex gap-2 mr-4">
              {isAdminOrStaff && (
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
              )}
              <select 
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-700 outline-none shadow-sm min-w-[150px]"
              >
                <option value="">{isLecturer && !isAdminOrStaff ? 'Lịch giảng dạy tất cả lớp' : 'Tất cả Lớp học phần'}</option>
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
          <div className="text-xs font-bold text-blue-600">Học kỳ 2025-2026</div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="p-4 border-b border-gray-100 w-20"></th>
                  {days.map(day => (
                    <th key={day.value} className="p-4 border-b border-gray-100 text-center">
                      <div className="text-xs uppercase text-gray-400 font-bold tracking-wider">{day.label}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map(period => (
                  <tr key={period} className="group">
                    <td className="p-2 border-r border-gray-50 text-center align-middle">
                      <div className="text-[10px] font-bold text-gray-400">Tiết {period}</div>
                    </td>
                    {days.map(day => {
                      const cellSchedules = getScheduleForCell(day.value, period);
                      const isStart = cellSchedules.some(s => s.startPeriod === period);
                      
                      return (
                        <td key={`${day.value}-${period}`} className="border border-gray-50 p-1 h-14 relative">
                          {cellSchedules.map((s, idx) => {
                            if (s.startPeriod !== period) return null;
                            const height = (s.endPeriod - s.startPeriod + 1);
                            
                            return (
                              <div 
                                key={s.id}
                                className={`absolute inset-x-1 top-1 z-10 p-2 rounded-lg border shadow-sm transition-all hover:shadow-md cursor-pointer overflow-hidden
                                  ${idx % 2 === 0 ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-indigo-50 border-indigo-100 text-indigo-700'}`}
                                style={{ height: `calc(${height * 100}% + ${(height - 1) * 8}px - 8px)` }}
                              >
                                <div className="font-bold text-[11px] leading-tight mb-1 truncate">{s.courseName}</div>
                                <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1">
                                  <div className="flex items-center gap-1 text-[9px] font-medium opacity-80">
                                    <MapPin size={10} /> {s.roomName} - {s.buildingName}
                                  </div>
                                  <div className="flex items-center gap-1 text-[9px] font-medium opacity-80">
                                    <User size={10} /> {s.lecturerName}
                                  </div>
                                </div>
                                <div className="absolute bottom-1 right-1">
                                  <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter
                                    ${s.mode === 'ONLINE' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
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
              <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Sáng (T1-T5)</div>
              <div className="text-xs font-bold text-gray-700">07:00 - 11:30</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Chiều (T6-T10)</div>
              <div className="text-xs font-bold text-gray-700">12:30 - 17:00</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Tối (T11-T15)</div>
              <div className="text-xs font-bold text-gray-700">17:30 - 21:00</div>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <div className="text-[10px] text-blue-400 font-bold uppercase mb-1">Trạng thái</div>
              <div className="text-xs font-bold text-blue-600">Học kỳ 2526</div>
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
