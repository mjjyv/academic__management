package uni.it.stdmanager.modules.ix_tuition.service;

import uni.it.stdmanager.modules.ix_tuition.dto.request.PaymentRequest;
import uni.it.stdmanager.modules.ix_tuition.dto.response.PaymentResponse;
import uni.it.stdmanager.modules.ix_tuition.dto.response.StudentTuitionResponse;
import uni.it.stdmanager.modules.ix_tuition.dto.response.TuitionSummaryResponse;

// import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface TuitionService {
    StudentTuitionResponse calculateTuition(UUID studentId, UUID semesterId);

    List<StudentTuitionResponse> getStudentTuitions(UUID studentId);

    List<StudentTuitionResponse> getAllTuitions(UUID departmentId);

    StudentTuitionResponse getCurrentSemesterTuitionForCurrentStudent();

    TuitionSummaryResponse getDebtSummaryForCurrentStudent();

    PaymentResponse processPayment(PaymentRequest request);

    List<PaymentResponse> getPaymentHistory(UUID studentTuitionId);
}
