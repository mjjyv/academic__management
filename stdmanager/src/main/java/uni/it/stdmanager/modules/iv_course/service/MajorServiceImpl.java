package uni.it.stdmanager.modules.iv_course.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.modules.iii_lecturer.entity.Department;
import uni.it.stdmanager.modules.iii_lecturer.repository.DepartmentRepository;
import uni.it.stdmanager.modules.iv_course.dto.request.MajorRequest;
import uni.it.stdmanager.modules.iv_course.dto.response.MajorResponse;
import uni.it.stdmanager.modules.iv_course.entity.Major;
import uni.it.stdmanager.modules.iv_course.repository.MajorRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MajorServiceImpl implements MajorService {

    private final MajorRepository majorRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    public List<MajorResponse> getAllMajors(UUID departmentId) {
        List<Major> majors;
        if (departmentId != null) {
            majors = majorRepository.findAllByDepartmentId(departmentId);
        } else {
            majors = majorRepository.findAll();
        }
        return majors.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MajorResponse getMajorById(UUID id) {
        Major major = majorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyên ngành với ID: " + id));
        return mapToResponse(major);
    }

    @Override
    @Transactional
    public MajorResponse createMajor(MajorRequest request) {
        if (majorRepository.findByMajorCode(request.getMajorCode()).isPresent()) {
            throw new RuntimeException("Mã chuyên ngành đã tồn tại: " + request.getMajorCode());
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa với ID: " + request.getDepartmentId()));

        Major major = Major.builder()
                .majorCode(request.getMajorCode())
                .majorName(request.getMajorName())
                .description(request.getDescription())
                .department(department)
                .effectiveDate(request.getEffectiveDate())
                .expiry_date(request.getExpiryDate()) // Note: field name in entity is expiry_date
                .build();

        return mapToResponse(majorRepository.save(major));
    }

    @Override
    @Transactional
    public MajorResponse updateMajor(UUID id, MajorRequest request) {
        Major major = majorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyên ngành với ID: " + id));

        if (!major.getMajorCode().equals(request.getMajorCode()) && 
            majorRepository.findByMajorCode(request.getMajorCode()).isPresent()) {
            throw new RuntimeException("Mã chuyên ngành đã tồn tại: " + request.getMajorCode());
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa với ID: " + request.getDepartmentId()));

        major.setMajorCode(request.getMajorCode());
        major.setMajorName(request.getMajorName());
        major.setDescription(request.getDescription());
        major.setDepartment(department);
        major.setEffectiveDate(request.getEffectiveDate());
        major.setExpiry_date(request.getExpiryDate());

        return mapToResponse(majorRepository.save(major));
    }

    @Override
    @Transactional
    public void deleteMajor(UUID id) {
        Major major = majorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyên ngành với ID: " + id));
        majorRepository.delete(major);
    }

    private MajorResponse mapToResponse(Major major) {
        return MajorResponse.builder()
                .id(major.getId())
                .majorCode(major.getMajorCode())
                .majorName(major.getMajorName())
                .departmentName(major.getDepartment() != null ? major.getDepartment().getDepartmentName() : null)
                .description(major.getDescription())
                .build();
    }
}
