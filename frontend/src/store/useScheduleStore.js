import { create } from 'zustand';
import scheduleApi from '../api/scheduleApi';
import toast from 'react-hot-toast';

const useScheduleStore = create((set, get) => ({
    schedules: [],
    timeSlots: [],
    buildings: [],
    loading: false,
    error: null,
    
    fetchMySchedule: async () => {
        set({ loading: true });
        try {
            const res = await scheduleApi.getMySchedule();
            if (res.success) set({ schedules: res.data });
        } catch (err) {
            toast.error("Lỗi khi tải lịch biểu cá nhân");
        } finally {
            set({ loading: false });
        }
    },

    fetchStudentSchedule: async (studentId) => {
        set({ loading: true });
        try {
            const res = await scheduleApi.getStudentSchedule(studentId);
            if (res.success) set({ schedules: res.data });
        } catch (err) {
            toast.error("Lỗi khi tải thời khóa biểu sinh viên");
        } finally {
            set({ loading: false });
        }
    },

    fetchLecturerSchedule: async (userId) => {
        set({ loading: true });
        try {
            const res = await scheduleApi.getLecturerSchedule(userId);
            if (res.success) set({ schedules: res.data });
        } catch (err) {
            toast.error("Lỗi khi tải lịch dạy giảng viên");
        } finally {
            set({ loading: false });
        }
    },

    fetchDepartmentSchedule: async (deptId) => {
        set({ loading: true });
        try {
            const res = await scheduleApi.getDepartmentSchedule(deptId);
            if (res.success) set({ schedules: res.data });
        } catch (err) {
            toast.error("Lỗi khi tải lịch học khoa");
        } finally {
            set({ loading: false });
        }
    },

    fetchClassSchedule: async (classId) => {
        set({ loading: true });
        try {
            const res = await scheduleApi.getScheduleByClass(classId);
            if (res.success) set({ schedules: res.data });
        } catch (err) {
            toast.error("Lỗi khi tải lịch học lớp");
        } finally {
            set({ loading: false });
        }
    },

    fetchSectionSchedule: async (sectionId) => {
        set({ loading: true });
        try {
            const res = await scheduleApi.getScheduleBySection(sectionId);
            if (res.success) set({ schedules: res.data });
        } catch (err) {
            toast.error("Lỗi khi tải lịch học lớp học phần");
        } finally {
            set({ loading: false });
        }
    },

    fetchInfrastructure: async () => {
        try {
            const [slotsRes, buildingsRes] = await Promise.all([
                scheduleApi.getTimeSlots(),
                scheduleApi.getBuildings()
            ]);
            if (slotsRes.success) set({ timeSlots: slotsRes.data });
            if (buildingsRes.success) set({ buildings: buildingsRes.data });
        } catch (err) {
            console.error("Lỗi khi tải thông tin hạ tầng", err);
        }
    }
}));

export default useScheduleStore;
