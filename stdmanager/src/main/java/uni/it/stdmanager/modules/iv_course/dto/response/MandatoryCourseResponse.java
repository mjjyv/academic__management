package uni.it.stdmanager.modules.iv_course.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@Builder
public class MandatoryCourseResponse {
    private UUID id;
    private String courseCode;
    private String courseName;
    private BigDecimal credits;
    private Integer semester;
    private Integer year;
    private String groupCode;
    private String note;
}
