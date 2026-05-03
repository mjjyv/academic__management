package uni.it.stdmanager.modules.viii_grade.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class GradeDetailResponse {
    private UUID registrationId;
    private String studentCode;
    private String studentName;
    private List<ComponentGradeResponse> componentGrades;
    private BigDecimal totalScore;
    private String letterGrade;
    private String result;

    @Data
    @Builder
    public static class ComponentGradeResponse {
        private UUID componentId;
        private String componentCode;
        private String componentName;
        private BigDecimal weightPercentage;
        private BigDecimal score;
    }
}
