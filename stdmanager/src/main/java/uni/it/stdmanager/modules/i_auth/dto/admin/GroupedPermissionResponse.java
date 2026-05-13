package uni.it.stdmanager.modules.i_auth.dto.admin;

import lombok.*;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupedPermissionResponse {
    private String module;
    private List<PermissionResponse> permissions;
}
