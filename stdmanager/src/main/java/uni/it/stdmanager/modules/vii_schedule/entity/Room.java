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
@Table(name = "rooms")
public class Room extends BaseEntity {

    @Column(name = "room_code", length = 20, nullable = false, unique = true)
    private String roomCode;

    @Column(name = "room_name", length = 100)
    private String roomName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "building_id", nullable = false)
    private Building building;

    @Column(name = "floor")
    private Integer floor;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "room_type", length = 50)
    private String roomType;

    @Column(name = "status", length = 50)
    private String status;

    @Column(name = "has_projector")
    private Boolean hasProjector;

    @Column(name = "has_air_conditioner")
    private Boolean hasAirConditioner;

    @Column(name = "has_computer")
    private Boolean hasComputer;

    @Column(name = "description", length = 255)
    private String description;
}
