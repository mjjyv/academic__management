package uni.it.stdmanager.modules.ii_student.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassCourseHistoryResponse {
    private UUID sectionId;
    private String semesterName;
    private String courseCode;
    private String courseName;
    private String classCode; // Mã lớp học phần (VD: INT1302.01)
    private String lecturerName;
    private Integer studentCount;
    private Double averageScore;
    private String status;
}
