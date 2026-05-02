package uni.it.stdmanager.modules.ix_tuition.entity;

import jakarta.persistence.*;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "tuition_fees")
public class TuitionFee extends BaseEntity {

    @Column(name = "program_id")
    private UUID programId;

    @Column(name = "course_year", length = 10)
    private String courseYear;

    @Column(name = "price_per_credit")
    private BigDecimal pricePerCredit;

    @Column(name = "base_tuition")
    private BigDecimal baseTuition;

    @Column(name = "effective_date")
    private LocalDate effectiveDate;

    @Column(name = "fee_type", length = 20)
    @Builder.Default
    private String feeType = "NEW"; // NEW, RETAKE
}
