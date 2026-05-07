package uni.it.stdmanager.modules.ix_tuition.entity;

import jakarta.persistence.*;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;
import uni.it.stdmanager.modules.ii_student.entity.Student;
import uni.it.stdmanager.modules.v_semester.entity.Semester;

import java.math.BigDecimal;
// import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "tuition_exemptions")
public class TuitionExemption extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "exemption_type", length = 100)
    private String exemptionType;

    @Column(name = "exemption_percentage", precision = 5, scale = 2)
    private BigDecimal exemptionPercentage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "start_semester_id")
    private Semester startSemester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "end_semester_id")
    private Semester endSemester;

    @Column(name = "description", length = 255)
    private String description;
}
