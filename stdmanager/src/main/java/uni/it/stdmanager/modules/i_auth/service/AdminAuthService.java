package uni.it.stdmanager.modules.i_auth.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import uni.it.stdmanager.modules.i_auth.dto.admin.*;

import java.util.List;
import java.util.UUID;

public interface AdminAuthService {
    // User Management
    Page<UserResponse> getAllUsers(String search, Pageable pageable);
    UserResponse getUserById(UUID id);
    UserResponse createUser(UserCreateRequest request);
    UserResponse updateUser(UUID id, UserUpdateRequest request);
    void deleteUser(UUID id);
    void resetPassword(UUID id, String newPassword);

    // Role Management
    List<RoleResponse> getAllRoles();
    RoleResponse getRoleById(UUID id);
    RoleResponse createRole(RoleCreateRequest request);
    RoleResponse updateRole(UUID id, RoleCreateRequest request);
    void deleteRole(UUID id);

    // Permission Management
    List<PermissionResponse> getAllPermissions();
    List<GroupedPermissionResponse> getGroupedPermissions();
}
