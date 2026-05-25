package uni.it.stdmanager.modules.i_auth.dto.admin;

import lombok.*;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleResponse {
    private UUID id;
    private String code;
    private String name;
    private String description;
    private Boolean isSystem;
    private Boolean isActive;
    private Set<PermissionResponse> permissions;
}
