package uni.it.stdmanager.modules.ix_tuition.dto.request;

import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class PaymentRequest {
    private UUID studentTuitionId;
    private BigDecimal amountPaid;
    private Integer paymentMethod;
    private String transactionRef;
    private String notes;
}
