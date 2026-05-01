package uni.it.stdmanager.modules.ii_student.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.modules.ii_student.dto.response.DepartmentHierarchyResponse;
import uni.it.stdmanager.modules.ii_student.dto.response.MajorHierarchyResponse;
import uni.it.stdmanager.modules.ii_student.dto.response.StudentClassResponse;
import uni.it.stdmanager.modules.ii_student.entity.StudentClass;
import uni.it.stdmanager.modules.ii_student.repository.StudentClassRepository;
import uni.it.stdmanager.modules.iii_lecturer.entity.Department;
import uni.it.stdmanager.modules.iv_course.entity.Major;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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

    @Override
    public List<DepartmentHierarchyResponse> getClassHierarchy() {
        List<StudentClass> allClasses = studentClassRepository.findAll();

        // Nhóm theo Department
        Map<Department, Map<Major, List<StudentClass>>> hierarchy = allClasses.stream()
                .filter(c -> c.getDepartment() != null && c.getMajor() != null)
                .collect(Collectors.groupingBy(
                        StudentClass::getDepartment,
                        Collectors.groupingBy(StudentClass::getMajor)
                ));

        return hierarchy.entrySet().stream()
                .map(deptEntry -> {
                    Department dept = deptEntry.getKey();
                    Map<Major, List<StudentClass>> majorMap = deptEntry.getValue();

                    List<MajorHierarchyResponse> majors = majorMap.entrySet().stream()
                            .map(majorEntry -> {
                                Major major = majorEntry.getKey();
                                List<StudentClass> classes = majorEntry.getValue();

                                return MajorHierarchyResponse.builder()
                                        .id(major.getId())
                                        .majorName(major.getMajorName())
                                        .majorCode(major.getMajorCode())
                                        .classes(classes.stream()
                                                .map(this::mapToResponse)
                                                .collect(Collectors.toList()))
                                        .build();
                            })
                            .collect(Collectors.toList());

                    return DepartmentHierarchyResponse.builder()
                            .id(dept.getId())
                            .departmentName(dept.getDepartmentName())
                            .departmentCode(dept.getCode())
                            .majors(majors)
                            .build();
                })
                .collect(Collectors.toList());
    }

    private StudentClassResponse mapToResponse(StudentClass studentClass) {
        return StudentClassResponse.builder()
                .id(studentClass.getId())
                .classCode(studentClass.getClassCode())
                .className(studentClass.getClassName())
                .courseYear(studentClass.getCourseYear())
                .majorName(studentClass.getMajor() != null ? studentClass.getMajor().getMajorName() : null)
                .build();
    }
}