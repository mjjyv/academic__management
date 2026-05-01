package uni.it.stdmanager.modules.v_semester.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.modules.v_semester.dto.response.SemesterResponse;
import uni.it.stdmanager.modules.v_semester.entity.Semester;
import uni.it.stdmanager.modules.v_semester.repository.SemesterRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SemesterServiceImpl implements SemesterService {

    private final SemesterRepository semesterRepository;

    @Override
    public List<SemesterResponse> getAllSemesters() {
        return semesterRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SemesterResponse getSemesterById(UUID id) {
        Semester semester = semesterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học kỳ với ID: " + id));
        return mapToResponse(semester);
    }

    @Override
    public SemesterResponse getActiveSemester() {
        // Giả sử lấy học kỳ có is_active = true đầu tiên. 
        // Trong thực tế có thể có logic phức tạp hơn như dựa vào ngày hiện tại.
        return semesterRepository.findAll().stream()
                .filter(Semester::getIsActive)
                .findFirst()
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Không có học kỳ nào đang kích hoạt"));
    }

    private SemesterResponse mapToResponse(Semester semester) {
        return SemesterResponse.builder()
                .id(semester.getId())
                .semesterCode(semester.getSemesterCode())
                .semesterName(semester.getSemesterName())
                .academicYear(semester.getAcademicYear())
                .startDate(semester.getStartDate())
                .endDate(semester.getEndDate())
                .isActive(semester.getIsActive())
                .build();
    }
}
