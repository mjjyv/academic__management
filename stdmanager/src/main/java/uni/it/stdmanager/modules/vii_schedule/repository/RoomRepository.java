package uni.it.stdmanager.modules.vii_schedule.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.vii_schedule.entity.Room;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoomRepository extends JpaRepository<Room, UUID> {
    Optional<Room> findByRoomCode(String roomCode);
    List<Room> findAllByBuildingId(UUID buildingId);
}
