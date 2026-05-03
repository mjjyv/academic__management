package uni.it.stdmanager.modules.vii_schedule.service;

import uni.it.stdmanager.modules.vii_schedule.dto.response.BuildingResponse;
import uni.it.stdmanager.modules.vii_schedule.dto.response.RoomResponse;

import java.util.List;
import java.util.UUID;

public interface InfrastructureService {
    List<BuildingResponse> getAllBuildings();
    List<RoomResponse> getRoomsByBuilding(UUID buildingId);
}
