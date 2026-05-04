package uni.it.stdmanager.core.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import uni.it.stdmanager.core.exception.AppException;
import uni.it.stdmanager.core.exception.ErrorCode;
import uni.it.stdmanager.modules.i_auth.entity.User;
import uni.it.stdmanager.modules.i_auth.repository.UserRepository;

@Component
@RequiredArgsConstructor
public class SecurityAuditInterceptor implements HandlerInterceptor {

    private final UserRepository userRepository;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // Skip for non-authenticated requests if needed, but usually JWT filter already ran
        SecurityUtils.getCurrentUserLogin().ifPresent(username -> {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            if (!Boolean.TRUE.equals(user.getIsActive()) || user.getDeletedAt() != null) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
            
            // Note: In a production system, you might also verify role consistency here
            // by comparing user.getRoles() with the roles in the SecurityContext.
        });

        return true;
    }
}
