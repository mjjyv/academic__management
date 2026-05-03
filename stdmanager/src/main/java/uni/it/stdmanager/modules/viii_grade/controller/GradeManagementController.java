package uni.it.stdmanager.modules.viii_grade.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.core.security.SecurityUtils;
import uni.it.stdmanager.modules.i_auth.entity.User;
import uni.it.stdmanager.modules.i_auth.entity.UserRole;
import uni.it.stdmanager.modules.i_auth.repository.UserRepository;
import uni.it.stdmanager.modules.i_auth.repository.UserRoleRepository;
import uni.it.stdmanager.modules.viii_grade.dto.request.GradeUpdateRequest;
import uni.it.stdmanager.modules.viii_grade.dto.response.GradeDetailResponse;
import uni.it.stdmanager.modules.viii_grade.dto.response.SectionGradeManagementResponse;
import uni.it.stdmanager.modules.viii_grade.service.GradeService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/grade-management")
@RequiredArgsConstructor
@Tag(name = "Grade Management", description = "Quản lý điểm chi tiết cho Giảng viên và Giáo vụ")
public class GradeManagementController {

    private final GradeService gradeService;
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;

    @GetMapping("/sections")
    @PreAuthorize("hasAnyRole('GIANGVIEN', 'GIAOVU', 'ADMIN')")
    @Operation(summary = "Lấy danh sách lớp học phần để quản lý điểm")
    public ApiResponse<List<SectionGradeManagementResponse>> getSections() {
        String username = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new RuntimeException("User not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<UserRole> userRoles = userRoleRepository.findAllByUser(user);
        boolean isStaff = userRoles.stream()
                .anyMatch(ur -> ur.getRole().getCode().equals("GIAOVU") || ur.getRole().getCode().equals("ADMIN"));

        List<SectionGradeManagementResponse> response;
        if (isStaff) {
            response = gradeService.getAllSectionsForStaff();
        } else {
            response = gradeService.getSectionsForLecturer(user.getId());
        }

        return ApiResponse.success(response, "Lấy danh sách lớp thành công");
    }

    @GetMapping("/sections/{sectionId}/details")
    @PreAuthorize("hasAnyRole('GIANGVIEN', 'GIAOVU', 'ADMIN')")
    @Operation(summary = "Lấy danh sách sinh viên và điểm chi tiết của một lớp")
    public ApiResponse<List<GradeDetailResponse>> getGradeDetails(@PathVariable UUID sectionId) {
        return ApiResponse.success(gradeService.getGradeDetailsBySection(sectionId), "Lấy chi tiết điểm thành công");
    }

    @PutMapping("/registrations/{registrationId}/grades")
    @PreAuthorize("hasAnyRole('GIANGVIEN', 'GIAOVU', 'ADMIN')")
    @Operation(summary = "Cập nhật điểm thành phần cho một sinh viên")
    public ApiResponse<Void> updateGrades(@PathVariable UUID registrationId, @RequestBody GradeUpdateRequest request) {
        gradeService.updateStudentGrades(registrationId, request);
        return ApiResponse.success(null, "Cập nhật điểm thành công");
    }
}
