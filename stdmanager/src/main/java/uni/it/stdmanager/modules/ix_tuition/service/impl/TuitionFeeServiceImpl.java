package uni.it.stdmanager.modules.ix_tuition.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.modules.ix_tuition.dto.request.TuitionFeeRequest;
import uni.it.stdmanager.modules.ix_tuition.entity.TuitionFee;
import uni.it.stdmanager.modules.ix_tuition.repository.TuitionFeeRepository;
import uni.it.stdmanager.modules.ix_tuition.service.TuitionFeeService;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TuitionFeeServiceImpl implements TuitionFeeService {

    private final TuitionFeeRepository tuitionFeeRepository;

    @Override
    public List<TuitionFee> getAllTuitionFees() {
        return tuitionFeeRepository.findAll();
    }

    @Override
    public TuitionFee getTuitionFeeById(UUID id) {
        return tuitionFeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy định mức học phí với ID: " + id));
    }

    @Override
    @Transactional
    public TuitionFee createTuitionFee(TuitionFeeRequest request) {
        TuitionFee tuitionFee = TuitionFee.builder()
                .programId(request.getProgramId())
                .courseYear(request.getCourseYear())
                .pricePerCredit(request.getPricePerCredit())
                .baseTuition(request.getBaseTuition())
                .effectiveDate(request.getEffectiveDate())
                .feeType(request.getFeeType())
                .build();
        tuitionFee.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        return tuitionFeeRepository.save(tuitionFee);
    }

    @Override
    @Transactional
    public TuitionFee updateTuitionFee(UUID id, TuitionFeeRequest request) {
        TuitionFee tuitionFee = getTuitionFeeById(id);
        tuitionFee.setProgramId(request.getProgramId());
        tuitionFee.setCourseYear(request.getCourseYear());
        tuitionFee.setPricePerCredit(request.getPricePerCredit());
        tuitionFee.setBaseTuition(request.getBaseTuition());
        tuitionFee.setEffectiveDate(request.getEffectiveDate());
        tuitionFee.setFeeType(request.getFeeType());
        if (request.getIsActive() != null) {
            tuitionFee.setIsActive(request.getIsActive());
        }
        return tuitionFeeRepository.save(tuitionFee);
    }

    @Override
    @Transactional
    public void deleteTuitionFee(UUID id) {
        tuitionFeeRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void toggleStatus(UUID id) {
        TuitionFee tuitionFee = getTuitionFeeById(id);
        tuitionFee.setIsActive(!tuitionFee.getIsActive());
        tuitionFeeRepository.save(tuitionFee);
    }
}
