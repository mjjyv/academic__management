package uni.it.stdmanager.modules.ix_tuition.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.ix_tuition.entity.TuitionExemption;

import java.util.List;
import java.util.UUID;

@Repository
public interface TuitionExemptionRepository extends JpaRepository<TuitionExemption, UUID> {
    List<TuitionExemption> findAllByStudentIdAndIsActiveTrue(UUID studentId);
}
