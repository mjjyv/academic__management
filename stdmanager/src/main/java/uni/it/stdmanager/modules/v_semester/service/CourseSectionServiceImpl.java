package uni.it.stdmanager.modules.v_semester.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.modules.v_semester.dto.response.CourseSectionResponse;
import uni.it.stdmanager.modules.v_semester.entity.CourseSection;
import uni.it.stdmanager.modules.v_semester.repository.CourseSectionRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseSectionServiceImpl implements CourseSectionService {

    private final CourseSectionRepository courseSectionRepository;

    @Override
    public List<CourseSectionResponse> getSectionsBySemester(UUID semesterId) {
        return courseSectionRepository.findAllBySemesterId(semesterId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CourseSectionResponse getSectionById(UUID id) {
        CourseSection section = courseSectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học phần với ID: " + id));
        return mapToResponse(section);
    }

    private CourseSectionResponse mapToResponse(CourseSection section) {
        return CourseSectionResponse.builder()
                .id(section.getId())
                .classCode(section.getClassCode())
                .courseCode(section.getCourse() != null ? section.getCourse().getCourseCode() : null)
                .courseName(section.getCourse() != null ? section.getCourse().getCourseName() : null)
                .semesterName(section.getSemester() != null ? section.getSemester().getSemesterName() : null)
                .lecturerName(section.getLecturer() != null ? section.getLecturer().getFullName() : "Chưa phân công")
                .maxStudents(section.getMaxStudents())
                .currentStudents(0) // Placeholder, logic đếm sinh viên sẽ ở module Registration
                .classType(section.getClassType())
                .status(section.getStatus())
                .registrationStart(section.getRegistrationStart())
                .registrationEnd(section.getRegistrationEnd())
                .build();
    }
}
