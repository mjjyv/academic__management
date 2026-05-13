package uni.it.stdmanager.modules.i_auth.dto.admin;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleCreateRequest {
    @NotBlank(message = "Mã vai trò không được để trống")
    private String code;

    @NotBlank(message = "Tên vai trò không được để trống")
    private String name;

    private String description;

    private Set<String> permissions;
}
