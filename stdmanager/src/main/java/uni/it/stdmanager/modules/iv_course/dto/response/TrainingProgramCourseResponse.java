package uni.it.stdmanager.modules.iv_course.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainingProgramCourseResponse {
    private UUID id;
    private UUID courseId;
    private String courseCode;
    private String courseName;
    private BigDecimal credits;
    private Integer semester;
    private Integer year;
    private Boolean isRequired;
    private String groupCode;
    private Boolean isElective;
    private String electiveGroupCode;
    private String prerequisiteCourseName;
    private String note;
    private Integer sortOrder;
    private String status;
}
