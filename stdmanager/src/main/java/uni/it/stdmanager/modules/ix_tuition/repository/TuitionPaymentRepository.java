package uni.it.stdmanager.modules.ix_tuition.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.ix_tuition.entity.TuitionPayment;

import java.util.List;
import java.util.UUID;

@Repository
public interface TuitionPaymentRepository extends JpaRepository<TuitionPayment, UUID> {
    List<TuitionPayment> findAllByStudentTuitionId(UUID studentTuitionId);
}
