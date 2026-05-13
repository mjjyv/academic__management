package uni.it.stdmanager.modules.iv_course.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainingProgramCourseRequest {
    @NotNull(message = "ID chương trình đào tạo không được để trống")
    private UUID trainingProgramId;

    @NotNull(message = "ID môn học không được để trống")
    private UUID courseId;

    private Integer semester;
    private Integer year;
    private Boolean isRequired;
    private String groupCode;
    private Boolean isElective;
    private String electiveGroupCode;
    private UUID prerequisiteCourseId;
    private Boolean isPrerequisiteRequired;
    private String note;
    private Integer sortOrder;
    private String status;
}
