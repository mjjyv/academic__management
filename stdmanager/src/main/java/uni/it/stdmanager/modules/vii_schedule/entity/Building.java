package uni.it.stdmanager.modules.vii_schedule.entity;

import jakarta.persistence.*;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "buildings")
public class Building extends BaseEntity {

    @Column(name = "building_code", length = 10, nullable = false, unique = true)
    private String buildingCode;

    @Column(name = "building_name", length = 100, nullable = false)
    private String buildingName;

    @Column(name = "address", length = 200)
    private String address;

    @Column(name = "total_floors")
    private Integer totalFloors;

    @Column(name = "building_type", length = 10)
    private String buildingType;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "note", length = 255)
    private String note;
}
