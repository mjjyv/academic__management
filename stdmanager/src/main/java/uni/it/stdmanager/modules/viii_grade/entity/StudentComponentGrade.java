package uni.it.stdmanager.modules.viii_grade.entity;

import jakarta.persistence.*;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;
import uni.it.stdmanager.modules.vi_registration.entity.CourseRegistration;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "student_component_grades")
public class StudentComponentGrade extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_id", nullable = false)
    private CourseRegistration registration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "component_id", nullable = false)
    private GradeComponent component;

    @Column(name = "score", precision = 5, scale = 2)
    private BigDecimal score;

    @Column(name = "is_retake")
    @Builder.Default
    private Boolean isRetake = false;

    @Column(name = "is_locked")
    @Builder.Default
    private Boolean isLocked = false;
}
