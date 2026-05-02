package uni.it.stdmanager.modules.vi_registration.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.core.exception.AppException;
import uni.it.stdmanager.core.exception.ErrorCode;
import uni.it.stdmanager.modules.ii_student.entity.Student;
import uni.it.stdmanager.modules.ii_student.repository.StudentRepository;
import uni.it.stdmanager.modules.v_semester.entity.CourseSection;
import uni.it.stdmanager.modules.v_semester.repository.CourseSectionRepository;
import uni.it.stdmanager.modules.vi_registration.dto.request.CourseRegistrationRequest;
import uni.it.stdmanager.modules.vi_registration.dto.response.CourseRegistrationResponse;
import uni.it.stdmanager.modules.vi_registration.entity.CourseRegistration;
import uni.it.stdmanager.modules.vi_registration.entity.RegistrationPeriod;
import uni.it.stdmanager.modules.vi_registration.repository.CourseRegistrationRepository;
import uni.it.stdmanager.modules.vi_registration.repository.RegistrationPeriodRepository;
import uni.it.stdmanager.modules.vi_registration.service.CourseRegistrationService;
import uni.it.stdmanager.modules.iv_course.dto.response.CourseResponse;
import uni.it.stdmanager.modules.iv_course.entity.Course;
import uni.it.stdmanager.modules.iv_course.repository.CourseRepository;
import uni.it.stdmanager.modules.viii_grade.dto.response.StudentSummaryResponse;
import uni.it.stdmanager.modules.viii_grade.service.GradeService;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseRegistrationServiceImpl implements CourseRegistrationService {

    private final CourseRegistrationRepository courseRegistrationRepository;
    private final RegistrationPeriodRepository registrationPeriodRepository;
    private final StudentRepository studentRepository;
    private final CourseSectionRepository courseSectionRepository;
    private final GradeService gradeService;
    private final CourseRepository courseRepository;

    @Override
    @Transactional
    public CourseRegistrationResponse register(CourseRegistrationRequest request) {
        // 1. Kiểm tra đợt đăng ký
        RegistrationPeriod period = registrationPeriodRepository.findById(request.getRegistrationPeriodId())
                .orElseThrow(() -> new AppException(ErrorCode.REGISTRATION_PERIOD_NOT_FOUND));

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(period.getStartTime()) || now.isAfter(period.getEndTime())) {
            throw new AppException(ErrorCode.REGISTRATION_PERIOD_CLOSED);
        }

        // 2. Kiểm tra sinh viên
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_FOUND));

        // 3. Kiểm tra lớp học phần
        CourseSection section = courseSectionRepository.findById(request.getCourseSectionId())
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_SECTION_NOT_FOUND));

        // 4. Kiểm tra sĩ số
        long currentEnrolled = courseRegistrationRepository.countByCourseSectionIdAndStatus(section.getId(), 1); // Status 1: Success
        if (section.getMaxStudents() != null && currentEnrolled >= section.getMaxStudents()) {
            throw new AppException(ErrorCode.COURSE_SECTION_FULL);
        }

        // 5. Kiểm tra đăng ký trùng (nếu đã đăng ký thành công lớp này rồi)
        if (courseRegistrationRepository.existsByStudentIdAndCourseSectionIdAndStatusIn(
                student.getId(), section.getId(), Arrays.asList(1, 2))) { // 1: Success, 2: Pending payment
            throw new RuntimeException("Bạn đã đăng ký lớp học phần này rồi");
        }

        // 6. Kiểm tra giới hạn tín chỉ
        List<CourseRegistration> currentRegistrations = courseRegistrationRepository
                .findAllByStudentIdAndCourseSectionSemesterId(student.getId(), section.getSemester().getId());
        
        double totalCredits = currentRegistrations.stream()
                .filter(r -> r.getStatus() == 1 || r.getStatus() == 2)
                .mapToDouble(r -> r.getCourseSection().getCourse().getCredits().doubleValue())
                .sum();
        
        double newCourseCredits = section.getCourse().getCredits().doubleValue();
        if (period.getMaxCredits() != null && (totalCredits + newCourseCredits) > period.getMaxCredits()) {
            throw new AppException(ErrorCode.CREDIT_LIMIT_EXCEEDED);
        }

        // 7. Lưu đăng ký
        CourseRegistration registration = CourseRegistration.builder()
                .student(student)
                .courseSection(section)
                .registrationPeriod(period)
                .registrationType(request.getRegistrationType())
                .replacedGradeId(request.getReplacedGradeId())
                .registeredAt(now)
                .status(1) // Mặc định thành công cho demo
                .isPaid(false)
                .build();

        return mapToResponse(courseRegistrationRepository.save(registration));
    }

    @Override
    @Transactional
    public void cancel(UUID id) {
        CourseRegistration registration = courseRegistrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin đăng ký"));
        
        // Kiểm tra xem đợt đăng ký còn mở không
        LocalDateTime now = LocalDateTime.now();
        if (now.isAfter(registration.getRegistrationPeriod().getEndTime())) {
            throw new RuntimeException("Hết thời gian đăng ký, không thể hủy");
        }

        registration.setStatus(3); // 3: Đã hủy
        registration.setIsActive(false);
        courseRegistrationRepository.save(registration);
    }

    @Override
    public List<CourseRegistrationResponse> getByStudent(UUID studentId) {
        return courseRegistrationRepository.findAllByStudentId(studentId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CourseRegistrationResponse> getBySection(UUID sectionId) {
        return courseRegistrationRepository.findAllByCourseSectionId(sectionId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CourseResponse> getRetakeableCourses(UUID studentId) {
        // 1. Lấy danh sách điểm tổng kết của sinh viên
        List<StudentSummaryResponse> summaries = gradeService.getStudentSummaries(studentId);

        // 2. Lọc các môn có điểm thấp (ví dụ GPA < 2.0 hoặc điểm chữ D/F)
        // Ở đây giả định result là "FAIL" hoặc điểm tích lũy thấp
        List<UUID> retakeableCourseIds = summaries.stream()
                .filter(s -> "FAIL".equals(s.getResult()) || s.getGpaValue() < 2.0)
                .map(StudentSummaryResponse::getCourseId)
                .distinct()
                .collect(Collectors.toList());

        // 3. Lấy thông tin chi tiết môn học
        return courseRepository.findAllById(retakeableCourseIds).stream()
                .map(this::mapToCourseResponse)
                .collect(Collectors.toList());
    }

    private CourseResponse mapToCourseResponse(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .courseCode(course.getCourseCode())
                .courseName(course.getCourseName())
                .credits(course.getCredits())
                .build();
    }

    private CourseRegistrationResponse mapToResponse(CourseRegistration registration) {
        return CourseRegistrationResponse.builder()
                .id(registration.getId())
                .studentId(registration.getStudent().getId())
                .studentName(registration.getStudent().getFullName())
                .courseSectionId(registration.getCourseSection().getId())
                .courseSectionCode(registration.getCourseSection().getClassCode())
                .courseName(registration.getCourseSection().getCourse().getCourseName())
                .registrationPeriodId(registration.getRegistrationPeriod().getId())
                .registrationType(registration.getRegistrationType())
                .registeredAt(registration.getRegisteredAt())
                .status(registration.getStatus())
                .isPaid(registration.getIsPaid())
                .build();
    }
}
