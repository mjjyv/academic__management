import { create } from 'zustand';
import gradeApi from '../api/gradeApi';
import toast from 'react-hot-toast';

const useGradeStore = create((set, get) => ({
    summaries: [],
    managementSections: [],
    sectionDetails: [],
    loading: false,
    error: null,

    fetchStudentSummaries: async (studentId) => {
        set({ loading: true, error: null });
        try {
            const response = await gradeApi.getStudentSummaries(studentId);
            if (response.success) {
                set({ summaries: response.data, loading: false });
            }
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    fetchAllSummaries: async (departmentId) => {
        set({ loading: true, error: null });
        try {
            const response = await gradeApi.getAllSummaries(departmentId);
            if (response.success) {
                set({ summaries: response.data, loading: false });
            }
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    fetchManagementSections: async () => {
        set({ loading: true });
        try {
            const res = await gradeApi.getManagementSections();
            if (res.success) set({ managementSections: res.data });
        } catch (err) {
            toast.error("Lỗi khi tải danh sách lớp");
        } finally {
            set({ loading: false });
        }
    },

    fetchSectionDetails: async (sectionId) => {
        set({ loading: true });
        try {
            const res = await gradeApi.getSectionDetails(sectionId);
            if (res.success) set({ sectionDetails: res.data });
        } catch (err) {
            toast.error("Lỗi khi tải chi tiết điểm lớp");
        } finally {
            set({ loading: false });
        }
    },

    updateGrades: async (registrationId, grades) => {
        try {
            const res = await gradeApi.updateStudentGrades(registrationId, { grades });
            if (res.success) {
                toast.success("Cập nhật điểm thành công");
                return true;
            }
        } catch (err) {
            toast.error("Lỗi khi cập nhật điểm");
            return false;
        }
    },

    calculateGPA: () => {
        const { summaries } = get();
        if (summaries.length === 0) return 0;
        
        const totalPoints = summaries.reduce((acc, curr) => acc + (curr.gpaValue || 0), 0);
        return (totalPoints / summaries.length).toFixed(2);
    }
}));

export default useGradeStore;
