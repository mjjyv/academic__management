package uni.it.stdmanager.modules.vii_schedule.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.vii_schedule.dto.request.ScheduleRequest;
import uni.it.stdmanager.modules.vii_schedule.dto.response.ScheduleResponse;
import uni.it.stdmanager.modules.vii_schedule.service.ScheduleService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    @GetMapping("/sections/{sectionId}")
    public ApiResponse<List<ScheduleResponse>> getBySection(@PathVariable UUID sectionId) {
        return ApiResponse.success(scheduleService.getSchedulesBySection(sectionId), "Lấy lịch học thành công");
    }

    @GetMapping("/student/{userId}")
    public ApiResponse<List<ScheduleResponse>> getForStudent(@PathVariable UUID userId) {
        return ApiResponse.success(scheduleService.getStudentSchedule(userId), "Lấy lịch học thành công");
    }

    @GetMapping("/lecturer/{userId}")
    public ApiResponse<List<ScheduleResponse>> getForLecturer(@PathVariable UUID userId) {
        return ApiResponse.success(scheduleService.getLecturerSchedule(userId), "Lấy lịch dạy thành công");
    }

    @GetMapping("/department/{departmentId}")
    public ApiResponse<List<ScheduleResponse>> getForDepartment(@PathVariable UUID departmentId) {
        return ApiResponse.success(scheduleService.getDepartmentSchedule(departmentId), "Lấy lịch học khoa thành công");
    }

    @GetMapping("/class/{classId}")
    public ApiResponse<List<ScheduleResponse>> getForClass(@PathVariable UUID classId) {
        return ApiResponse.success(scheduleService.getSchedulesByClass(classId), "Lấy lịch học lớp thành công");
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU', 'GIANGVIEN')")
    public ApiResponse<ScheduleResponse> create(@RequestBody ScheduleRequest request) {
        return ApiResponse.success(scheduleService.createSchedule(request), "Tạo lịch học thành công");
    }

    @DeleteMapping("/{scheduleId}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU', 'GIANGVIEN')")
    public ApiResponse<Void> delete(@PathVariable UUID scheduleId) {
        scheduleService.deleteSchedule(scheduleId);
        return ApiResponse.success(null, "Xóa lịch học thành công");
    }
}
