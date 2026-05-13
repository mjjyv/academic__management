package uni.it.stdmanager.modules.iv_course.service;

import uni.it.stdmanager.modules.iv_course.dto.request.TrainingProgramRequest;
import uni.it.stdmanager.modules.iv_course.dto.response.TrainingProgramResponse;

import java.util.List;
import java.util.UUID;

public interface TrainingProgramService {
    List<TrainingProgramResponse> getAllPrograms(UUID majorId);
    TrainingProgramResponse getProgramById(UUID id);
    TrainingProgramResponse createProgram(TrainingProgramRequest request);
    TrainingProgramResponse updateProgram(UUID id, TrainingProgramRequest request);
    void deleteProgram(UUID id);
    
    TrainingProgramResponse duplicateProgram(UUID sourceId, String newCode, String newName);
}
