package uni.it.stdmanager.modules.ix_tuition.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.ix_tuition.dto.response.StudentTuitionResponse;
import uni.it.stdmanager.modules.ix_tuition.dto.response.TuitionSummaryResponse;
import uni.it.stdmanager.modules.ix_tuition.service.TuitionService;

@RestController
@RequestMapping("/api/v1/student/my-tuition")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SINHVIEN')")
public class StudentTuitionController {

    private final TuitionService tuitionService;

    @GetMapping("/current")
    public ApiResponse<StudentTuitionResponse> getCurrentTuition() {
        return ApiResponse.success(tuitionService.getCurrentSemesterTuitionForCurrentStudent(), "Lấy thông tin học phí kỳ hiện tại thành công");
    }

    @GetMapping("/debt-summary")
    public ApiResponse<TuitionSummaryResponse> getDebtSummary() {
        return ApiResponse.success(tuitionService.getDebtSummaryForCurrentStudent(), "Lấy tổng hợp nợ thành công");
    }
}
