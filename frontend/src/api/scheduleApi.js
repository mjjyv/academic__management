import axiosClient from './axiosClient';

const scheduleApi = {
    // Current user schedule (Student or Lecturer)
    getMySchedule: () => axiosClient.get('/schedules/mine'),
    
    // Detailed queries
    getStudentSchedule: (userId) => axiosClient.get(`/schedules/student/${userId}`),
    getLecturerSchedule: (userId) => axiosClient.get(`/schedules/lecturer/${userId}`),
    getDepartmentSchedule: (deptId) => axiosClient.get(`/schedules/department/${deptId}`),
    getScheduleByClass: (classId) => axiosClient.get(`/schedules/class/${classId}`),
    getScheduleBySection: (sectionId) => axiosClient.get(`/schedules/sections/${sectionId}`),
    
    // Infrastructure
    getBuildings: () => axiosClient.get('/infrastructure/buildings'),
    getRooms: (buildingId) => axiosClient.get(`/infrastructure/buildings/${buildingId}/rooms`),
    getTimeSlots: () => axiosClient.get('/infrastructure/time-slots'),

    // Management
    createSchedule: (data) => axiosClient.post('/schedules', data),
    updateSchedule: (id, data) => axiosClient.put(`/schedules/${id}`, data),
    deleteSchedule: (id) => axiosClient.delete(`/schedules/${id}`),
};

export default scheduleApi;
