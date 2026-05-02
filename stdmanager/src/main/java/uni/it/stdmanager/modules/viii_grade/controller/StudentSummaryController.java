package uni.it.stdmanager.modules.viii_grade.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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
}
