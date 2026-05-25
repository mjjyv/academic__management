package uni.it.stdmanager.modules.iv_course.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.modules.iii_lecturer.entity.Department;
import uni.it.stdmanager.modules.iii_lecturer.repository.DepartmentRepository;
import uni.it.stdmanager.modules.iv_course.dto.request.TrainingProgramRequest;
import uni.it.stdmanager.modules.iv_course.dto.response.TrainingProgramResponse;
import uni.it.stdmanager.modules.iv_course.entity.Major;
import uni.it.stdmanager.modules.iv_course.entity.TrainingProgram;
import uni.it.stdmanager.modules.iv_course.entity.TrainingProgramCourse;
import uni.it.stdmanager.modules.iv_course.repository.MajorRepository;
import uni.it.stdmanager.modules.iv_course.repository.TrainingProgramCourseRepository;
import uni.it.stdmanager.modules.iv_course.repository.TrainingProgramRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TrainingProgramServiceImpl implements TrainingProgramService {

    private final TrainingProgramRepository trainingProgramRepository;
    private final MajorRepository majorRepository;
    private final TrainingProgramCourseRepository trainingProgramCourseRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    public List<TrainingProgramResponse> getAllPrograms(UUID majorId) {
        List<TrainingProgram> programs;
        if (majorId != null) {
            programs = trainingProgramRepository.findAllByMajorId(majorId);
        } else {
            programs = trainingProgramRepository.findAll();
        }
        return programs.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TrainingProgramResponse getProgramById(UUID id) {
        TrainingProgram program = trainingProgramRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chương trình đào tạo với ID: " + id));
        return mapToResponse(program);
    }

    @Override
    @Transactional
    public TrainingProgramResponse createProgram(TrainingProgramRequest request) {
        if (trainingProgramRepository.findByProgramCode(request.getProgramCode()).isPresent()) {
            throw new RuntimeException("Mã chương trình đào tạo đã tồn tại: " + request.getProgramCode());
        }

        Major major = majorRepository.findById(request.getMajorId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyên ngành với ID: " + request.getMajorId()));

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa với ID: " + request.getDepartmentId()));
        } else if (major.getDepartment() != null) {
            department = major.getDepartment();
        }

        TrainingProgram program = TrainingProgram.builder()
                .programCode(request.getProgramCode())
                .programName(request.getProgramName())
                .programNameEn(request.getProgramNameEn())
                .major(major)
                .department(department)
                .degreeLevel(request.getDegreeLevel())
                .educationType(request.getEducationType())
                .totalCredits(request.getTotalCredits())
                .requiredCredits(request.getRequiredCredits())
                .electiveCredits(request.getElectiveCredits())
                .internshipCredits(request.getInternshipCredits())
                .thesisCredits(request.getThesisCredits())
                .admissionYear(request.getAdmissionYear())
                .durationYears(request.getDurationYears())
                .maxDurationYears(request.getMaxDurationYears())
                .effectiveDate(request.getEffectiveDate())
                .expiryDate(request.getExpiryDate())
                .description(request.getDescription())
                .objectives(request.getObjectives())
                .learningOutcomes(request.getLearningOutcomes())
                .version(request.getVersion())
                .status(request.getStatus())
                .build();

        return mapToResponse(trainingProgramRepository.save(program));
    }

    @Override
    @Transactional
    public TrainingProgramResponse updateProgram(UUID id, TrainingProgramRequest request) {
        TrainingProgram program = trainingProgramRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chương trình đào tạo với ID: " + id));

        if (!program.getProgramCode().equals(request.getProgramCode()) && 
            trainingProgramRepository.findByProgramCode(request.getProgramCode()).isPresent()) {
            throw new RuntimeException("Mã chương trình đào tạo đã tồn tại: " + request.getProgramCode());
        }

        Major major = majorRepository.findById(request.getMajorId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyên ngành với ID: " + request.getMajorId()));

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa với ID: " + request.getDepartmentId()));
        } else {
            department = major.getDepartment();
        }

        program.setProgramCode(request.getProgramCode());
        program.setProgramName(request.getProgramName());
        program.setProgramNameEn(request.getProgramNameEn());
        program.setMajor(major);
        program.setDepartment(department);
        program.setDegreeLevel(request.getDegreeLevel());
        program.setEducationType(request.getEducationType());
        program.setTotalCredits(request.getTotalCredits());
        program.setRequiredCredits(request.getRequiredCredits());
        program.setElectiveCredits(request.getElectiveCredits());
        program.setInternshipCredits(request.getInternshipCredits());
        program.setThesisCredits(request.getThesisCredits());
        program.setAdmissionYear(request.getAdmissionYear());
        program.setDurationYears(request.getDurationYears());
        program.setMaxDurationYears(request.getMaxDurationYears());
        program.setEffectiveDate(request.getEffectiveDate());
        program.setExpiryDate(request.getExpiryDate());
        program.setDescription(request.getDescription());
        program.setObjectives(request.getObjectives());
        program.setLearningOutcomes(request.getLearningOutcomes());
        program.setVersion(request.getVersion());
        program.setStatus(request.getStatus());

        return mapToResponse(trainingProgramRepository.save(program));
    }

    @Override
    @Transactional
    public void deleteProgram(UUID id) {
        TrainingProgram program = trainingProgramRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy CTĐT"));
        
        // Xóa các môn học liên quan trước (hoặc để Cascade nếu có)
        List<TrainingProgramCourse> courses = trainingProgramCourseRepository.findAllByTrainingProgramId(id);
        trainingProgramCourseRepository.deleteAll(courses);
        
        trainingProgramRepository.delete(program);
    }

    @Override
    @Transactional
    public TrainingProgramResponse duplicateProgram(UUID sourceId, String newCode, String newName) {
        TrainingProgram source = trainingProgramRepository.findById(sourceId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy CTĐT gốc"));

        // 1. Tạo Program mới
        TrainingProgram newProgram = TrainingProgram.builder()
                .programCode(newCode)
                .programName(newName)
                .major(source.getMajor())
                .department(source.getDepartment())
                .totalCredits(source.getTotalCredits())
                .durationYears(source.getDurationYears())
                .effectiveDate(java.time.LocalDate.now())
                .status("ACTIVE")
                .build();
        
        newProgram = trainingProgramRepository.save(newProgram);

        // 2. Sao chép danh sách môn học
        List<TrainingProgramCourse> sourceCourses = trainingProgramCourseRepository.findAllByTrainingProgramId(sourceId);
        for (TrainingProgramCourse sc : sourceCourses) {
            TrainingProgramCourse nc = TrainingProgramCourse.builder()
                    .trainingProgram(newProgram)
                    .course(sc.getCourse())
                    .courseCode(sc.getCourseCode())
                    .courseName(sc.getCourseName())
                    .credits(sc.getCredits())
                    .semester(sc.getSemester())
                    .year(sc.getYear())
                    .isRequired(sc.getIsRequired())
                    .groupCode(sc.getGroupCode())
                    .isElective(sc.getIsElective())
                    .electiveGroupCode(sc.getElectiveGroupCode())
                    .prerequisiteCourse(sc.getPrerequisiteCourse())
                    .isPrerequisiteRequired(sc.getIsPrerequisiteRequired())
                    .note(sc.getNote())
                    .sortOrder(sc.getSortOrder())
                    .status(sc.getStatus())
                    .build();
            trainingProgramCourseRepository.save(nc);
        }

        return mapToResponse(newProgram);
    }

    private TrainingProgramResponse mapToResponse(TrainingProgram program) {
        return TrainingProgramResponse.builder()
                .id(program.getId())
                .programCode(program.getProgramCode())
                .programName(program.getProgramName())
                .majorName(program.getMajor() != null ? program.getMajor().getMajorName() : null)
                .degreeLevel(program.getDegreeLevel())
                .educationType(program.getEducationType())
                .totalCredits(program.getTotalCredits())
                .version(program.getVersion())
                .status(program.getStatus())
                .build();
    }
}
