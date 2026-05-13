package uni.it.stdmanager.modules.i_auth.dto.admin;

import lombok.*;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PermissionResponse {
    private UUID id;
    private String code;
    private String name;
    private String module;
    private String description;
}
