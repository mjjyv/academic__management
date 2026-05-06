package uni.it.stdmanager.modules.vii_schedule.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.vii_schedule.entity.Schedule;

import java.util.List;
import java.util.UUID;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, UUID> {
    
    List<Schedule> findAllByCourseSectionId(UUID courseSectionId);

    @Query("SELECT s FROM Schedule s " +
           "JOIN s.courseSection cs " +
           "JOIN cs.semester sem " +
           "WHERE cs.lecturer.id = :lecturerId " +
           "AND sem.isActive = true")
    List<Schedule> findCurrentSchedulesByLecturerId(@Param("lecturerId") UUID lecturerId);

    @Query("SELECT s FROM Schedule s " +
           "JOIN s.courseSection cs " +
           "JOIN cs.semester sem " +
           "JOIN CourseRegistration cr ON cr.courseSection.id = cs.id " +
           "WHERE cr.student.id = :studentId " +
           "AND cr.status = 1 " +
           "AND sem.isActive = true")
    List<Schedule> findCurrentSchedulesByStudentId(@Param("studentId") UUID studentId);

    @Query("SELECT s FROM Schedule s " +
           "JOIN s.courseSection cs " +
           "JOIN cs.course c " +
           "JOIN cs.semester sem " +
           "WHERE c.department.id = :departmentId " +
           "AND sem.isActive = true")
    List<Schedule> findCurrentSchedulesByDepartmentId(@Param("departmentId") UUID departmentId);

    @Query("SELECT DISTINCT s FROM Schedule s " +
           "JOIN s.courseSection cs " +
           "JOIN cs.semester sem " +
           "JOIN CourseRegistration cr ON cr.courseSection.id = cs.id " +
           "JOIN cr.student std " +
           "WHERE std.studentClass.id = :classId " +
           "AND cr.status = 1 " +
           "AND sem.isActive = true")
    List<Schedule> findSchedulesByClassId(@Param("classId") UUID classId);
}
