import axiosClient from "./axiosClient";

const financeApi = {
    calculateTuition: (studentId, semesterId) => 
        axiosClient.post(`/tuition/student/${studentId}/calculate/${semesterId}`),
    
    // Giả định các endpoint khác cho tương lai
    getTuitionSummary: (studentId) => axiosClient.get(`/tuition/student/${studentId}/summary`),
    getPaymentHistory: (studentId) => axiosClient.get(`/tuition/student/${studentId}/payments`),

    // Admin - Tuition Management
    getTuitionFees: () => axiosClient.get("/tuition-fees"),
    createTuitionFee: (data) => axiosClient.post("/tuition-fees", data),
    updateTuitionFee: (id, data) => axiosClient.put(`/tuition-fees/${id}`, data),
    getAllTuitions: () => axiosClient.get("/tuition/all"),
    getStudentTuitions: (studentId) => axiosClient.get(`/tuition/student/${studentId}`),
    
    // New Student Endpoints
    getCurrentTuition: () => axiosClient.get("/student/my-tuition/current"),
    getDebtSummary: () => axiosClient.get("/student/my-tuition/debt-summary"),
};

export default financeApi;
