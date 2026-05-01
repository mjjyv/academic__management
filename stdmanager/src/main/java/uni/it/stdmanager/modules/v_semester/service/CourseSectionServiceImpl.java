package uni.it.stdmanager.modules.v_semester.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.core.exception.ResourceNotFoundException;
import uni.it.stdmanager.modules.v_semester.dto.response.CourseSectionDetailResponse;
import uni.it.stdmanager.modules.v_semester.dto.response.EnrolledStudentResponse;
import uni.it.stdmanager.modules.v_semester.entity.CourseSection;
import uni.it.stdmanager.modules.v_semester.repository.CourseSectionRepository;
import uni.it.stdmanager.modules.vi_registration.repository.CourseRegistrationRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseSectionServiceImpl implements CourseSectionService {

    private final CourseSectionRepository courseSectionRepository;
    private final CourseRegistrationRepository courseRegistrationRepository;

    @Override
    public CourseSectionDetailResponse getSectionDetail(UUID id) {
        CourseSection section = courseSectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học phần với ID: " + id));

        List<EnrolledStudentResponse> enrolledStudents = courseRegistrationRepository.findByCourseSectionId(id).stream()
                .map(reg -> EnrolledStudentResponse.builder()
                        .id(reg.getStudent().getId())
                        .studentCode(reg.getStudent().getStudentCode())
                        .fullName(reg.getStudent().getFullName())
                        .className(reg.getStudent().getStudentClass() != null ? reg.getStudent().getStudentClass().getClassName() : "N/A")
                        .registeredAt(reg.getRegisteredAt())
                        .registrationType(reg.getRegistrationType())
                        .isPaid(reg.getIsPaid())
                        .build())
                .collect(Collectors.toList());

        return CourseSectionDetailResponse.builder()
                .id(section.getId())
                .classCode(section.getClassCode())
                .courseCode(section.getCourse().getCourseCode())
                .courseName(section.getCourse().getCourseName())
                .credits(section.getCourse().getCredits())
                .semesterName(section.getSemester().getSemesterName())
                .lecturerName(section.getLecturer() != null ? section.getLecturer().getFullName() : "Chưa phân công")
                .classType(section.getClassType())
                .status(section.getStatus())
                .maxStudents(section.getMaxStudents())
                .enrolledCount(enrolledStudents.size())
                .students(enrolledStudents)
                .build();
    }
}
