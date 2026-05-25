package uni.it.stdmanager.modules.ii_student.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.ii_student.dto.request.StudentClassRequest;
import uni.it.stdmanager.modules.ii_student.dto.response.ClassCourseHistoryResponse;
import uni.it.stdmanager.modules.ii_student.dto.response.DepartmentHierarchyResponse;
import uni.it.stdmanager.modules.ii_student.dto.response.StudentClassDetailResponse;
import uni.it.stdmanager.modules.ii_student.dto.response.StudentClassResponse;
import uni.it.stdmanager.modules.ii_student.service.StudentClassService;

import java.util.List;
import java.util.UUID;
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

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU', 'GIANGVIEN')")
    @Operation(summary = "7. Lấy chi tiết lớp", description = "Trả về thông tin chi tiết lớp và danh sách sinh viên")
    public ApiResponse<StudentClassDetailResponse> getClassDetail(@PathVariable UUID id) {
        StudentClassDetailResponse response = studentClassService.getClassDetail(id);
        return ApiResponse.success(response, "Lấy chi tiết lớp thành công");
    }

    @GetMapping("/{id}/course-history")
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU', 'GIANGVIEN')")
    @Operation(summary = "8. Lấy lịch sử học phần của lớp", description = "Trả về danh sách các lớp học phần mà sinh viên trong lớp này đã/đang tham gia")
    public ApiResponse<List<ClassCourseHistoryResponse>> getClassCourseHistory(@PathVariable UUID id) {
        List<ClassCourseHistoryResponse> response = studentClassService.getClassCourseHistory(id);
        return ApiResponse.success(response, "Lấy lịch sử học phần lớp thành công");
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU')")
    @Operation(summary = "9. Tạo lớp hành chính mới", description = "Chỉ dành cho Giáo vụ hoặc Admin")
    public ApiResponse<StudentClassResponse> createClass(@Valid @RequestBody StudentClassRequest request) {
        return ApiResponse.success(studentClassService.createClass(request), "Tạo lớp hành chính thành công");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU')")
    @Operation(summary = "10. Cập nhật lớp hành chính", description = "Cập nhật thông tin lớp hành chính theo ID")
    public ApiResponse<StudentClassResponse> updateClass(@PathVariable UUID id, @Valid @RequestBody StudentClassRequest request) {
        return ApiResponse.success(studentClassService.updateClass(id, request), "Cập nhật lớp hành chính thành công");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU')")
    @Operation(summary = "11. Xóa lớp hành chính", description = "Xóa lớp hành chính (Lưu ý: Chỉ xóa được nếu lớp chưa có sinh viên)")
    public ApiResponse<Void> deleteClass(@PathVariable UUID id) {
        studentClassService.deleteClass(id);
        return ApiResponse.success(null, "Xóa lớp hành chính thành công");
    }

    @PostMapping("/{id}/assign-program/{programId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU')")
    @Operation(summary = "12. Gán CTĐT cho cả lớp", description = "Gán chương trình đào tạo cho toàn bộ sinh viên trong lớp")
    public ApiResponse<Void> assignProgram(@PathVariable UUID id, @PathVariable UUID programId) {
        studentClassService.assignProgramToClass(id, programId);
        return ApiResponse.success(null, "Gán chương trình đào tạo thành công");
    }
}