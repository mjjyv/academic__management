import axiosClient from "./axiosClient";

const gradeApi = {
    getStudentSummaries: (studentId) => axiosClient.get(`/grades/student/${studentId}/summaries`),
    getAllSummaries: (departmentId) => axiosClient.get("/grades/summaries", { params: { departmentId } }),
    
    // Management endpoints
    getManagementSections: () => axiosClient.get("/grade-management/sections"),
    getSectionDetails: (sectionId) => axiosClient.get(`/grade-management/sections/${sectionId}/details`),
    updateStudentGrades: (registrationId, data) => axiosClient.put(`/grade-management/registrations/${registrationId}/grades`, data),
};

export default gradeApi;
