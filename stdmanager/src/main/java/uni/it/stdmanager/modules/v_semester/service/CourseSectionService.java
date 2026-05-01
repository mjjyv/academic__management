package uni.it.stdmanager.modules.v_semester.service;

import uni.it.stdmanager.modules.v_semester.dto.response.CourseSectionDetailResponse;
import java.util.UUID;

public interface CourseSectionService {
    CourseSectionDetailResponse getSectionDetail(UUID id);
}
