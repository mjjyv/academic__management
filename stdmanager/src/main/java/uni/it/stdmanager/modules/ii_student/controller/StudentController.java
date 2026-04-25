package uni.it.stdmanager.modules.ii_student.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.ii_student.dto.request.StudentCreationRequest;
import uni.it.stdmanager.modules.ii_student.dto.request.StudentSearchRequest;
import uni.it.stdmanager.modules.ii_student.dto.request.StudentUpdateRequest;
import uni.it.stdmanager.modules.ii_student.dto.response.StudentResponse;
import uni.it.stdmanager.modules.ii_student.service.StudentService;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
@Tag(name = "II. Student Module", description = "API Quản lý Hồ sơ Sinh viên")
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU', 'GIANGVIEN')")
    @Operation(summary = "1. Tìm kiếm và phân trang", description = "Lấy danh sách sinh viên có lọc theo từ khóa, lớp, trạng thái")
    public ApiResponse<Page<StudentResponse>> searchStudents(@ModelAttribute StudentSearchRequest request) {
        Page<StudentResponse> response = studentService.searchStudents(request);
        return ApiResponse.success(response, "Lấy danh sách sinh viên thành công");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU', 'GIANGVIEN', 'SINHVIEN')")
    @Operation(summary = "2. Xem chi tiết", description = "Lấy thông tin chi tiết của một sinh viên bằng ID")
    public ApiResponse<StudentResponse> getStudentById(@PathVariable UUID id) {
        StudentResponse response = studentService.getStudentById(id);
        return ApiResponse.success(response, "Lấy thông tin sinh viên thành công");
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU')")
    @Operation(summary = "3. Thêm mới sinh viên", description = "Tạo hồ sơ sinh viên và tự động cấp tài khoản đăng nhập")
    public ApiResponse<StudentResponse> createStudent(@Valid @RequestBody StudentCreationRequest request) {
        StudentResponse response = studentService.createStudent(request);
        return ApiResponse.success(response, "Thêm mới sinh viên thành công");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU')")
    @Operation(summary = "4. Cập nhật hồ sơ", description = "Chỉnh sửa thông tin cá nhân hoặc chuyển lớp, đổi trạng thái")
    public ApiResponse<StudentResponse> updateStudent(
            @PathVariable UUID id,
            @Valid @RequestBody StudentUpdateRequest request) {
        StudentResponse response = studentService.updateStudent(id, request);
        return ApiResponse.success(response, "Cập nhật thông tin sinh viên thành công");
    }
}