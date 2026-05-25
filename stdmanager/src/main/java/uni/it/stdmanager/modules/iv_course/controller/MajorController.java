package uni.it.stdmanager.modules.iv_course.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.iv_course.dto.request.MajorRequest;
import uni.it.stdmanager.modules.iv_course.dto.response.MajorResponse;
import uni.it.stdmanager.modules.iv_course.service.MajorService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/majors")
@RequiredArgsConstructor
@Tag(name = "IV. Course Module", description = "API Quản lý Môn học và Chương trình đào tạo")
public class MajorController {

    private final MajorService majorService;

    @GetMapping
    @Operation(summary = "Lấy danh sách chuyên ngành", description = "Lấy toàn bộ danh sách chuyên ngành, có thể lọc theo khoa")
    public ApiResponse<List<MajorResponse>> getAllMajors(
            @RequestParam(required = false) UUID departmentId) {
        return ApiResponse.success(majorService.getAllMajors(departmentId), "Lấy danh sách chuyên ngành thành công");
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết chuyên ngành")
    public ApiResponse<MajorResponse> getMajorById(@PathVariable UUID id) {
        return ApiResponse.success(majorService.getMajorById(id), "Lấy thông tin chuyên ngành thành công");
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "Tạo mới chuyên ngành")
    public ApiResponse<MajorResponse> createMajor(@Valid @RequestBody MajorRequest request) {
        return ApiResponse.success(majorService.createMajor(request), "Tạo chuyên ngành thành công");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "Cập nhật chuyên ngành")
    public ApiResponse<MajorResponse> updateMajor(
            @PathVariable UUID id,
            @Valid @RequestBody MajorRequest request) {
        return ApiResponse.success(majorService.updateMajor(id, request), "Cập nhật chuyên ngành thành công");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "Xóa chuyên ngành")
    public ApiResponse<Void> deleteMajor(@PathVariable UUID id) {
        majorService.deleteMajor(id);
        return ApiResponse.success(null, "Xóa chuyên ngành thành công");
    }
}
