package uni.it.stdmanager.modules.vi_registration.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.vi_registration.entity.CourseRegistration;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourseRegistrationRepository extends JpaRepository<CourseRegistration, UUID> {
    List<CourseRegistration> findByCourseSectionId(UUID sectionId);
}
