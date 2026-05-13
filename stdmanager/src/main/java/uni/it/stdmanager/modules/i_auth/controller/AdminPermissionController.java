package uni.it.stdmanager.modules.i_auth.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.i_auth.dto.admin.GroupedPermissionResponse;
import uni.it.stdmanager.modules.i_auth.dto.admin.PermissionResponse;
import uni.it.stdmanager.modules.i_auth.service.AdminAuthService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/permissions")
@RequiredArgsConstructor
@Tag(name = "I. Auth Module (Admin)", description = "API Quản trị danh mục quyền (Chỉ ADMIN)")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPermissionController {

    private final AdminAuthService adminAuthService;

    @GetMapping
    @Operation(summary = "11. Liệt kê tất cả quyền", description = "Lấy danh sách tất cả các quyền (Permissions) có sẵn trong hệ thống")
    public ApiResponse<List<PermissionResponse>> getAllPermissions() {
        List<PermissionResponse> permissions = adminAuthService.getAllPermissions();
        return ApiResponse.success(permissions, "Lấy danh sách quyền thành công");
    }

    @GetMapping("/grouped")
    @Operation(summary = "12. Liệt kê quyền theo module", description = "Lấy danh sách quyền được nhóm theo chức năng (Module)")
    public ApiResponse<List<GroupedPermissionResponse>> getGroupedPermissions() {
        List<GroupedPermissionResponse> grouped = adminAuthService.getGroupedPermissions();
        return ApiResponse.success(grouped, "Lấy danh sách quyền theo nhóm thành công");
    }
}
