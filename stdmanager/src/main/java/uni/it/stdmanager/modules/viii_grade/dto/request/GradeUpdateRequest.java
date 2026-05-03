package uni.it.stdmanager.modules.viii_grade.dto.request;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class GradeUpdateRequest {
    private List<ComponentGradeInput> grades;

    @Data
    public static class ComponentGradeInput {
        private UUID componentId;
        private BigDecimal score;
    }
}
