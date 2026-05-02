package uni.it.stdmanager.modules.ix_tuition.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.ix_tuition.entity.TuitionFee;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TuitionFeeRepository extends JpaRepository<TuitionFee, UUID> {
    Optional<TuitionFee> findFirstByCourseYearAndFeeTypeAndIsActiveTrueOrderByEffectiveDateDesc(
            String courseYear, String feeType);
}
