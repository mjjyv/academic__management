package uni.it.stdmanager.modules.i_auth.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.i_auth.dto.admin.RoleCreateRequest;
import uni.it.stdmanager.modules.i_auth.dto.admin.RoleResponse;
import uni.it.stdmanager.modules.i_auth.service.AdminAuthService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/roles")
@RequiredArgsConstructor
@Tag(name = "I. Auth Module (Admin)", description = "API Quản trị vai trò và phân quyền (Chỉ ADMIN)")
@PreAuthorize("hasRole('ADMIN')")
public class AdminRoleController {

    private final AdminAuthService adminAuthService;

    @GetMapping
    @Operation(summary = "6. Liệt kê vai trò", description = "Lấy danh sách tất cả các vai trò (Roles) trong hệ thống")
    public ApiResponse<List<RoleResponse>> getAllRoles() {
        List<RoleResponse> roles = adminAuthService.getAllRoles();
        return ApiResponse.success(roles, "Lấy danh sách vai trò thành công");
    }

    @GetMapping("/{id}")
    @Operation(summary = "7. Chi tiết vai trò", description = "Lấy thông tin chi tiết và danh sách quyền của một vai trò")
    public ApiResponse<RoleResponse> getRoleById(@PathVariable UUID id) {
        RoleResponse role = adminAuthService.getRoleById(id);
        return ApiResponse.success(role, "Lấy chi tiết vai trò thành công");
    }

    @PostMapping
    @Operation(summary = "8. Tạo vai trò mới", description = "Tạo một vai trò mới và gán các quyền (Permissions) ban đầu")
    public ApiResponse<RoleResponse> createRole(@Valid @RequestBody RoleCreateRequest request) {
        RoleResponse role = adminAuthService.createRole(request);
        return ApiResponse.success(role, "Tạo vai trò thành công");
    }

    @PutMapping("/{id}")
    @Operation(summary = "9. Cập nhật vai trò", description = "Cập nhật tên, mô tả và danh sách quyền của vai trò")
    public ApiResponse<RoleResponse> updateRole(@PathVariable UUID id, @Valid @RequestBody RoleCreateRequest request) {
        RoleResponse role = adminAuthService.updateRole(id, request);
        return ApiResponse.success(role, "Cập nhật vai trò thành công");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "10. Xóa vai trò", description = "Vô hiệu hóa một vai trò (Không cho phép xóa vai trò hệ thống)")
    public ApiResponse<Void> deleteRole(@PathVariable UUID id) {
        adminAuthService.deleteRole(id);
        return ApiResponse.success(null, "Xóa vai trò thành công");
    }
}
