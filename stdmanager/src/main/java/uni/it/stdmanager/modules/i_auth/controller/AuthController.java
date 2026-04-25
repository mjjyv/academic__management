package uni.it.stdmanager.modules.i_auth.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.core.security.SecurityUtils;
import uni.it.stdmanager.modules.i_auth.dto.request.IntrospectRequest;
import uni.it.stdmanager.modules.i_auth.dto.request.LoginRequest;
import uni.it.stdmanager.modules.i_auth.dto.response.AuthenticationResponse;
import uni.it.stdmanager.modules.i_auth.dto.response.IntrospectResponse;
import uni.it.stdmanager.modules.i_auth.service.AuthService;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "I. Auth Module", description = "API Xác thực và Quản lý truy cập")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "1. Đăng nhập", description = "Xác thực tài khoản và cấp phát JWT Token")
    public ApiResponse<AuthenticationResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthenticationResponse response = authService.login(request);
        return ApiResponse.success(response, "Đăng nhập thành công");
    }

    @PostMapping("/introspect")
    @Operation(summary = "2. Xác minh Token", description = "Kiểm tra tính hợp lệ của Token hiện tại")
    public ApiResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest request) {
        IntrospectResponse response = authService.introspect(request);
        return ApiResponse.success(response, "Kiểm tra trạng thái token thành công");
    }

    @GetMapping("/me")
    @Operation(summary = "3. Trạng thái phiên làm việc", description = "Lấy username của người dùng đang thực hiện request")
    public ApiResponse<String> getCurrentUser() {
        String currentUsername = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin xác thực"));
        return ApiResponse.success(currentUsername, "Lấy thông tin định danh thành công");
    }
}