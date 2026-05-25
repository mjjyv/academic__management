package uni.it.stdmanager.modules.ix_tuition.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class PaymentResponse {
    private UUID id;
    private UUID studentTuitionId;
    private BigDecimal amountPaid;
    private LocalDateTime paymentDate;
    private Integer paymentMethod;
    private String paymentStatus;
    private String transactionRef;
    private String notes;
}
