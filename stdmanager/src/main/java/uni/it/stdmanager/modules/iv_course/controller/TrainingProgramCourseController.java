package uni.it.stdmanager.modules.iv_course.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.iv_course.dto.request.TrainingProgramCourseRequest;
import uni.it.stdmanager.modules.iv_course.dto.response.TrainingProgramCourseResponse;
import uni.it.stdmanager.modules.iv_course.service.TrainingProgramCourseService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/training-program-courses")
@RequiredArgsConstructor
@Tag(name = "IV. Course Module", description = "API Quản lý Môn học và Chương trình đào tạo")
public class TrainingProgramCourseController {

    private final TrainingProgramCourseService trainingProgramCourseService;

    @GetMapping("/program/{programId}")
    @Operation(summary = "Lấy danh sách môn học của một chương trình đào tạo")
    public ApiResponse<List<TrainingProgramCourseResponse>> getCoursesByProgram(@PathVariable UUID programId) {
        return ApiResponse.success(trainingProgramCourseService.getCoursesByProgram(programId), "Lấy danh sách môn học trong chương trình thành công");
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "Thêm môn học vào chương trình đào tạo")
    public ApiResponse<TrainingProgramCourseResponse> addCourseToProgram(@Valid @RequestBody TrainingProgramCourseRequest request) {
        return ApiResponse.success(trainingProgramCourseService.addCourseToProgram(request), "Thêm môn học vào chương trình thành công");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "Cập nhật thông tin môn học trong chương trình")
    public ApiResponse<TrainingProgramCourseResponse> updateProgramCourse(
            @PathVariable UUID id,
            @Valid @RequestBody TrainingProgramCourseRequest request) {
        return ApiResponse.success(trainingProgramCourseService.updateProgramCourse(id, request), "Cập nhật thành công");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "Xóa môn học khỏi chương trình đào tạo")
    public ApiResponse<Void> removeCourseFromProgram(@PathVariable UUID id) {
        trainingProgramCourseService.removeCourseFromProgram(id);
        return ApiResponse.success(null, "Xóa môn học khỏi chương trình thành công");
    }
}
