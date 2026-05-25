package uni.it.stdmanager.modules.i_auth.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.i_auth.dto.admin.UserCreateRequest;
import uni.it.stdmanager.modules.i_auth.dto.admin.UserResponse;
import uni.it.stdmanager.modules.i_auth.dto.admin.UserUpdateRequest;
import uni.it.stdmanager.modules.i_auth.service.AdminAuthService;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@Tag(name = "I. Auth Module (Admin)", description = "API Quản trị người dùng (Chỉ ADMIN)")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminAuthService adminAuthService;

    @GetMapping
    @Operation(summary = "1. Liệt kê người dùng", description = "Lấy danh sách tất cả người dùng trong hệ thống (Phân trang, Tìm kiếm)")
    public ApiResponse<Page<UserResponse>> getAllUsers(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<UserResponse> users = adminAuthService.getAllUsers(search, org.springframework.data.domain.PageRequest.of(page, size));
        return ApiResponse.success(users, "Lấy danh sách người dùng thành công");
    }

    @GetMapping("/{id}")
    @Operation(summary = "2. Chi tiết người dùng", description = "Lấy thông tin chi tiết của một người dùng theo ID")
    public ApiResponse<UserResponse> getUserById(@PathVariable UUID id) {
        UserResponse user = adminAuthService.getUserById(id);
        return ApiResponse.success(user, "Lấy thông tin người dùng thành công");
    }

    @PostMapping
    @Operation(summary = "3. Tạo người dùng mới", description = "Tạo tài khoản người dùng mới và gán vai trò ban đầu")
    public ApiResponse<UserResponse> createUser(@Valid @RequestBody UserCreateRequest request) {
        UserResponse user = adminAuthService.createUser(request);
        return ApiResponse.success(user, "Tạo người dùng thành công");
    }

    @PutMapping("/{id}")
    @Operation(summary = "4. Cập nhật người dùng", description = "Cập nhật thông tin cá nhân và vai trò của người dùng")
    public ApiResponse<UserResponse> updateUser(@PathVariable UUID id, @Valid @RequestBody UserUpdateRequest request) {
        UserResponse user = adminAuthService.updateUser(id, request);
        return ApiResponse.success(user, "Cập nhật người dùng thành công");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "5. Xóa người dùng (Vô hiệu hóa)", description = "Chuyển trạng thái người dùng sang không hoạt động (Soft Delete)")
    public ApiResponse<Void> deleteUser(@PathVariable UUID id) {
        adminAuthService.deleteUser(id);
        return ApiResponse.success(null, "Vô hiệu hóa người dùng thành công");
    }

    @PatchMapping("/{id}/reset-password")
    @Operation(summary = "5.1 Đặt lại mật khẩu", description = "Quản trị viên đặt lại mật khẩu cho người dùng")
    public ApiResponse<Void> resetPassword(@PathVariable UUID id, @RequestParam String newPassword) {
        adminAuthService.resetPassword(id, newPassword);
        return ApiResponse.success(null, "Đặt lại mật khẩu thành công");
    }
}
