package uni.it.stdmanager.modules.iv_course.service;

import uni.it.stdmanager.modules.iv_course.dto.request.TrainingProgramCourseRequest;
import uni.it.stdmanager.modules.iv_course.dto.response.TrainingProgramCourseResponse;

import java.util.List;
import java.util.UUID;

public interface TrainingProgramCourseService {
    List<TrainingProgramCourseResponse> getCoursesByProgram(UUID trainingProgramId);
    TrainingProgramCourseResponse addCourseToProgram(TrainingProgramCourseRequest request);
    TrainingProgramCourseResponse updateProgramCourse(UUID id, TrainingProgramCourseRequest request);
    void removeCourseFromProgram(UUID id);
}
