package uni.it.stdmanager.modules.v_semester.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.v_semester.entity.CourseSection;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseSectionRepository extends JpaRepository<CourseSection, UUID> {
    Optional<CourseSection> findByClassCode(String classCode);
    List<CourseSection> findAllBySemesterId(UUID semesterId);
    List<CourseSection> findAllByLecturerId(UUID lecturerId);
    List<CourseSection> findAllByCourseDepartmentId(UUID departmentId);

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("SELECT c FROM CourseSection c WHERE c.id = :id")
    Optional<CourseSection> findByIdWithLock(@org.springframework.data.repository.query.Param("id") UUID id);
}
