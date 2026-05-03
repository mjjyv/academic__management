package uni.it.stdmanager.modules.vii_schedule.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.modules.vii_schedule.dto.response.BuildingResponse;
import uni.it.stdmanager.modules.vii_schedule.dto.response.RoomResponse;
import uni.it.stdmanager.modules.vii_schedule.dto.response.TimeSlotResponse;
import uni.it.stdmanager.modules.vii_schedule.entity.Building;
import uni.it.stdmanager.modules.vii_schedule.entity.Room;
import uni.it.stdmanager.modules.vii_schedule.entity.TimeSlot;
import uni.it.stdmanager.modules.vii_schedule.repository.BuildingRepository;
import uni.it.stdmanager.modules.vii_schedule.repository.RoomRepository;
import uni.it.stdmanager.modules.vii_schedule.repository.TimeSlotRepository;
import uni.it.stdmanager.modules.vii_schedule.service.InfrastructureService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InfrastructureServiceImpl implements InfrastructureService {

    private final BuildingRepository buildingRepository;
    private final RoomRepository roomRepository;
    private final TimeSlotRepository timeSlotRepository;

    @Override
    public List<BuildingResponse> getAllBuildings() {
        return buildingRepository.findAll().stream()
                .map(this::mapToBuildingResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<RoomResponse> getRoomsByBuilding(UUID buildingId) {
        return roomRepository.findAllByBuildingId(buildingId).stream()
                .map(this::mapToRoomResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TimeSlotResponse> getAllTimeSlots() {
        return timeSlotRepository.findAll().stream()
                .map(this::mapToTimeSlotResponse)
                .collect(Collectors.toList());
    }

    private BuildingResponse mapToBuildingResponse(Building b) {
        return BuildingResponse.builder()
                .id(b.getId())
                .buildingCode(b.getBuildingCode())
                .buildingName(b.getBuildingName())
                .address(b.getAddress())
                .build();
    }

    private RoomResponse mapToRoomResponse(Room r) {
        return RoomResponse.builder()
                .id(r.getId())
                .roomCode(r.getRoomCode())
                .roomName(r.getRoomName())
                .buildingId(r.getBuilding().getId())
                .buildingName(r.getBuilding().getBuildingName())
                .capacity(r.getCapacity())
                .roomType(r.getRoomType())
                .build();
    }

    private TimeSlotResponse mapToTimeSlotResponse(TimeSlot t) {
        return TimeSlotResponse.builder()
                .id(t.getId())
                .slotCode(t.getSlotCode())
                .startTime(t.getStartTime())
                .endTime(t.getEndTime())
                .build();
    }
}
