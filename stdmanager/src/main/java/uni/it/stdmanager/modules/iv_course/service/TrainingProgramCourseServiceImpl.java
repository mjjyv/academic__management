package uni.it.stdmanager.modules.iv_course.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.modules.iv_course.dto.request.TrainingProgramCourseRequest;
import uni.it.stdmanager.modules.iv_course.dto.response.TrainingProgramCourseResponse;
import uni.it.stdmanager.modules.iv_course.entity.Course;
import uni.it.stdmanager.modules.iv_course.entity.TrainingProgram;
import uni.it.stdmanager.modules.iv_course.entity.TrainingProgramCourse;
import uni.it.stdmanager.modules.iv_course.repository.CourseRepository;
import uni.it.stdmanager.modules.iv_course.repository.TrainingProgramCourseRepository;
import uni.it.stdmanager.modules.iv_course.repository.TrainingProgramRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TrainingProgramCourseServiceImpl implements TrainingProgramCourseService {

    private final TrainingProgramCourseRepository trainingProgramCourseRepository;
    private final TrainingProgramRepository trainingProgramRepository;
    private final CourseRepository courseRepository;

    @Override
    public List<TrainingProgramCourseResponse> getCoursesByProgram(UUID trainingProgramId) {
        return trainingProgramCourseRepository.findAllByTrainingProgramId(trainingProgramId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TrainingProgramCourseResponse addCourseToProgram(TrainingProgramCourseRequest request) {
        TrainingProgram program = trainingProgramRepository.findById(request.getTrainingProgramId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chương trình đào tạo với ID: " + request.getTrainingProgramId()));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy môn học với ID: " + request.getCourseId()));

        Course prerequisite = null;
        if (request.getPrerequisiteCourseId() != null) {
            prerequisite = courseRepository.findById(request.getPrerequisiteCourseId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy môn học tiên quyết với ID: " + request.getPrerequisiteCourseId()));
        }

        TrainingProgramCourse tpc = TrainingProgramCourse.builder()
                .trainingProgram(program)
                .course(course)
                .courseCode(course.getCourseCode()) // Sync from Course
                .courseName(course.getCourseName()) // Sync from Course
                .credits(course.getCredits())       // Sync from Course
                .semester(request.getSemester())
                .year(request.getYear())
                .isRequired(request.getIsRequired())
                .groupCode(request.getGroupCode())
                .isElective(request.getIsElective())
                .electiveGroupCode(request.getElectiveGroupCode())
                .prerequisiteCourse(prerequisite)
                .isPrerequisiteRequired(request.getIsPrerequisiteRequired())
                .note(request.getNote())
                .sortOrder(request.getSortOrder())
                .status(request.getStatus())
                .build();

        return mapToResponse(trainingProgramCourseRepository.save(tpc));
    }

    @Override
    @Transactional
    public TrainingProgramCourseResponse updateProgramCourse(UUID id, TrainingProgramCourseRequest request) {
        TrainingProgramCourse tpc = trainingProgramCourseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bản ghi môn học trong chương trình với ID: " + id));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy môn học với ID: " + request.getCourseId()));

        Course prerequisite = null;
        if (request.getPrerequisiteCourseId() != null) {
            prerequisite = courseRepository.findById(request.getPrerequisiteCourseId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy môn học tiên quyết với ID: " + request.getPrerequisiteCourseId()));
        }

        tpc.setCourse(course);
        tpc.setCourseCode(course.getCourseCode());
        tpc.setCourseName(course.getCourseName());
        tpc.setCredits(course.getCredits());
        tpc.setSemester(request.getSemester());
        tpc.setYear(request.getYear());
        tpc.setIsRequired(request.getIsRequired());
        tpc.setGroupCode(request.getGroupCode());
        tpc.setIsElective(request.getIsElective());
        tpc.setElectiveGroupCode(request.getElectiveGroupCode());
        tpc.setPrerequisiteCourse(prerequisite);
        tpc.setIsPrerequisiteRequired(request.getIsPrerequisiteRequired());
        tpc.setNote(request.getNote());
        tpc.setSortOrder(request.getSortOrder());
        tpc.setStatus(request.getStatus());

        return mapToResponse(trainingProgramCourseRepository.save(tpc));
    }

    @Override
    @Transactional
    public void removeCourseFromProgram(UUID id) {
        TrainingProgramCourse tpc = trainingProgramCourseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bản ghi môn học trong chương trình với ID: " + id));
        trainingProgramCourseRepository.delete(tpc);
    }

    private TrainingProgramCourseResponse mapToResponse(TrainingProgramCourse tpc) {
        return TrainingProgramCourseResponse.builder()
                .id(tpc.getId())
                .courseId(tpc.getCourse() != null ? tpc.getCourse().getId() : null)
                .courseCode(tpc.getCourseCode())
                .courseName(tpc.getCourseName())
                .credits(tpc.getCredits())
                .semester(tpc.getSemester())
                .year(tpc.getYear())
                .isRequired(tpc.getIsRequired())
                .groupCode(tpc.getGroupCode())
                .isElective(tpc.getIsElective())
                .electiveGroupCode(tpc.getElectiveGroupCode())
                .prerequisiteCourseName(tpc.getPrerequisiteCourse() != null ? tpc.getPrerequisiteCourse().getCourseName() : null)
                .note(tpc.getNote())
                .sortOrder(tpc.getSortOrder())
                .status(tpc.getStatus())
                .build();
    }
}
