package uni.it.stdmanager.modules.iv_course.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.iv_course.entity.Course;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {
    Optional<Course> findByCourseCode(String courseCode);
    List<Course> findAllByDepartmentId(UUID departmentId);
}
