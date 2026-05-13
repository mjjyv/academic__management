package uni.it.stdmanager.modules.iv_course.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainingProgramRequest {
    @NotBlank(message = "Mã chương trình không được để trống")
    @Size(max = 50, message = "Mã chương trình tối đa 50 ký tự")
    private String programCode;

    @NotBlank(message = "Tên chương trình không được để trống")
    @Size(max = 255, message = "Tên chương trình tối đa 255 ký tự")
    private String programName;

    private String programNameEn;

    @NotNull(message = "Chuyên ngành không được để trống")
    private UUID majorId;

    private UUID departmentId;

    @Size(max = 50)
    private String degreeLevel;

    @Size(max = 50)
    private String educationType;

    private BigDecimal totalCredits;
    private BigDecimal requiredCredits;
    private BigDecimal electiveCredits;
    private BigDecimal internshipCredits;
    private BigDecimal thesisCredits;

    private LocalDate admissionYear;
    private BigDecimal durationYears;
    private BigDecimal maxDurationYears;
    private LocalDate effectiveDate;
    private LocalDate expiryDate;

    private String description;
    private String objectives;
    private String learningOutcomes;

    @Size(max = 20)
    private String version;

    @Size(max = 20)
    private String status;
}
