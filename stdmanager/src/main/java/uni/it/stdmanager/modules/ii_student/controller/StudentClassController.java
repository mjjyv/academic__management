package uni.it.stdmanager.modules.ii_student.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.ii_student.dto.response.DepartmentHierarchyResponse;
import uni.it.stdmanager.modules.ii_student.dto.response.StudentClassResponse;
import uni.it.stdmanager.modules.ii_student.service.StudentClassService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/student-classes")
@RequiredArgsConstructor
@Tag(name = "II. Student Module", description = "API Quản lý Hồ sơ Sinh viên và Lớp hành chính")
public class StudentClassController {

    private final StudentClassService studentClassService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU', 'GIANGVIEN')")
    @Operation(summary = "5. Lấy danh mục lớp", description = "Trả về danh sách toàn bộ lớp hành chính (Dùng cho Dropdown/Select)")
    public ApiResponse<List<StudentClassResponse>> getAllClasses() {
        List<StudentClassResponse> response = studentClassService.getAllClasses();
        return ApiResponse.success(response, "Lấy danh sách lớp thành công");
    }

    @GetMapping("/hierarchy")
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU', 'GIANGVIEN')")
    @Operation(summary = "6. Lấy cây danh mục lớp", description = "Trả về danh sách lớp được phân loại theo Khoa -> Ngành -> Lớp")
    public ApiResponse<List<DepartmentHierarchyResponse>> getClassHierarchy() {
        List<DepartmentHierarchyResponse> response = studentClassService.getClassHierarchy();
        return ApiResponse.success(response, "Lấy cấu trúc cây danh mục lớp thành công");
    }
}