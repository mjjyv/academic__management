import { create } from 'zustand';
import { semesterApi } from '../api/semesterApi';

const useSemesterStore = create((set) => ({
    semesters: [],
    loading: false,
    error: null,

    fetchSemesters: async () => {
        set({ loading: true, error: null });
        try {
            const response = await semesterApi.getAllSemesters();
            if (response.success) {
                set({ semesters: response.data, loading: false });
            }
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    }
}));

export default useSemesterStore;
