package uni.it.stdmanager.modules.iv_course.service;

import uni.it.stdmanager.modules.iv_course.dto.request.CourseRequest;
import uni.it.stdmanager.modules.iv_course.dto.response.CourseResponse;
import uni.it.stdmanager.modules.iv_course.dto.response.MandatoryCourseResponse;

import java.util.List;
import java.util.UUID;

public interface CourseService {
    List<CourseResponse> getAllCourses(UUID departmentId);
    CourseResponse getCourseById(UUID id);
    CourseResponse createCourse(CourseRequest request);
    CourseResponse updateCourse(UUID id, CourseRequest request);
    void deleteCourse(UUID id);
    List<MandatoryCourseResponse> getMandatoryCoursesForCurrentStudent();
}
