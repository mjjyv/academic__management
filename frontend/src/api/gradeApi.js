import axiosClient from "./axiosClient";

const gradeApi = {
    getStudentSummaries: (studentId) => axiosClient.get(`/grades/student/${studentId}/summaries`),
    getAllSummaries: () => axiosClient.get("/grades/summaries"),
};

export default gradeApi;
