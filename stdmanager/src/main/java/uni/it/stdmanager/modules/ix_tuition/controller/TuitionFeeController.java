package uni.it.stdmanager.modules.ix_tuition.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.ix_tuition.entity.TuitionFee;
import uni.it.stdmanager.modules.ix_tuition.repository.TuitionFeeRepository;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tuition-fees")
@RequiredArgsConstructor
@Tag(name = "Tuition Fee Module", description = "Quản lý định mức học phí")
public class TuitionFeeController {

    private final TuitionFeeRepository tuitionFeeRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "Lấy danh sách định mức học phí")
    public ApiResponse<List<TuitionFee>> getAllTuitionFees() {
        return ApiResponse.success(tuitionFeeRepository.findAll(), "Lấy danh sách định mức thành công");
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "Tạo định mức học phí mới")
    public ApiResponse<TuitionFee> createTuitionFee(@RequestBody TuitionFee tuitionFee) {
        return ApiResponse.success(tuitionFeeRepository.save(tuitionFee), "Tạo định mức thành công");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('GIAOVU', 'ADMIN')")
    @Operation(summary = "Cập nhật định mức học phí")
    public ApiResponse<TuitionFee> updateTuitionFee(@PathVariable UUID id, @RequestBody TuitionFee tuitionFee) {
        tuitionFee.setId(id);
        return ApiResponse.success(tuitionFeeRepository.save(tuitionFee), "Cập nhật định mức thành công");
    }
}
