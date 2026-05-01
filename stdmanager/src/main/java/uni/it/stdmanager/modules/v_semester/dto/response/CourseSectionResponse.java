package uni.it.stdmanager.modules.v_semester.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseSectionResponse {
    private UUID id;
    private String classCode;
    private String courseCode;
    private String courseName;
    private String semesterName;
    private String lecturerName;
    private Integer maxStudents;
    private Integer currentStudents; // Sẽ tính toán sau
    private String classType;
    private String status;
    private LocalDateTime registrationStart;
    private LocalDateTime registrationEnd;
}
