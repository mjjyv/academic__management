package uni.it.stdmanager.modules.vii_schedule.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.i_auth.service.CustomUserDetails;
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

    @GetMapping("/mine")
    public ApiResponse<List<ScheduleResponse>> getMySchedules() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Giả sử Principal chứa thông tin user, chúng ta cần lấy userId từ đó.
        // Trong hệ thống này, userId thường là UUID được lưu trong token.
        // Tạm thời lấy từ sub (username) hoặc một trường custom nếu có.
        // Để đơn giản và chính xác, giả sử chúng ta có một helper lấy userId.
        
        // Mocking userId for now or using a common pattern in the project
        // CustomUserDetails sẽ có getUser().getId()
        UUID userId = null; 
        if (auth.getPrincipal() instanceof CustomUserDetails) {
            userId = ((CustomUserDetails) auth.getPrincipal()).getUser().getId();
        }

        if (userId == null) {
             return ApiResponse.error("Không tìm thấy thông tin người dùng", "401");
        }

        if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SINHVIEN"))) {
            return ApiResponse.success(scheduleService.getStudentSchedule(userId), "Lấy lịch học sinh viên thành công");
        } else if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_GIANGVIEN"))) {
            return ApiResponse.success(scheduleService.getLecturerSchedule(userId), "Lấy lịch dạy giảng viên thành công");
        }
        
        return ApiResponse.error("Vai trò không hỗ trợ xem lịch cá nhân", "403");
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

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU', 'GIANGVIEN')")
    public ApiResponse<ScheduleResponse> update(@PathVariable UUID id, @RequestBody ScheduleRequest request) {
        return ApiResponse.success(scheduleService.updateSchedule(id, request), "Cập nhật lịch học thành công");
    }

    @DeleteMapping("/{scheduleId}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU', 'GIANGVIEN')")
    public ApiResponse<Void> delete(@PathVariable UUID scheduleId) {
        scheduleService.deleteSchedule(scheduleId);
        return ApiResponse.success(null, "Xóa lịch học thành công");
    }
}
