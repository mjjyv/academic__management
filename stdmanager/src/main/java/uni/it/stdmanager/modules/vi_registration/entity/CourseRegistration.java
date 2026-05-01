package uni.it.stdmanager.modules.vi_registration.entity;

import jakarta.persistence.*;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;
import uni.it.stdmanager.modules.ii_student.entity.Student;
import uni.it.stdmanager.modules.v_semester.entity.CourseSection;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "course_registrations")
public class CourseRegistration extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_section_id", nullable = false)
    private CourseSection courseSection;

    @Column(name = "registration_type")
    private Integer registrationType; // 1: Học mới; 2: Học lại; 3: Cải thiện

    @Column(name = "registered_at")
    private LocalDateTime registeredAt;

    @Column(name = "status")
    private Integer status; // 1: Thành công; 2: Chờ thanh toán; 3: Đã hủy

    @Column(name = "is_paid")
    private Boolean isPaid;
}
