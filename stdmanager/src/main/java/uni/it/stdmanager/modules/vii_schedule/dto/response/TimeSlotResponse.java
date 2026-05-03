package uni.it.stdmanager.modules.vii_schedule.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlotResponse {
    private UUID id;
    private String slotCode;
    private LocalTime startTime;
    private LocalTime endTime;
}
