package uni.it.stdmanager.modules.ii_student.dto.request;

import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentUpdateRequest {
    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;
    private String phone;
    private String address;
    private String currentAddress;
    private UUID classId;
    private UUID statusId;
}