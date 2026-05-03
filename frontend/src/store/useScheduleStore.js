import { create } from 'zustand';
import scheduleApi from '../api/scheduleApi';
import toast from 'react-hot-toast';

const useScheduleStore = create((set, get) => ({
    schedules: [],
    timeSlots: [],
    buildings: [],
    loading: false,
    error: null,

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
