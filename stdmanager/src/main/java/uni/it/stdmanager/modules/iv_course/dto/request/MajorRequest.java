package uni.it.stdmanager.modules.iv_course.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MajorRequest {
    @NotBlank(message = "Mã chuyên ngành không được để trống")
    @Size(max = 20, message = "Mã chuyên ngành tối đa 20 ký tự")
    private String majorCode;

    @NotBlank(message = "Tên chuyên ngành không được để trống")
    @Size(max = 255, message = "Tên chuyên ngành tối đa 255 ký tự")
    private String majorName;

    private String description;

    @NotNull(message = "Khoa không được để trống")
    private UUID departmentId;

    private LocalDate effectiveDate;
    private LocalDate expiryDate;
}
