package uni.it.stdmanager.modules.vii_schedule.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponse {
    private UUID id;
    private String roomCode;
    private String roomName;
    private UUID buildingId;
    private String buildingName;
    private Integer capacity;
    private String roomType;
}
