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
@Table(name = "student_summaries")
public class StudentSummary extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_id", nullable = false)
    private CourseRegistration registration;

    @Column(name = "total_score")
    private BigDecimal totalScore;

    @Column(name = "letter_grade", length = 2)
    private String letterGrade;

    @Column(name = "gpa_value")
    private BigDecimal gpaValue;

    @Column(name = "result", length = 10)
    private String result; // PASS, FAIL

    @Column(name = "is_finalized")
    @Builder.Default
    private Boolean isFinalized = false;
}
