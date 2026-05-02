package uni.it.stdmanager.modules.ix_tuition.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.ix_tuition.dto.response.StudentTuitionResponse;
import uni.it.stdmanager.modules.ix_tuition.service.TuitionService;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tuition")
@RequiredArgsConstructor
@Tag(name = "Tuition Module", description = "Quản lý học phí và thanh toán")
public class TuitionController {

    private final TuitionService tuitionService;

    @PostMapping("/student/{studentId}/calculate/{semesterId}")
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "Tính toán học phí kỳ này cho sinh viên (phân biệt học mới/học lại)")
    public ApiResponse<BigDecimal> calculateTuition(
            @PathVariable UUID studentId, 
            @PathVariable UUID semesterId) {
        return ApiResponse.success(tuitionService.calculateTuition(studentId, semesterId), "Tính học phí thành công");
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('SINHVIEN', 'GIAOVU', 'ADMIN')")
    @Operation(summary = "Lấy danh sách học phí của sinh viên")
    public ApiResponse<List<StudentTuitionResponse>> getStudentTuitions(@PathVariable UUID studentId) {
        return ApiResponse.success(tuitionService.getStudentTuitions(studentId), "Lấy danh sách học phí thành công");
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "Lấy toàn bộ danh sách học phí (Admin/Giáo vụ)")
    public ApiResponse<List<StudentTuitionResponse>> getAllTuitions() {
        return ApiResponse.success(tuitionService.getAllTuitions(), "Lấy toàn bộ danh sách học phí thành công");
    }
}
