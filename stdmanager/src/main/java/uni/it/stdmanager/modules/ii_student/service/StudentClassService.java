package uni.it.stdmanager.modules.ii_student.service;

import uni.it.stdmanager.modules.ii_student.dto.request.StudentClassRequest;
import uni.it.stdmanager.modules.ii_student.dto.response.ClassCourseHistoryResponse;
import uni.it.stdmanager.modules.ii_student.dto.response.DepartmentHierarchyResponse;
import uni.it.stdmanager.modules.ii_student.dto.response.StudentClassDetailResponse;
import uni.it.stdmanager.modules.ii_student.dto.response.StudentClassResponse;
import java.util.List;
import java.util.UUID;

public interface StudentClassService {
    List<StudentClassResponse> getAllClasses();
    List<DepartmentHierarchyResponse> getClassHierarchy();
    StudentClassDetailResponse getClassDetail(UUID id);
    List<ClassCourseHistoryResponse> getClassCourseHistory(UUID classId);
    
    StudentClassResponse createClass(StudentClassRequest request);
    StudentClassResponse updateClass(UUID id, StudentClassRequest request);
    void deleteClass(UUID id);
    
    void assignProgramToClass(UUID classId, UUID programId);
}