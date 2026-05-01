import axiosClient from './axiosClient';

export const courseSectionApi = {
    getDetail: (id) => {
        return axiosClient.get(`/course-sections/${id}`);
    },
};
