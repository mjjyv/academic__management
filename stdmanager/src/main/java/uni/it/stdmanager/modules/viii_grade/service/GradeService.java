package uni.it.stdmanager.modules.viii_grade.service;

import uni.it.stdmanager.modules.viii_grade.dto.request.GradeUpdateRequest;
import uni.it.stdmanager.modules.viii_grade.dto.response.GradeDetailResponse;
import uni.it.stdmanager.modules.viii_grade.dto.response.SectionGradeManagementResponse;
import uni.it.stdmanager.modules.viii_grade.dto.response.StudentSummaryResponse;

import java.util.List;
import java.util.UUID;

public interface GradeService {
    List<StudentSummaryResponse> getStudentSummaries(UUID studentId);
    List<StudentSummaryResponse> getAllSummaries(UUID departmentId);
    
    // New methods
    List<SectionGradeManagementResponse> getSectionsForLecturer(UUID userId);
    List<SectionGradeManagementResponse> getAllSectionsForStaff();
    List<GradeDetailResponse> getGradeDetailsBySection(UUID sectionId);
    void updateStudentGrades(UUID registrationId, GradeUpdateRequest request);
}
