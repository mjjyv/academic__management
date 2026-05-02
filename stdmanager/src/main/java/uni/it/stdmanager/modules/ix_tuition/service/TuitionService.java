package uni.it.stdmanager.modules.ix_tuition.service;

import uni.it.stdmanager.modules.ix_tuition.dto.response.StudentTuitionResponse;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface TuitionService {
    BigDecimal calculateTuition(UUID studentId, UUID semesterId);
    List<StudentTuitionResponse> getStudentTuitions(UUID studentId);
    List<StudentTuitionResponse> getAllTuitions();
}
