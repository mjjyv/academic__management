package uni.it.stdmanager.modules.viii_grade.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.core.exception.AppException;
import uni.it.stdmanager.core.exception.ErrorCode;
import uni.it.stdmanager.modules.i_auth.entity.User;
import uni.it.stdmanager.modules.i_auth.repository.UserRepository;
import uni.it.stdmanager.modules.iii_lecturer.entity.Employee;
import uni.it.stdmanager.modules.iii_lecturer.repository.EmployeeRepository;
import uni.it.stdmanager.modules.v_semester.entity.CourseSection;
import uni.it.stdmanager.modules.v_semester.entity.LecturerCourseSection;
import uni.it.stdmanager.modules.v_semester.repository.CourseSectionRepository;
import uni.it.stdmanager.modules.v_semester.repository.LecturerCourseSectionRepository;
import uni.it.stdmanager.modules.vi_registration.entity.CourseRegistration;
import uni.it.stdmanager.modules.vi_registration.repository.CourseRegistrationRepository;
import uni.it.stdmanager.modules.viii_grade.dto.request.GradeUpdateRequest;
import uni.it.stdmanager.modules.viii_grade.dto.response.GradeDetailResponse;
import uni.it.stdmanager.modules.viii_grade.dto.response.SectionGradeManagementResponse;
import uni.it.stdmanager.modules.viii_grade.dto.response.StudentSummaryResponse;
import uni.it.stdmanager.modules.viii_grade.entity.GradeComponent;
import uni.it.stdmanager.modules.viii_grade.entity.GradeScale;
import uni.it.stdmanager.modules.viii_grade.entity.StudentComponentGrade;
import uni.it.stdmanager.modules.viii_grade.entity.StudentSummary;
import uni.it.stdmanager.modules.viii_grade.repository.GradeComponentRepository;
import uni.it.stdmanager.modules.viii_grade.repository.GradeScaleRepository;
import uni.it.stdmanager.modules.viii_grade.repository.StudentComponentGradeRepository;
import uni.it.stdmanager.modules.viii_grade.repository.StudentSummaryRepository;
import uni.it.stdmanager.modules.viii_grade.service.GradeService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GradeServiceImpl implements GradeService {

    private final StudentSummaryRepository studentSummaryRepository;
    private final GradeComponentRepository gradeComponentRepository;
    private final StudentComponentGradeRepository studentComponentGradeRepository;
    private final GradeScaleRepository gradeScaleRepository;
    private final CourseSectionRepository courseSectionRepository;
    private final CourseRegistrationRepository courseRegistrationRepository;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final LecturerCourseSectionRepository lecturerCourseSectionRepository;

    @Override
    public List<StudentSummaryResponse> getStudentSummaries(UUID studentId) {
        return studentSummaryRepository.findActiveSummariesByStudentId(studentId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentSummaryResponse> getAllSummaries(UUID departmentId) {
        List<StudentSummary> summaries;
        if (departmentId != null) {
            summaries = studentSummaryRepository.findAllByRegistrationStudentDepartmentId(departmentId);
        } else {
            summaries = studentSummaryRepository.findAll();
        }
        return summaries.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<SectionGradeManagementResponse> getSectionsForLecturer(UUID userId) {
        Employee lecturer = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        
        // Lấy từ cột lecturer_id trong course_sections
        List<CourseSection> sectionsByColumn = courseSectionRepository.findAllByLecturerId(lecturer.getId());
        
        // Lấy từ bảng phụ lecturer_course_sections
        List<LecturerCourseSection> assignments = lecturerCourseSectionRepository.findAllByLecturerId(lecturer.getId());
        List<CourseSection> sectionsByTable = assignments.stream()
                .map(LecturerCourseSection::getCourseSection)
                .toList();

        // Gộp lại và loại bỏ trùng lặp
        Set<CourseSection> allSections = new HashSet<>(sectionsByColumn);
        allSections.addAll(sectionsByTable);

        return allSections.stream()
                .map(this::mapToSectionResponse)
                .sorted(Comparator.comparing(SectionGradeManagementResponse::getClassCode))
                .collect(Collectors.toList());
    }

    @Override
    public List<SectionGradeManagementResponse> getAllSectionsForStaff() {
        return courseSectionRepository.findAll().stream()
                .map(this::mapToSectionResponse)
                .sorted(Comparator.comparing(SectionGradeManagementResponse::getClassCode))
                .collect(Collectors.toList());
    }

    @Override
    public List<SectionGradeManagementResponse> getSectionsByDepartment(UUID departmentId) {
        if (departmentId == null) return getAllSectionsForStaff();
        return courseSectionRepository.findAllByCourseDepartmentId(departmentId).stream()
                .map(this::mapToSectionResponse)
                .sorted(Comparator.comparing(SectionGradeManagementResponse::getClassCode))
                .collect(Collectors.toList());
    }

    @Override
    public List<GradeDetailResponse> getGradeDetailsBySection(UUID sectionId) {
        List<CourseRegistration> registrations = courseRegistrationRepository.findAllByCourseSectionId(sectionId);
        List<GradeComponent> components = gradeComponentRepository.findAllByCourseSectionIdAndIsActiveTrue(sectionId);
        
        return registrations.stream().map(reg -> {
            List<StudentComponentGrade> studentGrades = studentComponentGradeRepository.findAllByRegistrationIdAndIsActiveTrue(reg.getId());
            Map<UUID, BigDecimal> scoreMap = studentGrades.stream()
                    .collect(Collectors.toMap(sg -> sg.getComponent().getId(), StudentComponentGrade::getScore));

            List<GradeDetailResponse.ComponentGradeResponse> componentResponses = components.stream().map(comp -> 
                GradeDetailResponse.ComponentGradeResponse.builder()
                        .componentId(comp.getId())
                        .componentCode(comp.getComponentCode())
                        .componentName(comp.getComponentName())
                        .weightPercentage(comp.getWeightPercentage())
                        .score(scoreMap.get(comp.getId()))
                        .build()
            ).collect(Collectors.toList());

            StudentSummary summary = studentSummaryRepository.findByRegistrationId(reg.getId()).orElse(null);

            return GradeDetailResponse.builder()
                    .registrationId(reg.getId())
                    .studentCode(reg.getStudent().getStudentCode())
                    .studentName(reg.getStudent().getFullName())
                    .componentGrades(componentResponses)
                    .totalScore(summary != null ? summary.getTotalScore() : null)
                    .letterGrade(summary != null ? summary.getLetterGrade() : null)
                    .result(summary != null ? summary.getResult() : null)
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateStudentGrades(UUID registrationId, GradeUpdateRequest request) {
        CourseRegistration registration = courseRegistrationRepository.findById(registrationId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));

        // Kiểm tra khóa điểm
        Optional<StudentSummary> summaryOpt = studentSummaryRepository.findByRegistrationId(registrationId);
        if (summaryOpt.isPresent() && summaryOpt.get().getIsFinalized()) {
            throw new RuntimeException("Điểm đã được chốt, không thể sửa đổi.");
        }

        for (GradeUpdateRequest.ComponentGradeInput input : request.getGrades()) {
            GradeComponent component = gradeComponentRepository.findById(input.getComponentId())
                    .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));

            StudentComponentGrade scg = studentComponentGradeRepository.findByRegistrationIdAndComponentId(registrationId, input.getComponentId())
                    .orElseGet(() -> StudentComponentGrade.builder()
                            .registration(registration)
                            .component(component)
                            .build());
            
            scg.setScore(input.getScore());
            studentComponentGradeRepository.save(scg);
        }

        recalculateSummary(registration);
    }

    private void recalculateSummary(CourseRegistration registration) {
        List<StudentComponentGrade> grades = studentComponentGradeRepository.findAllByRegistrationIdAndIsActiveTrue(registration.getId());
        List<GradeComponent> components = gradeComponentRepository.findAllByCourseSectionIdAndIsActiveTrue(registration.getCourseSection().getId());

        BigDecimal totalScore = BigDecimal.ZERO;
        for (GradeComponent comp : components) {
            BigDecimal score = grades.stream()
                    .filter(g -> g.getComponent().getId().equals(comp.getId()))
                    .map(StudentComponentGrade::getScore)
                    .findFirst()
                    .orElse(BigDecimal.ZERO);
            
            BigDecimal weight = comp.getWeightPercentage().divide(new BigDecimal(100), 4, RoundingMode.HALF_UP);
            totalScore = totalScore.add(score.multiply(weight));
        }

        final BigDecimal finalTotalScore = totalScore.setScale(2, RoundingMode.HALF_UP);
        GradeScale scale = gradeScaleRepository.findByScore(finalTotalScore)
                .orElseThrow(() -> new RuntimeException("No grade scale found for score: " + finalTotalScore));

        StudentSummary summary = studentSummaryRepository.findByRegistrationId(registration.getId())
                .orElseGet(() -> StudentSummary.builder()
                        .registration(registration)
                        .build());

        summary.setTotalScore(finalTotalScore);
        summary.setLetterGrade(scale.getLetterGrade());
        summary.setGpaValue(scale.getGpaValue());
        summary.setResult(scale.getIsPass() ? "PASS" : "FAIL");

        studentSummaryRepository.save(summary);
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
                .isFinalized(summary.getIsFinalized())
                .build();
    }

    private SectionGradeManagementResponse mapToSectionResponse(CourseSection section) {
        long count = courseRegistrationRepository.countByCourseSectionId(section.getId());
        
        return SectionGradeManagementResponse.builder()
                .sectionId(section.getId())
                .classCode(section.getClassCode())
                .courseName(section.getCourse() != null ? section.getCourse().getCourseName() : "Unknown Course")
                .semesterName(section.getSemester() != null ? section.getSemester().getSemesterName() : "Unknown Semester")
                .studentCount((int) count)
                .build();
    }
}
