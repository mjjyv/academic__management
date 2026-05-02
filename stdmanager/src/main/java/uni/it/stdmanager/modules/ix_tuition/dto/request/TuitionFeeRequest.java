package uni.it.stdmanager.modules.ix_tuition.dto.request;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class TuitionFeeRequest {
    private UUID programId;
    private String courseYear;
    private BigDecimal pricePerCredit;
    private BigDecimal baseTuition;
    private LocalDate effectiveDate;
    private String feeType;
    private Boolean isActive;
}
