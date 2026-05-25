package uni.it.stdmanager.modules.iv_course.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.iv_course.dto.response.MandatoryCourseResponse;
import uni.it.stdmanager.modules.iv_course.service.CourseService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/student/my-courses")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SINHVIEN')")
public class StudentCourseController {

    private final CourseService courseService;

    @GetMapping("/mandatory")
    public ApiResponse<List<MandatoryCourseResponse>> getMandatoryCourses() {
        return ApiResponse.success(courseService.getMandatoryCoursesForCurrentStudent(), "Lấy danh sách học phần bắt buộc thành công");
    }
}
