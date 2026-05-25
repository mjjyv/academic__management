package uni.it.stdmanager.modules.ii_student.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Pageable;
import uni.it.stdmanager.modules.ii_student.dto.request.StudentClassRequest;
import uni.it.stdmanager.modules.ii_student.dto.response.*;
import uni.it.stdmanager.modules.ii_student.entity.Student;
import uni.it.stdmanager.modules.ii_student.entity.StudentClass;
import uni.it.stdmanager.modules.ii_student.repository.StudentClassRepository;
import uni.it.stdmanager.modules.ii_student.repository.StudentRepository;
import uni.it.stdmanager.modules.iii_lecturer.entity.Department;
import uni.it.stdmanager.modules.iii_lecturer.entity.Employee;
import uni.it.stdmanager.modules.iii_lecturer.repository.DepartmentRepository;
import uni.it.stdmanager.modules.iii_lecturer.repository.EmployeeRepository;
import uni.it.stdmanager.modules.iv_course.entity.Major;
import uni.it.stdmanager.modules.iv_course.entity.TrainingProgram;
import uni.it.stdmanager.modules.iv_course.repository.MajorRepository;
import uni.it.stdmanager.modules.iv_course.repository.TrainingProgramRepository;
import uni.it.stdmanager.modules.iv_course.repository.TrainingProgramCourseRepository;
import uni.it.stdmanager.modules.vi_registration.entity.CourseRegistration;
import uni.it.stdmanager.modules.vi_registration.repository.CourseRegistrationRepository;
import uni.it.stdmanager.modules.v_semester.entity.CourseSection;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudentClassServiceImpl implements StudentClassService {

    private final StudentClassRepository studentClassRepository;
    private final StudentRepository studentRepository;
    private final CourseRegistrationRepository courseRegistrationRepository;
    private final TrainingProgramCourseRepository trainingProgramCourseRepository;
    private final MajorRepository majorRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final TrainingProgramRepository trainingProgramRepository;

    @Override
    public List<StudentClassResponse> getAllClasses() {
        return studentClassRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<DepartmentHierarchyResponse> getClassHierarchy() {
        List<StudentClass> allClasses = studentClassRepository.findAll();

        // Nhóm theo Department
        Map<Department, Map<Major, List<StudentClass>>> hierarchy = allClasses.stream()
                .filter(c -> c.getDepartment() != null && c.getMajor() != null)
                .collect(Collectors.groupingBy(
                        StudentClass::getDepartment,
                        Collectors.groupingBy(StudentClass::getMajor)
                ));

        return hierarchy.entrySet().stream()
                .map(deptEntry -> {
                    Department dept = deptEntry.getKey();
                    Map<Major, List<StudentClass>> majorMap = deptEntry.getValue();

                    List<MajorHierarchyResponse> majors = majorMap.entrySet().stream()
                            .map(majorEntry -> {
                                Major major = majorEntry.getKey();
                                List<StudentClass> classes = majorEntry.getValue();

                                return MajorHierarchyResponse.builder()
                                        .id(major.getId())
                                        .majorName(major.getMajorName())
                                        .majorCode(major.getMajorCode())
                                        .classes(classes.stream()
                                                .map(this::mapToResponse)
                                                .collect(Collectors.toList()))
                                        .build();
                            })
                            .collect(Collectors.toList());

                    return DepartmentHierarchyResponse.builder()
                            .id(dept.getId())
                            .departmentName(dept.getDepartmentName())
                            .departmentCode(dept.getCode())
                            .majors(majors)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    public StudentClassDetailResponse getClassDetail(UUID id) {
        StudentClass studentClass = studentClassRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));

        List<Student> students = studentRepository.searchStudents(null, id, null, Pageable.unpaged()).getContent();

        return StudentClassDetailResponse.builder()
                .id(studentClass.getId())
                .classCode(studentClass.getClassCode())
                .className(studentClass.getClassName())
                .courseYear(studentClass.getCourseYear())
                .majorName(studentClass.getMajor() != null ? studentClass.getMajor().getMajorName() : null)
                .departmentName(studentClass.getDepartment() != null ? studentClass.getDepartment().getDepartmentName() : null)
                .advisorName(studentClass.getAdvisor() != null ? studentClass.getAdvisor().getFullName() : "Chưa có")
                .students(students.stream().map(this::mapToStudentResponse).collect(Collectors.toList()))
                .build();
    }

    @Override
    public List<ClassCourseHistoryResponse> getClassCourseHistory(UUID classId) {
        List<Student> students = studentRepository.findByStudentClassId(classId);
        if (students.isEmpty()) return Collections.emptyList();

        List<UUID> studentIds = students.stream().map(Student::getId).collect(Collectors.toList());
        
        // Lấy tất cả đăng ký của các sinh viên trong lớp này
        List<CourseRegistration> registrations = courseRegistrationRepository.findAllByStudentIdIn(studentIds);
        
        // Nhóm các đăng ký theo Lớp học phần (CourseSection)
        Map<CourseSection, List<CourseRegistration>> registrationsBySection = registrations.stream()
                .collect(Collectors.groupingBy(CourseRegistration::getCourseSection));

        // Lấy chương trình đào tạo của lớp (lấy từ sinh viên đầu tiên)
        TrainingProgram program = students.get(0).getProgram();
        List<UUID> requiredCourseIds = Collections.emptyList();
        if (program != null) {
            requiredCourseIds = trainingProgramCourseRepository.findAllByTrainingProgramIdAndIsRequiredTrue(program.getId())
                    .stream()
                    .map(tpc -> tpc.getCourse().getId())
                    .collect(Collectors.toList());
        }
        final List<UUID> finalRequiredCourseIds = requiredCourseIds;

        return registrationsBySection.entrySet().stream()
                .filter(entry -> {
                    CourseSection section = entry.getKey();
                    List<CourseRegistration> sectionRegs = entry.getValue();
                    // Lọc: môn học phải nằm trong danh sách bắt buộc, HOẶC số lượng SV đăng ký >= 30% sĩ số lớp
                    boolean isRequired = finalRequiredCourseIds.contains(section.getCourse().getId());
                    boolean isMajority = sectionRegs.size() >= (students.size() * 0.3);
                    return isRequired || isMajority;
                })
                .map(entry -> {
                    CourseSection section = entry.getKey();
                    List<CourseRegistration> sectionRegs = entry.getValue();
                    
                    return ClassCourseHistoryResponse.builder()
                            .sectionId(section.getId())
                            .semesterName(section.getSemester().getSemesterName())
                            .courseCode(section.getCourse().getCourseCode())
                            .courseName(section.getCourse().getCourseName())
                            .classCode(section.getClassCode())
                            .lecturerName(section.getLecturer() != null ? section.getLecturer().getFullName() : "Chưa phân công")
                            .studentCount(sectionRegs.size()) // Số lượng SV của lớp hành chính này tham gia lớp học phần này
                            .status(section.getStatus())
                            .build();
                })
                .sorted(Comparator.comparing(ClassCourseHistoryResponse::getSemesterName).reversed())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public StudentClassResponse createClass(StudentClassRequest request) {
        if (studentClassRepository.findByClassCode(request.getClassCode()).isPresent()) {
            throw new RuntimeException("Mã lớp đã tồn tại: " + request.getClassCode());
        }

        Major major = majorRepository.findById(request.getMajorId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyên ngành"));

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa"));
        } else {
            department = major.getDepartment();
        }

        Employee advisor = null;
        if (request.getAdvisorId() != null) {
            advisor = employeeRepository.findById(request.getAdvisorId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy cố vấn học tập"));
        }

        StudentClass studentClass = StudentClass.builder()
                .classCode(request.getClassCode())
                .className(request.getClassName())
                .courseYear(request.getCourseYear())
                .major(major)
                .department(department)
                .advisor(advisor)
                .build();

        return mapToResponse(studentClassRepository.save(studentClass));
    }

    @Override
    @Transactional
    public StudentClassResponse updateClass(UUID id, StudentClassRequest request) {
        StudentClass studentClass = studentClassRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));

        if (!studentClass.getClassCode().equals(request.getClassCode()) &&
            studentClassRepository.findByClassCode(request.getClassCode()).isPresent()) {
            throw new RuntimeException("Mã lớp đã tồn tại");
        }

        Major major = majorRepository.findById(request.getMajorId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyên ngành"));

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa"));
        } else {
            department = major.getDepartment();
        }

        Employee advisor = null;
        if (request.getAdvisorId() != null) {
            advisor = employeeRepository.findById(request.getAdvisorId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy cố vấn học tập"));
        }

        studentClass.setClassCode(request.getClassCode());
        studentClass.setClassName(request.getClassName());
        studentClass.setCourseYear(request.getCourseYear());
        studentClass.setMajor(major);
        studentClass.setDepartment(department);
        studentClass.setAdvisor(advisor);

        return mapToResponse(studentClassRepository.save(studentClass));
    }

    @Override
    @Transactional
    public void deleteClass(UUID id) {
        StudentClass studentClass = studentClassRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));
        studentClassRepository.delete(studentClass);
    }

    @Override
    @Transactional
    public void assignProgramToClass(UUID classId, UUID programId) {
        StudentClass studentClass = studentClassRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));
        
        TrainingProgram program = trainingProgramRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chương trình đào tạo"));

        // Cập nhật tất cả sinh viên trong lớp
        List<Student> students = studentRepository.findByStudentClassId(classId);
        for (Student student : students) {
            student.setProgram(program);
            // Có thể cập nhật luôn Major/Dept của SV khớp với Program nếu cần
            student.setMajor(program.getMajor());
            student.setDepartment(program.getDepartment());
        }
        studentRepository.saveAll(students);
    }

    private StudentClassResponse mapToResponse(StudentClass studentClass) {
        return StudentClassResponse.builder()
                .id(studentClass.getId())
                .classCode(studentClass.getClassCode())
                .className(studentClass.getClassName())
                .courseYear(studentClass.getCourseYear())
                .majorName(studentClass.getMajor() != null ? studentClass.getMajor().getMajorName() : null)
                .build();
    }

    private StudentResponse mapToStudentResponse(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .studentCode(student.getStudentCode())
                .fullName(student.getFullName())
                .dateOfBirth(student.getDateOfBirth())
                .gender(student.getGender())
                .email(student.getUser().getEmail())
                .phone(student.getUser().getPhone())
                .personalIdentificationNumber(student.getPersonalIdentificationNumber())
                .dateOfIssue(student.getDateOfIssue())
                .cardPlace(student.getCardPlace())
                .address(student.getAddress())
                .currentAddress(student.getCurrentAddress())
                .classId(student.getStudentClass() != null ? student.getStudentClass().getId() : null)
                .className(student.getStudentClass() != null ? student.getStudentClass().getClassName() : null)
                .majorId(student.getMajor() != null ? student.getMajor().getId() : null)
                .majorName(student.getMajor() != null ? student.getMajor().getMajorName() : null)
                .departmentId(student.getDepartment() != null ? student.getDepartment().getId() : null)
                .departmentName(student.getDepartment() != null ? student.getDepartment().getDepartmentName() : null)
                .statusName(student.getCurrentStatus() != null ? student.getCurrentStatus().getStatusName() : null)
                .statusCode(student.getCurrentStatus() != null ? student.getCurrentStatus().getStatusCode() : null)
                .admissionYear(student.getAdmissionYear())
                .build();
    }
}