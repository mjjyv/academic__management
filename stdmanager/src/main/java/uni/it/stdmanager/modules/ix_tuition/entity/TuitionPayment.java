package uni.it.stdmanager.modules.ix_tuition.entity;

import jakarta.persistence.*;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "payments")
public class TuitionPayment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tuition_id", nullable = false)
    private StudentTuition studentTuition;

    @Column(name = "amount_paid", nullable = false)
    private BigDecimal amountPaid;

    @Column(name = "payment_date")
    @Builder.Default
    private LocalDateTime paymentDate = LocalDateTime.now();

    @Column(name = "payment_method", columnDefinition = "tinyint")
    private Integer paymentMethod; // 1-Bank Transfer, 2-Cash, 3-E-wallet

    @Column(name = "payment_status", length = 20)
    private String paymentStatus; // PENDING, SUCCESS, FAILED

    @Column(name = "transaction_ref", length = 100)
    private String transactionRef;

    @Column(name = "cashier_id")
    private UUID cashierId;

    @Column(name = "notes", columnDefinition = "nvarchar(max)")
    private String notes;
}
