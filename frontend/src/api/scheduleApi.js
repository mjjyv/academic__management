import axiosClient from './axiosClient';

const scheduleApi = {
    getStudentSchedule: (studentId) => axiosClient.get(`/schedules/student/${studentId}`),
    getLecturerSchedule: (userId) => axiosClient.get(`/schedules/lecturer/${userId}`),
    getDepartmentSchedule: (deptId) => axiosClient.get(`/schedules/department/${deptId}`),
    getSectionSchedules: (sectionId) => axiosClient.get(`/schedules/sections/${sectionId}`),
    
    // Infrastructure
    getBuildings: () => axiosClient.get('/infrastructure/buildings'),
    getRooms: (buildingId) => axiosClient.get(`/infrastructure/buildings/${buildingId}/rooms`),
    getTimeSlots: () => axiosClient.get('/infrastructure/time-slots'),
};

export default scheduleApi;
