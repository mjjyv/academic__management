package uni.it.stdmanager.modules.ix_tuition.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.ix_tuition.dto.request.TuitionFeeRequest;
import uni.it.stdmanager.modules.ix_tuition.entity.TuitionFee;
import uni.it.stdmanager.modules.ix_tuition.service.TuitionFeeService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tuition-fees")
@RequiredArgsConstructor
@Tag(name = "Tuition Fee Module", description = "Quản lý định mức học phí")
public class TuitionFeeController {

    private final TuitionFeeService tuitionFeeService;

    @GetMapping
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "Lấy danh sách định mức học phí")
    public ApiResponse<List<TuitionFee>> getAllTuitionFees() {
        return ApiResponse.success(tuitionFeeService.getAllTuitionFees(), "Lấy danh sách định mức thành công");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "Lấy chi tiết định mức học phí")
    public ApiResponse<TuitionFee> getById(@PathVariable UUID id) {
        return ApiResponse.success(tuitionFeeService.getTuitionFeeById(id), "Lấy chi tiết định mức thành công");
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "Tạo định mức học phí mới")
    public ApiResponse<TuitionFee> createTuitionFee(@RequestBody TuitionFeeRequest request) {
        return ApiResponse.success(tuitionFeeService.createTuitionFee(request), "Tạo định mức thành công");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "Cập nhật định mức học phí")
    public ApiResponse<TuitionFee> updateTuitionFee(@PathVariable UUID id, @RequestBody TuitionFeeRequest request) {
        return ApiResponse.success(tuitionFeeService.updateTuitionFee(id, request), "Cập nhật định mức thành công");
    }

    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "Bật/Tắt định mức học phí")
    public ApiResponse<Void> toggleStatus(@PathVariable UUID id) {
        tuitionFeeService.toggleStatus(id);
        return ApiResponse.success(null, "Cập nhật trạng thái thành công");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "Xóa định mức học phí")
    public ApiResponse<Void> deleteTuitionFee(@PathVariable UUID id) {
        tuitionFeeService.deleteTuitionFee(id);
        return ApiResponse.success(null, "Xóa định mức thành công");
    }
}
