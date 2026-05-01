package uni.it.stdmanager.modules.v_semester.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrolledStudentResponse {
    private UUID id;
    private String studentCode;
    private String fullName;
    private String className;
    private LocalDateTime registeredAt;
    private Integer registrationType;
    private Boolean isPaid;
}
