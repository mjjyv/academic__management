package uni.it.stdmanager.modules.viii_grade.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.viii_grade.dto.response.StudentSummaryResponse;
import uni.it.stdmanager.modules.viii_grade.service.GradeService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/grades")
@RequiredArgsConstructor
@Tag(name = "Grade Module", description = "Quản lý điểm và kết quả học tập")
public class StudentSummaryController {

    private final GradeService gradeService;

    @GetMapping("/student/{studentId}/summaries")
    @PreAuthorize("hasAnyRole('SINHVIEN', 'GIANGVIEN', 'GIAOVU', 'ADMIN')")
    @Operation(summary = "Lấy danh sách điểm tổng kết của sinh viên (đã lọc các môn học lại)")
    public ApiResponse<List<StudentSummaryResponse>> getStudentSummaries(@PathVariable UUID studentId) {
        return ApiResponse.success(gradeService.getStudentSummaries(studentId), "Lấy danh sách điểm thành công");
    }

    @GetMapping("/summaries")
    @PreAuthorize("hasAnyRole('GIANGVIEN', 'GIAOVU', 'ADMIN')")
    @Operation(summary = "Lấy toàn bộ danh sách điểm tổng kết, có thể lọc theo khoa (Admin/Giáo vụ)")
    public ApiResponse<List<StudentSummaryResponse>> getAllSummaries(@RequestParam(required = false) UUID departmentId) {
        return ApiResponse.success(gradeService.getAllSummaries(departmentId), "Lấy toàn bộ danh sách điểm thành công");
    }
}
