import { create } from 'zustand';
import gradeApi from '../api/gradeApi';

const useGradeStore = create((set) => ({
    summaries: [],
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

    fetchAllSummaries: async () => {
        set({ loading: true, error: null });
        try {
            const response = await gradeApi.getAllSummaries();
            if (response.success) {
                set({ summaries: response.data, loading: false });
            }
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    calculateGPA: () => {
        const { summaries } = useGradeStore.getState();
        if (summaries.length === 0) return 0;
        
        const totalPoints = summaries.reduce((acc, curr) => acc + (curr.gpaValue || 0), 0);
        return (totalPoints / summaries.length).toFixed(2);
    }
}));

export default useGradeStore;
