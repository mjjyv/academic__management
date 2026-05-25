package uni.it.stdmanager.modules.ix_tuition.service;

import uni.it.stdmanager.modules.ix_tuition.dto.request.TuitionFeeRequest;
import uni.it.stdmanager.modules.ix_tuition.entity.TuitionFee;

import java.util.List;
import java.util.UUID;

public interface TuitionFeeService {
    List<TuitionFee> getAllTuitionFees();
    TuitionFee getTuitionFeeById(UUID id);
    TuitionFee createTuitionFee(TuitionFeeRequest request);
    TuitionFee updateTuitionFee(UUID id, TuitionFeeRequest request);
    void deleteTuitionFee(UUID id);
    void toggleStatus(UUID id);
}
