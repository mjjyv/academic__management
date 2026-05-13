package uni.it.stdmanager.modules.iv_course.service;

import uni.it.stdmanager.modules.iv_course.dto.request.MajorRequest;
import uni.it.stdmanager.modules.iv_course.dto.response.MajorResponse;

import java.util.List;
import java.util.UUID;

public interface MajorService {
    List<MajorResponse> getAllMajors(UUID departmentId);
    MajorResponse getMajorById(UUID id);
    MajorResponse createMajor(MajorRequest request);
    MajorResponse updateMajor(UUID id, MajorRequest request);
    void deleteMajor(UUID id);
}
