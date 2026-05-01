package uni.it.stdmanager.modules.v_semester.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.v_semester.dto.response.SemesterResponse;
import uni.it.stdmanager.modules.v_semester.service.SemesterService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/semesters")
@RequiredArgsConstructor
@Tag(name = "V. Academic Module", description = "API Quản lý Học kỳ và Lớp học phần")
public class SemesterController {

    private final SemesterService semesterService;

    @GetMapping
    @Operation(summary = "1. Danh sách học kỳ", description = "Lấy toàn bộ danh sách các học kỳ")
    public ApiResponse<List<SemesterResponse>> getAllSemesters() {
        return ApiResponse.success(semesterService.getAllSemesters(), "Lấy danh sách học kỳ thành công");
    }

    @GetMapping("/active")
    @Operation(summary = "2. Học kỳ hiện tại", description = "Lấy thông tin học kỳ đang kích hoạt")
    public ApiResponse<SemesterResponse> getActiveSemester() {
        return ApiResponse.success(semesterService.getActiveSemester(), "Lấy học kỳ hiện tại thành công");
    }

    @GetMapping("/{id}")
    @Operation(summary = "3. Chi tiết học kỳ", description = "Lấy thông tin chi tiết học kỳ theo ID")
    public ApiResponse<SemesterResponse> getSemesterById(@PathVariable UUID id) {
        return ApiResponse.success(semesterService.getSemesterById(id), "Lấy thông tin học kỳ thành công");
    }
}
