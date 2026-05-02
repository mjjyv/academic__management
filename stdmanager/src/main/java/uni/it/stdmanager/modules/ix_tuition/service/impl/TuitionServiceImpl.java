package uni.it.stdmanager.modules.ix_tuition.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.modules.ii_student.entity.Student;
import uni.it.stdmanager.modules.ii_student.repository.StudentRepository;
import uni.it.stdmanager.modules.ix_tuition.entity.TuitionFee;
import uni.it.stdmanager.modules.ix_tuition.repository.TuitionFeeRepository;
import uni.it.stdmanager.modules.ix_tuition.service.TuitionService;
import uni.it.stdmanager.modules.vi_registration.entity.CourseRegistration;
import uni.it.stdmanager.modules.vi_registration.repository.CourseRegistrationRepository;
import uni.it.stdmanager.modules.ix_tuition.dto.response.StudentTuitionResponse;
import uni.it.stdmanager.modules.ix_tuition.entity.StudentTuition;
import uni.it.stdmanager.modules.ix_tuition.repository.StudentTuitionRepository;
import java.util.stream.Collectors;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TuitionServiceImpl implements TuitionService {

    private final TuitionFeeRepository tuitionFeeRepository;
    private final CourseRegistrationRepository courseRegistrationRepository;
    private final StudentRepository studentRepository;
    private final StudentTuitionRepository studentTuitionRepository;

    @Override
    public BigDecimal calculateTuition(UUID studentId, UUID semesterId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));

        // Lấy khóa học của sinh viên (Ví dụ: K23, K24) để lấy đơn giá phù hợp
        String courseYear = student.getAdmissionYear() != null ? "K" + student.getAdmissionYear() : "K24";

        // Lấy các đăng ký trong học kỳ
        List<CourseRegistration> registrations = courseRegistrationRepository
                .findAllByStudentIdAndCourseSectionSemesterId(studentId, semesterId);

        BigDecimal totalAmount = BigDecimal.ZERO;

        // Lấy đơn giá chuẩn
        TuitionFee newFee = tuitionFeeRepository.findFirstByCourseYearAndFeeTypeAndIsActiveTrueOrderByEffectiveDateDesc(courseYear, "NEW")
                .orElseThrow(() -> new RuntimeException("Chưa cấu hình đơn giá học phí cho " + courseYear));
        
        TuitionFee retakeFee = tuitionFeeRepository.findFirstByCourseYearAndFeeTypeAndIsActiveTrueOrderByEffectiveDateDesc(courseYear, "RETAKE")
                .orElse(newFee); // Nếu không có giá học lại, dùng giá mặc định

        for (CourseRegistration reg : registrations) {
            if (reg.getStatus() == 3) continue; // Bỏ qua nếu đã hủy

            BigDecimal credits = reg.getCourseSection().getCourse().getCredits();
            BigDecimal pricePerCredit = (reg.getRegistrationType() == 1) 
                    ? newFee.getPricePerCredit() 
                    : retakeFee.getPricePerCredit();

            totalAmount = totalAmount.add(credits.multiply(pricePerCredit));
        }

        return totalAmount;
    }

    @Override
    public List<StudentTuitionResponse> getStudentTuitions(UUID studentId) {
        return studentTuitionRepository.findAllByStudentId(studentId).stream()
                .map(this::mapToTuitionResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentTuitionResponse> getAllTuitions() {
        return studentTuitionRepository.findAll().stream()
                .map(this::mapToTuitionResponse)
                .collect(Collectors.toList());
    }

    private StudentTuitionResponse mapToTuitionResponse(StudentTuition tuition) {
        return StudentTuitionResponse.builder()
                .id(tuition.getId())
                .studentId(tuition.getStudent().getId())
                .studentCode(tuition.getStudent().getStudentCode())
                .studentName(tuition.getStudent().getFullName())
                .semesterId(tuition.getSemester().getId())
                .semesterName(tuition.getSemester().getSemesterName())
                .totalCredits(tuition.getTotalCredits())
                .rawAmount(tuition.getRawAmount())
                .scholarshipDeduction(tuition.getScholarshipDeduction())
                .exemptionAmount(tuition.getExemptionAmount())
                .netAmount(tuition.getNetAmount())
                .paidAmount(tuition.getPaidAmount())
                .debtAmount(tuition.getDebtAmount())
                .status(tuition.getStatus())
                .deadline(tuition.getDeadline())
                .build();
    }
}
