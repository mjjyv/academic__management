package uni.it.stdmanager.modules.viii_grade.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.viii_grade.entity.GradeScale;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GradeScaleRepository extends JpaRepository<GradeScale, UUID> {
    
    @Query("SELECT gs FROM GradeScale gs WHERE gs.isActive = true ORDER BY gs.displayOrder ASC")
    List<GradeScale> findAllActive();

    @Query("SELECT gs FROM GradeScale gs WHERE gs.isActive = true AND gs.minScore <= :score ORDER BY gs.minScore DESC")
    List<GradeScale> findScalesByScore(BigDecimal score);

    default Optional<GradeScale> findByScore(BigDecimal score) {
        return findScalesByScore(score).stream().findFirst();
    }
}
