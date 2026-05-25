package uni.it.stdmanager.modules.ii_student.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentClassRequest {
    @NotBlank(message = "Mã lớp không được để trống")
    @Size(max = 20, message = "Mã lớp tối đa 20 ký tự")
    private String classCode;

    @NotBlank(message = "Tên lớp không được để trống")
    @Size(max = 100, message = "Tên lớp tối đa 100 ký tự")
    private String className;

    private String courseYear;

    @NotNull(message = "Chuyên ngành không được để trống")
    private UUID majorId;

    private UUID departmentId;
    private UUID advisorId;
}
