package uni.it.stdmanager.modules.vii_schedule.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleRequest {
    private UUID courseSectionId;
    private UUID lecturerId;
    private UUID roomId;
    private Integer dayOfWeek;
    private LocalDate date;
    private String shift;
    private Integer startPeriod;
    private Integer endPeriod;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String mode;
    private String note;
}
