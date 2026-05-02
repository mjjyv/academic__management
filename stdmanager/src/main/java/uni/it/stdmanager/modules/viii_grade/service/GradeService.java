package uni.it.stdmanager.modules.viii_grade.service;

import uni.it.stdmanager.modules.viii_grade.dto.response.StudentSummaryResponse;

import java.util.List;
import java.util.UUID;

public interface GradeService {
    List<StudentSummaryResponse> getStudentSummaries(UUID studentId);
    List<StudentSummaryResponse> getAllSummaries();
}
