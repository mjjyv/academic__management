package uni.it.stdmanager.modules.ix_tuition.service;

import java.math.BigDecimal;
import java.util.UUID;

public interface TuitionService {
    BigDecimal calculateTuition(UUID studentId, UUID semesterId);
}
