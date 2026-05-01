package uni.it.stdmanager.modules.ii_student.service;

import uni.it.stdmanager.modules.ii_student.dto.response.DepartmentHierarchyResponse;
import uni.it.stdmanager.modules.ii_student.dto.response.StudentClassResponse;
import java.util.List;

public interface StudentClassService {
    List<StudentClassResponse> getAllClasses();
    List<DepartmentHierarchyResponse> getClassHierarchy();
}