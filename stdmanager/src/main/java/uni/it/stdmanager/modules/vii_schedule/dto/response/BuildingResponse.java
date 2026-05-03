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
public class BuildingResponse {
    private UUID id;
    private String buildingCode;
    private String buildingName;
    private String address;
}
