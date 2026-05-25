package uni.it.stdmanager.modules.vii_schedule.entity;

import jakarta.persistence.*;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;
import uni.it.stdmanager.modules.iii_lecturer.entity.Employee;
import uni.it.stdmanager.modules.v_semester.entity.CourseSection;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "schedules")
public class Schedule extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_section_id", nullable = false)
    private CourseSection courseSection;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lecturer_id")
    private Employee lecturer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    @Column(name = "day_of_week")
    private Integer dayOfWeek;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "shift", length = 50)
    private String shift;

    @Column(name = "start_period")
    private Integer startPeriod;

    @Column(name = "end_period")
    private Integer endPeriod;

    @Column(name = "number_of_periods")
    private Integer numberOfPeriods;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "mode", length = 100)
    private String mode;

    @Column(name = "status", length = 255)
    private String status;

    @Column(name = "schedule_status", length = 50)
    private String scheduleStatus;

    @Column(name = "note", length = 255)
    private String note;
}
