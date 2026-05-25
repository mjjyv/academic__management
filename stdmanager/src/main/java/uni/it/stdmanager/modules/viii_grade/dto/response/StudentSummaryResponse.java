package uni.it.stdmanager.modules.viii_grade.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentSummaryResponse {
    private UUID id;
    private UUID registrationId;
    private UUID courseId;
    private String courseName;
    private UUID studentId;
    private String studentCode;
    private String studentName;
    private Double totalScore;
    private String letterGrade;
    private Double gpaValue;
    private String result; // PASS, FAIL
    private Boolean isFinalized;
}
