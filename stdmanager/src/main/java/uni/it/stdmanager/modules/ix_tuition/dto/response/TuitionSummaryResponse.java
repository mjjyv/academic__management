package uni.it.stdmanager.modules.ix_tuition.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
public class TuitionSummaryResponse {
    private BigDecimal totalDebt;
    private BigDecimal totalPaid;
    private List<StudentTuitionResponse> semesterTuitions;
}
