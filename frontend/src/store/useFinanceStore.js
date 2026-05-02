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
                set({ tuitionData: response.data, loading: false });
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
    }
}));

export default useFinanceStore;
