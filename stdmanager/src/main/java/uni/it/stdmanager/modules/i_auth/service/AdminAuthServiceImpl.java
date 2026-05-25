package uni.it.stdmanager.modules.i_auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import uni.it.stdmanager.core.exception.AppException;
import uni.it.stdmanager.core.exception.ErrorCode;
import uni.it.stdmanager.modules.i_auth.dto.admin.*;
import uni.it.stdmanager.modules.i_auth.entity.*;
import uni.it.stdmanager.modules.i_auth.repository.*;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminAuthServiceImpl implements AdminAuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRoleRepository userRoleRepository;
    private final RolePermissionRepository rolePermissionRepository;
    private final PasswordEncoder passwordEncoder;

    // --- User Management ---

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(String search, Pageable pageable) {
        if (StringUtils.hasText(search)) {
            return userRepository.findByUsernameContainingIgnoreCaseOrFullNameContainingIgnoreCase(search, search, pageable)
                    .map(this::mapToUserResponse);
        }
        return userRepository.findAll(pageable).map(this::mapToUserResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return mapToUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse createUser(UserCreateRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        User user = User.builder()
                .username(request.getUsername())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .build();
        user.setIsActive(true);

        user = userRepository.save(user);

        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            User finalUser = user;
            List<UserRole> userRoles = request.getRoles().stream()
                    .map(roleCode -> {
                        Role role = roleRepository.findByCode(roleCode)
                                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
                        UserRole ur = UserRole.builder().user(finalUser).role(role).build();
                        ur.setIsActive(true);
                        return ur;
                    })
                    .collect(Collectors.toList());
            userRoleRepository.saveAll(userRoles);
        }

        return mapToUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateUser(UUID id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        if (request.getIsActive() != null) {
            user.setIsActive(request.getIsActive());
        }

        user = userRepository.save(user);

        if (request.getRoles() != null) {
            // Bảo vệ: Admin không được tự ý thay đổi quyền của chính mình để tránh mất quyền truy cập
            String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            if (user.getUsername().equals(currentUsername)) {
                throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION, "Admin không thể tự thay đổi quyền của bản thân");
            }

            userRoleRepository.deleteAllByUser(user);
            User finalUser = user;
            List<UserRole> userRoles = request.getRoles().stream()
                    .map(roleCode -> {
                        Role role = roleRepository.findByCode(roleCode)
                                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
                        UserRole ur = UserRole.builder().user(finalUser).role(role).build();
                        ur.setIsActive(true);
                        return ur;
                    })
                    .collect(Collectors.toList());
            userRoleRepository.saveAll(userRoles);
        }

        return mapToUserResponse(user);
    }

    @Override
    @Transactional
    public void deleteUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        
        // Bảo vệ: Không được tự vô hiệu hóa bản thân
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if (user.getUsername().equals(currentUsername)) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION, "Không thể tự vô hiệu hóa tài khoản đang đăng nhập");
        }

        user.setIsActive(false); // Soft delete
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void resetPassword(UUID id, String newPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // --- Role Management ---

    @Override
    @Transactional(readOnly = true)
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(this::mapToRoleResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public RoleResponse getRoleById(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        return mapToRoleResponse(role);
    }

    @Override
    @Transactional
    public RoleResponse createRole(RoleCreateRequest request) {
        if (roleRepository.existsByCode(request.getCode())) {
            throw new AppException(ErrorCode.ROLE_EXISTED);
        }

        Role role = Role.builder()
                .code(request.getCode())
                .name(request.getName())
                .description(request.getDescription())
                .isSystem(false)
                .build();
        role.setIsActive(true);

        role = roleRepository.save(role);

        if (request.getPermissions() != null && !request.getPermissions().isEmpty()) {
            Role finalRole = role;
            List<RolePermission> rolePermissions = request.getPermissions().stream()
                    .map(permCode -> {
                        Permission permission = permissionRepository.findByCode(permCode)
                                .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOT_FOUND));
                        RolePermission rp = RolePermission.builder().role(finalRole).permission(permission).build();
                        rp.setIsActive(true);
                        return rp;
                    })
                    .collect(Collectors.toList());
            rolePermissionRepository.saveAll(rolePermissions);
        }

        return mapToRoleResponse(role);
    }

    @Override
    @Transactional
    public RoleResponse updateRole(UUID id, RoleCreateRequest request) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        role.setName(request.getName());
        role.setDescription(request.getDescription());

        role = roleRepository.save(role);

        if (request.getPermissions() != null) {
            rolePermissionRepository.deleteAllByRole(role);
            Role finalRole = role;
            List<RolePermission> rolePermissions = request.getPermissions().stream()
                    .map(permCode -> {
                        Permission permission = permissionRepository.findByCode(permCode)
                                .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOT_FOUND));
                        RolePermission rp = RolePermission.builder().role(finalRole).permission(permission).build();
                        rp.setIsActive(true);
                        return rp;
                    })
                    .collect(Collectors.toList());
            rolePermissionRepository.saveAll(rolePermissions);
        }

        return mapToRoleResponse(role);
    }

    @Override
    @Transactional
    public void deleteRole(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        if (role.getIsSystem()) {
            throw new RuntimeException("Cannot delete system role");
        }
        role.setIsActive(false);
        roleRepository.save(role);
    }

    // --- Permission Management ---

    @Override
    @Transactional(readOnly = true)
    public List<PermissionResponse> getAllPermissions() {
        return permissionRepository.findAll().stream()
                .map(this::mapToPermissionResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<GroupedPermissionResponse> getGroupedPermissions() {
        return permissionRepository.findAll().stream()
                .collect(Collectors.groupingBy(Permission::getModule))
                .entrySet().stream()
                .map(entry -> GroupedPermissionResponse.builder()
                        .module(entry.getKey())
                        .permissions(entry.getValue().stream()
                                .map(this::mapToPermissionResponse)
                                .collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList());
    }

    // --- Helpers ---

    private UserResponse mapToUserResponse(User user) {
        Set<String> roles = userRoleRepository.findAllByUser(user).stream()
                .map(ur -> ur.getRole().getCode())
                .collect(Collectors.toSet());

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .isActive(user.getIsActive())
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .roles(roles)
                .build();
    }

    private RoleResponse mapToRoleResponse(Role role) {
        Set<PermissionResponse> permissions = rolePermissionRepository.findAllByRole(role).stream()
                .map(rp -> mapToPermissionResponse(rp.getPermission()))
                .collect(Collectors.toSet());

        return RoleResponse.builder()
                .id(role.getId())
                .code(role.getCode())
                .name(role.getName())
                .description(role.getDescription())
                .isSystem(role.getIsSystem())
                .isActive(role.getIsActive())
                .permissions(permissions)
                .build();
    }

    private PermissionResponse mapToPermissionResponse(Permission permission) {
        return PermissionResponse.builder()
                .id(permission.getId())
                .code(permission.getCode())
                .name(permission.getName())
                .module(permission.getModule())
                .description(permission.getDescription())
                .build();
    }
}
