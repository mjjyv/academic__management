package uni.it.stdmanager.modules.vii_schedule.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.vii_schedule.entity.TimeSlot;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, UUID> {
    Optional<TimeSlot> findBySlotCode(String slotCode);
}
