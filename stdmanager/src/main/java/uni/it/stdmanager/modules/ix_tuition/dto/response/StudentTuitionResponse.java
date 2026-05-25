package uni.it.stdmanager.modules.ix_tuition.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentTuitionResponse {
    private UUID id;
    private UUID studentId;
    private String studentCode;
    private String studentName;
    private UUID semesterId;
    private String semesterName;
    private Integer totalCredits;
    private BigDecimal rawAmount;
    private BigDecimal scholarshipDeduction;
    private BigDecimal exemptionAmount;
    private BigDecimal netAmount;
    private BigDecimal paidAmount;
    private BigDecimal debtAmount;
    private Integer status; // 1-PAID, 2-PARTIAL, 3-DEBT, 4-OVERDUE
    private LocalDate deadline;
    private List<TuitionDetailItem> details;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TuitionDetailItem {
        private String courseName;
        private String courseCode;
        private BigDecimal credits;
        private Integer registrationType; // 1-NEW, 2-RETAKE, 3-IMPROVE
        private BigDecimal amount;
    }
}
