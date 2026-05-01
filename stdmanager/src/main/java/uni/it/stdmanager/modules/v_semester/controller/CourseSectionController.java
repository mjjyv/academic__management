package uni.it.stdmanager.modules.v_semester.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uni.it.stdmanager.core.dto.ApiResponse;
import uni.it.stdmanager.modules.v_semester.dto.response.CourseSectionDetailResponse;
import uni.it.stdmanager.modules.v_semester.service.CourseSectionService;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/course-sections")
@RequiredArgsConstructor
@Tag(name = "V. Semester Module", description = "API Quản lý Học kỳ và Lớp học phần")
public class CourseSectionController {

    private final CourseSectionService courseSectionService;

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GIAOVU', 'GIANGVIEN')")
    @Operation(summary = "Lấy chi tiết lớp học phần", description = "Trả về thông tin chi tiết lớp học phần và danh sách sinh viên đăng ký")
    public ApiResponse<CourseSectionDetailResponse> getSectionDetail(@PathVariable UUID id) {
        CourseSectionDetailResponse response = courseSectionService.getSectionDetail(id);
        return ApiResponse.success(response, "Lấy chi tiết lớp học phần thành công");
    }
}
