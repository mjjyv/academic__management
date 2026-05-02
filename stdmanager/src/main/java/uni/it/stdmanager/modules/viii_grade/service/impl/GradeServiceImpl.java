package uni.it.stdmanager.modules.viii_grade.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.modules.viii_grade.dto.response.StudentSummaryResponse;
import uni.it.stdmanager.modules.viii_grade.entity.StudentSummary;
import uni.it.stdmanager.modules.viii_grade.repository.StudentSummaryRepository;
import uni.it.stdmanager.modules.viii_grade.service.GradeService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GradeServiceImpl implements GradeService {

    private final StudentSummaryRepository studentSummaryRepository;

    @Override
    public List<StudentSummaryResponse> getStudentSummaries(UUID studentId) {
        return studentSummaryRepository.findActiveSummariesByStudentId(studentId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentSummaryResponse> getAllSummaries() {
        return studentSummaryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private StudentSummaryResponse mapToResponse(StudentSummary summary) {
        return StudentSummaryResponse.builder()
                .id(summary.getId())
                .registrationId(summary.getRegistration().getId())
                .studentId(summary.getRegistration().getStudent().getId())
                .studentCode(summary.getRegistration().getStudent().getStudentCode())
                .studentName(summary.getRegistration().getStudent().getFullName())
                .courseId(summary.getRegistration().getCourseSection().getCourse().getId())
                .courseName(summary.getRegistration().getCourseSection().getCourse().getCourseName())
                .totalScore(summary.getTotalScore() != null ? summary.getTotalScore().doubleValue() : null)
                .letterGrade(summary.getLetterGrade())
                .gpaValue(summary.getGpaValue() != null ? summary.getGpaValue().doubleValue() : null)
                .result(summary.getResult())
                .build();
    }
}
