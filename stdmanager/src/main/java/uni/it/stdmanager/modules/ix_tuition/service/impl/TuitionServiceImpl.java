package uni.it.stdmanager.modules.ix_tuition.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.core.security.SecurityUtils;
import uni.it.stdmanager.modules.ii_student.entity.Student;
import uni.it.stdmanager.modules.ii_student.repository.StudentRepository;
import uni.it.stdmanager.modules.ix_tuition.dto.request.PaymentRequest;
import uni.it.stdmanager.modules.ix_tuition.dto.response.PaymentResponse;
import uni.it.stdmanager.modules.ix_tuition.dto.response.StudentTuitionResponse;
import uni.it.stdmanager.modules.ix_tuition.dto.response.TuitionSummaryResponse;
import uni.it.stdmanager.modules.ix_tuition.entity.StudentTuition;
import uni.it.stdmanager.modules.ix_tuition.entity.TuitionFee;
import uni.it.stdmanager.modules.ix_tuition.entity.TuitionPayment;
import uni.it.stdmanager.modules.ix_tuition.repository.StudentTuitionRepository;
import uni.it.stdmanager.modules.ix_tuition.repository.TuitionFeeRepository;
import uni.it.stdmanager.modules.ix_tuition.repository.TuitionPaymentRepository;
import uni.it.stdmanager.modules.ix_tuition.service.TuitionService;
import uni.it.stdmanager.modules.v_semester.entity.Semester;
import uni.it.stdmanager.modules.v_semester.repository.SemesterRepository;
import uni.it.stdmanager.modules.vi_registration.entity.CourseRegistration;
import uni.it.stdmanager.modules.vi_registration.repository.CourseRegistrationRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TuitionServiceImpl implements TuitionService {

    private final TuitionFeeRepository tuitionFeeRepository;
    private final CourseRegistrationRepository courseRegistrationRepository;
    private final StudentRepository studentRepository;
    private final StudentTuitionRepository studentTuitionRepository;
    private final SemesterRepository semesterRepository;
    private final TuitionPaymentRepository tuitionPaymentRepository;

    @Override
    @Transactional
    public StudentTuitionResponse calculateTuition(UUID studentId, UUID semesterId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));

        Semester semester = semesterRepository.findById(semesterId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học kỳ"));

        // Lấy khóa học của sinh viên (Ví dụ: K23, K24) để lấy đơn giá phù hợp
        String courseYear = student.getAdmissionYear() != null ? "K" + student.getAdmissionYear() : "K24";

        // Lấy các đăng ký trong học kỳ
        List<CourseRegistration> registrations = courseRegistrationRepository
                .findAllByStudentIdAndCourseSectionSemesterId(studentId, semesterId);

        BigDecimal rawAmount = BigDecimal.ZERO;
        int totalCredits = 0;
        List<StudentTuitionResponse.TuitionDetailItem> detailItems = new java.util.ArrayList<>();

        // Lấy đơn giá chuẩn
        TuitionFee newFee = tuitionFeeRepository.findFirstByCourseYearAndFeeTypeAndIsActiveTrueOrderByEffectiveDateDesc(courseYear, "NEW")
                .orElseThrow(() -> new RuntimeException("Chưa cấu hình đơn giá học phí cho " + courseYear));
        
        TuitionFee retakeFee = tuitionFeeRepository.findFirstByCourseYearAndFeeTypeAndIsActiveTrueOrderByEffectiveDateDesc(courseYear, "RETAKE")
                .orElse(newFee); // Nếu không có giá học lại, dùng giá mặc định

        for (CourseRegistration reg : registrations) {
            if (reg.getStatus() == 3) continue; // Bỏ qua nếu đã hủy

            BigDecimal credits = reg.getCourseSection().getCourse().getCredits();
            totalCredits += credits.intValue();

            BigDecimal pricePerCredit = (reg.getRegistrationType() == 1) 
                    ? newFee.getPricePerCredit() 
                    : retakeFee.getPricePerCredit();

            BigDecimal itemAmount = credits.multiply(pricePerCredit);
            rawAmount = rawAmount.add(itemAmount);

            detailItems.add(StudentTuitionResponse.TuitionDetailItem.builder()
                    .courseName(reg.getCourseSection().getCourse().getCourseName())
                    .courseCode(reg.getCourseSection().getCourse().getCourseCode())
                    .credits(credits)
                    .registrationType(reg.getRegistrationType())
                    .amount(itemAmount)
                    .build());
        }

        // Fetch or create StudentTuition
        StudentTuition studentTuition = studentTuitionRepository.findAllByStudentId(studentId).stream()
                .filter(t -> t.getSemester().getId().equals(semesterId))
                .findFirst()
                .orElseGet(() -> {
                    StudentTuition newTuition = StudentTuition.builder()
                            .student(student)
                            .semester(semester)
                            .scholarshipDeduction(BigDecimal.ZERO)
                            .exemptionAmount(BigDecimal.ZERO)
                            .paidAmount(BigDecimal.ZERO)
                            .build();
                    return newTuition;
                });

        studentTuition.setTotalCredits(totalCredits);
        studentTuition.setRawAmount(rawAmount);

        // Calculate net amount
        BigDecimal netAmount = rawAmount
                .subtract(studentTuition.getScholarshipDeduction() != null ? studentTuition.getScholarshipDeduction() : BigDecimal.ZERO)
                .subtract(studentTuition.getExemptionAmount() != null ? studentTuition.getExemptionAmount() : BigDecimal.ZERO);
        
        if (netAmount.compareTo(BigDecimal.ZERO) < 0) {
            netAmount = BigDecimal.ZERO;
        }
        studentTuition.setNetAmount(netAmount);

        // Calculate debt
        BigDecimal paidAmount = studentTuition.getPaidAmount() != null ? studentTuition.getPaidAmount() : BigDecimal.ZERO;
        BigDecimal debtAmount = netAmount.subtract(paidAmount);
        if (debtAmount.compareTo(BigDecimal.ZERO) < 0) {
            debtAmount = BigDecimal.ZERO;
        }
        studentTuition.setDebtAmount(debtAmount);

        // Update status
        if (debtAmount.compareTo(BigDecimal.ZERO) <= 0 && netAmount.compareTo(BigDecimal.ZERO) > 0) {
            studentTuition.setStatus(1); // PAID
        } else if (paidAmount.compareTo(BigDecimal.ZERO) > 0) {
            studentTuition.setStatus(2); // PARTIAL
        } else {
            studentTuition.setStatus(3); // DEBT
        }

        // Set deadline
        LocalDate deadline = semester.getEndDate();
        if (deadline == null) {
            deadline = LocalDate.now().plusMonths(1);
        }
        studentTuition.setDeadline(deadline);

        studentTuition = studentTuitionRepository.save(studentTuition);

        StudentTuitionResponse response = mapToTuitionResponse(studentTuition);
        response.setDetails(detailItems);
        return response;
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

    @Override
    @Transactional
    public StudentTuitionResponse getCurrentSemesterTuitionForCurrentStudent() {
        String studentCode = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new RuntimeException("Người dùng chưa đăng nhập"));

        Student student = studentRepository.findByStudentCode(studentCode)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ sinh viên cho mã: " + studentCode));

        Semester currentSemester = semesterRepository.findAll().stream()
                .filter(s -> s.getIsActive() != null && s.getIsActive())
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Không có học kỳ nào đang hoạt động"));

        return calculateTuition(student.getId(), currentSemester.getId());
    }

    @Override
    public TuitionSummaryResponse getDebtSummaryForCurrentStudent() {
        String studentCode = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new RuntimeException("Người dùng chưa đăng nhập"));

        Student student = studentRepository.findByStudentCode(studentCode)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ sinh viên cho mã: " + studentCode));

        List<StudentTuition> tuitions = studentTuitionRepository.findAllByStudentId(student.getId());

        BigDecimal totalDebt = tuitions.stream()
                .map(t -> t.getDebtAmount() != null ? t.getDebtAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPaid = tuitions.stream()
                .map(t -> t.getPaidAmount() != null ? t.getPaidAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return TuitionSummaryResponse.builder()
                .totalDebt(totalDebt)
                .totalPaid(totalPaid)
                .semesterTuitions(tuitions.stream().map(this::mapToTuitionResponse).collect(Collectors.toList()))
                .build();
    }

    @Override
    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {
        StudentTuition tuition = studentTuitionRepository.findById(request.getStudentTuitionId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin học phí"));

        TuitionPayment payment = TuitionPayment.builder()
                .studentTuition(tuition)
                .amountPaid(request.getAmountPaid())
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus("SUCCESS") // Giả định thanh toán thành công
                .transactionRef(request.getTransactionRef())
                .notes(request.getNotes())
                .build();

        tuitionPaymentRepository.save(payment);

        // Update tuition paid amount and debt
        BigDecimal currentPaid = tuition.getPaidAmount() != null ? tuition.getPaidAmount() : BigDecimal.ZERO;
        tuition.setPaidAmount(currentPaid.add(request.getAmountPaid()));
        
        BigDecimal netAmount = tuition.getNetAmount() != null ? tuition.getNetAmount() : BigDecimal.ZERO;
        BigDecimal newDebt = netAmount.subtract(tuition.getPaidAmount());
        if (newDebt.compareTo(BigDecimal.ZERO) < 0) newDebt = BigDecimal.ZERO;
        tuition.setDebtAmount(newDebt);

        // Update status
        if (tuition.getDebtAmount().compareTo(BigDecimal.ZERO) <= 0) {
            tuition.setStatus(1); // PAID
        } else {
            tuition.setStatus(2); // PARTIAL
        }

        studentTuitionRepository.save(tuition);

        return PaymentResponse.builder()
                .id(payment.getId())
                .studentTuitionId(tuition.getId())
                .amountPaid(payment.getAmountPaid())
                .paymentDate(payment.getPaymentDate())
                .paymentMethod(payment.getPaymentMethod())
                .paymentStatus(payment.getPaymentStatus())
                .transactionRef(payment.getTransactionRef())
                .notes(payment.getNotes())
                .build();
    }

    @Override
    public List<PaymentResponse> getPaymentHistory(UUID studentTuitionId) {
        return tuitionPaymentRepository.findAllByStudentTuitionId(studentTuitionId).stream()
                .map(p -> PaymentResponse.builder()
                        .id(p.getId())
                        .studentTuitionId(p.getStudentTuition().getId())
                        .amountPaid(p.getAmountPaid())
                        .paymentDate(p.getPaymentDate())
                        .paymentMethod(p.getPaymentMethod())
                        .paymentStatus(p.getPaymentStatus())
                        .transactionRef(p.getTransactionRef())
                        .notes(p.getNotes())
                        .build())
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
