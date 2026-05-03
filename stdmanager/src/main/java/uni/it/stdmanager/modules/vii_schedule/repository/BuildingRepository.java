package uni.it.stdmanager.modules.vii_schedule.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.vii_schedule.entity.Building;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BuildingRepository extends JpaRepository<Building, UUID> {
    Optional<Building> findByBuildingCode(String buildingCode);
}
