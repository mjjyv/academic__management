package uni.it.stdmanager.modules.viii_grade.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "grade_scales")
public class GradeScale extends BaseEntity {

    @Column(name = "scale_code", length = 20, unique = true, nullable = false)
    private String scaleCode;

    @Column(name = "min_score", precision = 5, scale = 2)
    private BigDecimal minScore;

    @Column(name = "max_score", precision = 5, scale = 2)
    private BigDecimal maxScore;

    @Column(name = "letter_grade", length = 5, nullable = false)
    private String letterGrade;

    @Column(name = "gpa_value", precision = 3, scale = 2)
    private BigDecimal gpaValue;

    @Column(name = "description")
    private String description;

    @Column(name = "is_pass")
    @Builder.Default
    private Boolean isPass = true;

    @Column(name = "display_order")
    private Integer displayOrder;
}
