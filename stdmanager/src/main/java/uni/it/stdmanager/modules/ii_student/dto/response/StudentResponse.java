package uni.it.stdmanager.modules.ii_student.dto.response;

import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponse {
    private UUID id;
    private String studentCode;
    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;
    private String email;
    private String phone;
    private String address;

    // Thông tin định danh liên kết
    private String className;
    private String majorName;
    private String departmentName;
    private String statusName;
    private String statusCode;
}