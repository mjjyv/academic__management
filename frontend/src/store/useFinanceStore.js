import { create } from 'zustand';
import financeApi from '../api/financeApi';

const useFinanceStore = create((set) => ({
    tuitionData: null,
    tuitionFees: [],
    studentTuitions: [],
    payments: [],
    loading: false,
    error: null,

    fetchTuitionFees: async () => {
        set({ loading: true });
        try {
            const response = await financeApi.getTuitionFees();
            if (response.success) {
                set({ tuitionFees: response.data, loading: false });
            }
        } catch (err) {
            set({ loading: false });
        }
    },

    fetchAllTuitions: async () => {
        set({ loading: true });
        try {
            const response = await financeApi.getAllTuitions();
            if (response.success) {
                set({ studentTuitions: response.data, loading: false });
            }
        } catch (err) {
            set({ loading: false });
        }
    },

    fetchStudentTuitions: async (studentId) => {
        set({ loading: true });
        try {
            const response = await financeApi.getStudentTuitions(studentId);
            if (response.success) {
                set({ studentTuitions: response.data, loading: false });
            }
        } catch (err) {
            set({ loading: false });
        }
    },

    saveTuitionFee: async (data) => {
        set({ loading: true });
        try {
            const response = data.id 
                ? await financeApi.updateTuitionFee(data.id, data)
                : await financeApi.createTuitionFee(data);
            if (response.success) {
                set({ loading: false });
                return response;
            }
        } catch (err) {
            set({ loading: false });
            throw err;
        }
    },

    calculateCurrentTuition: async (studentId, semesterId) => {
        set({ loading: true, error: null });
        try {
            const response = await financeApi.calculateTuition(studentId, semesterId);
            if (response.success) {
                // Update the studentTuitions array with the newly calculated tuition
                set(state => {
                    const existingIndex = state.studentTuitions.findIndex(t => t.semesterId === semesterId);
                    let newTuitions = [...state.studentTuitions];
                    if (existingIndex >= 0) {
                        newTuitions[existingIndex] = response.data;
                    } else {
                        newTuitions.push(response.data);
                    }
                    return { tuitionData: response.data, studentTuitions: newTuitions, loading: false };
                });
                return response.data;
            }
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    fetchPaymentHistory: async (studentId) => {
        set({ loading: true });
        try {
            const response = await financeApi.getPaymentHistory(studentId);
            if (response.success) {
                set({ payments: response.data, loading: false });
            }
        } catch (err) {
            set({ loading: false });
        }
    },

    fetchCurrentTuition: async () => {
        set({ loading: true, error: null });
        try {
            const response = await financeApi.getCurrentTuition();
            if (response.success) {
                set({ tuitionData: response.data, loading: false });
                return response.data;
            }
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    fetchDebtSummary: async () => {
        set({ loading: true, error: null });
        try {
            const response = await financeApi.getDebtSummary();
            if (response.success) {
                // Assuming TuitionSummaryResponse has semesterTuitions list
                set({ studentTuitions: response.data.semesterTuitions, loading: false });
                return response.data;
            }
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    }
}));

export default useFinanceStore;
