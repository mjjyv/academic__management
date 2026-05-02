package uni.it.stdmanager.modules.viii_grade.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.viii_grade.entity.StudentSummary;

import java.util.List;
import java.util.UUID;

@Repository
public interface StudentSummaryRepository extends JpaRepository<StudentSummary, UUID> {
    
    @Query("SELECT s FROM StudentSummary s " +
           "JOIN FETCH s.registration r " +
           "JOIN FETCH r.courseSection cs " +
           "JOIN FETCH cs.course c " +
           "WHERE r.student.id = :studentId " +
           "AND r.replacedGradeId IS NULL " +
           "AND s.isActive = true")
    List<StudentSummary> findActiveSummariesByStudentId(@Param("studentId") UUID studentId);
}
