package uni.it.stdmanager.modules.i_auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import uni.it.stdmanager.core.exception.AppException;
import uni.it.stdmanager.core.exception.ErrorCode;
import uni.it.stdmanager.core.security.JwtService;
import uni.it.stdmanager.modules.i_auth.dto.request.IntrospectRequest;
import uni.it.stdmanager.modules.i_auth.dto.request.LoginRequest;
import uni.it.stdmanager.modules.i_auth.dto.response.AuthenticationResponse;
import uni.it.stdmanager.modules.i_auth.dto.response.IntrospectResponse;
import uni.it.stdmanager.modules.i_auth.entity.User;
import uni.it.stdmanager.modules.i_auth.entity.UserRole;
import uni.it.stdmanager.modules.i_auth.repository.UserRepository;
import uni.it.stdmanager.modules.i_auth.repository.UserRoleRepository;
import org.springframework.transaction.annotation.Transactional; // Thêm import này

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional // Thêm Annotation này để bao bọc toàn bộ các hàm trong class bằng 1 Transaction
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    public AuthenticationResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());
        if (!authenticated) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        if (!user.getIsActive()) {
            throw new AppException(ErrorCode.UNAUTHORIZED); // Hoặc tạo thêm ErrorCode.USER_LOCKED
        }

        // Cập nhật last_login_at
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // Lấy danh sách Role
        List<UserRole> userRoles = userRoleRepository.findAllByUser(user);
        Set<String> roles = userRoles.stream()
                .map(ur -> ur.getRole().getCode())
                .collect(Collectors.toSet());

        // Đưa roles vào payload (claims) của JWT
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("roles", roles);

        CustomUserDetails userDetails = new CustomUserDetails(user, roles);
        String token = jwtService.generateToken(extraClaims, userDetails);

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .user(AuthenticationResponse.UserResponse.builder()
                        .username(user.getUsername())
                        .fullName(user.getFullName())
                        .roles(roles)
                        .build())
                .build();
    }

    @Override
    public IntrospectResponse introspect(IntrospectRequest request) {
        boolean isValid = true;
        try {
            String username = jwtService.extractUsername(request.getToken());
            CustomUserDetails userDetails = (CustomUserDetails) userDetailsService.loadUserByUsername(username);
            isValid = jwtService.isTokenValid(request.getToken(), userDetails);
        } catch (Exception e) {
            isValid = false;
        }

        return IntrospectResponse.builder()
                .valid(isValid)
                .build();
    }
}