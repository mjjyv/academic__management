package uni.it.stdmanager.modules.v_semester.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseSectionDetailResponse {
    private UUID id;
    private String classCode;
    private String courseCode;
    private String courseName;
    private BigDecimal credits;
    private String semesterName;
    private String lecturerName;
    private String classType;
    private String status;
    private Integer maxStudents;
    private Integer enrolledCount;
    private List<EnrolledStudentResponse> students;
}
