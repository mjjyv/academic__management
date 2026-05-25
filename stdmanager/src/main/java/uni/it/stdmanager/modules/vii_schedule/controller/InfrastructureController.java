package uni.it.stdmanager.modules.vii_schedule.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.vii_schedule.dto.response.BuildingResponse;
import uni.it.stdmanager.modules.vii_schedule.dto.response.RoomResponse;
import uni.it.stdmanager.modules.vii_schedule.dto.response.TimeSlotResponse;
import uni.it.stdmanager.modules.vii_schedule.service.InfrastructureService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/infrastructure")
@RequiredArgsConstructor
public class InfrastructureController {

    private final InfrastructureService infrastructureService;

    @GetMapping("/buildings")
    public ApiResponse<List<BuildingResponse>> getAllBuildings() {
        return ApiResponse.success(infrastructureService.getAllBuildings(), "Lấy danh sách tòa nhà thành công");
    }

    @GetMapping("/buildings/{buildingId}/rooms")
    public ApiResponse<List<RoomResponse>> getRoomsByBuilding(@PathVariable UUID buildingId) {
        return ApiResponse.success(infrastructureService.getRoomsByBuilding(buildingId), "Lấy danh sách phòng thành công");
    }

    @GetMapping("/time-slots")
    public ApiResponse<List<TimeSlotResponse>> getAllTimeSlots() {
        return ApiResponse.success(infrastructureService.getAllTimeSlots(), "Lấy danh sách ca học thành công");
    }
}
