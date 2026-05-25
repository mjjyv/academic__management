package uni.it.stdmanager.modules.iv_course.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.iv_course.dto.request.TrainingProgramRequest;
import uni.it.stdmanager.modules.iv_course.dto.response.TrainingProgramResponse;
import uni.it.stdmanager.modules.iv_course.service.TrainingProgramService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/training-programs")
@RequiredArgsConstructor
@Tag(name = "IV. Course Module", description = "API Quản lý Môn học và Chương trình đào tạo")
public class TrainingProgramController {

    private final TrainingProgramService trainingProgramService;

    @GetMapping
    @Operation(summary = "Lấy danh sách chương trình đào tạo", description = "Có thể lọc theo chuyên ngành")
    public ApiResponse<List<TrainingProgramResponse>> getAllPrograms(
            @RequestParam(required = false) UUID majorId) {
        return ApiResponse.success(trainingProgramService.getAllPrograms(majorId), "Lấy danh sách CTĐT thành công");
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết chương trình đào tạo")
    public ApiResponse<TrainingProgramResponse> getProgramById(@PathVariable UUID id) {
        return ApiResponse.success(trainingProgramService.getProgramById(id), "Lấy thông tin CTĐT thành công");
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "Tạo mới chương trình đào tạo")
    public ApiResponse<TrainingProgramResponse> createProgram(
            @Valid @RequestBody TrainingProgramRequest request) {
        return ApiResponse.success(trainingProgramService.createProgram(request), "Tạo CTĐT thành công");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "Cập nhật chương trình đào tạo")
    public ApiResponse<TrainingProgramResponse> updateProgram(
            @PathVariable UUID id,
            @Valid @RequestBody TrainingProgramRequest request) {
        return ApiResponse.success(trainingProgramService.updateProgram(id, request), "Cập nhật CTĐT thành công");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "Xóa chương trình đào tạo")
    public ApiResponse<Void> deleteProgram(@PathVariable UUID id) {
        trainingProgramService.deleteProgram(id);
        return ApiResponse.success(null, "Xóa CTĐT thành công");
    }

    @PostMapping("/{id}/duplicate")
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "Sao chép chương trình đào tạo", description = "Tạo bản sao mới của CTĐT kèm theo toàn bộ khung môn học")
    public ApiResponse<TrainingProgramResponse> duplicateProgram(
            @PathVariable UUID id,
            @RequestParam String newCode,
            @RequestParam String newName) {
        return ApiResponse.success(trainingProgramService.duplicateProgram(id, newCode, newName), "Sao chép CTĐT thành công");
    }
}
