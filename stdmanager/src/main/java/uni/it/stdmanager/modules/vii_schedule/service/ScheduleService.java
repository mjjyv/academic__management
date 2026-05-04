package uni.it.stdmanager.modules.vii_schedule.service;

import uni.it.stdmanager.modules.vii_schedule.dto.request.ScheduleRequest;
import uni.it.stdmanager.modules.vii_schedule.dto.response.ScheduleResponse;

import java.util.List;
import java.util.UUID;

public interface ScheduleService {
    List<ScheduleResponse> getSchedulesBySection(UUID sectionId);
    List<ScheduleResponse> getStudentSchedule(UUID studentId);
    List<ScheduleResponse> getLecturerSchedule(UUID userId);
    List<ScheduleResponse> getDepartmentSchedule(UUID departmentId);
    ScheduleResponse createSchedule(ScheduleRequest request);
    void deleteSchedule(UUID scheduleId);
}
