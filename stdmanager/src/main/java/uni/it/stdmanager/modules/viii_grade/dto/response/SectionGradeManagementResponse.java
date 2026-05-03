package uni.it.stdmanager.modules.viii_grade.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class SectionGradeManagementResponse {
    private UUID sectionId;
    private String classCode;
    private String courseName;
    private String semesterName;
    private Integer studentCount;
}
