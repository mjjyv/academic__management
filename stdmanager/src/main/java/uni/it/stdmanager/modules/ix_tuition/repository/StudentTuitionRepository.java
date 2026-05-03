package uni.it.stdmanager.modules.ix_tuition.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.ix_tuition.entity.StudentTuition;

import java.util.List;
import java.util.UUID;

@Repository
public interface StudentTuitionRepository extends JpaRepository<StudentTuition, UUID> {
    List<StudentTuition> findAllByStudentId(UUID studentId);
    List<StudentTuition> findAllByStudentDepartmentId(UUID departmentId);
}
