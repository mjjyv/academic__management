package uni.it.stdmanager.modules.ii_student.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.modules.ii_student.dto.response.StudentClassResponse;
import uni.it.stdmanager.modules.ii_student.repository.StudentClassRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudentClassServiceImpl implements StudentClassService {

    private final StudentClassRepository studentClassRepository;

    @Override
    public List<StudentClassResponse> getAllClasses() {
        return studentClassRepository.findAll().stream()
                .map(studentClass -> StudentClassResponse.builder()
                        .id(studentClass.getId())
                        .classCode(studentClass.getClassCode())
                        .className(studentClass.getClassName())
                        .courseYear(studentClass.getCourseYear())
                        .majorName(studentClass.getMajor() != null ? studentClass.getMajor().getMajorName() : null)
                        .build())
                .collect(Collectors.toList());
    }
}