package uni.it.stdmanager.modules.iv_course.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.iv_course.entity.Major;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MajorRepository extends JpaRepository<Major, UUID> {
    Optional<Major> findByMajorCode(String majorCode);
    List<Major> findAllByDepartmentId(UUID departmentId);
}
