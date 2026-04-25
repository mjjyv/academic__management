// 2. Major.java (Module IV - Học thuật & Đào tạo)
package uni.it.stdmanager.modules.iv_course.entity;

import jakarta.persistence.*;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;
import uni.it.stdmanager.modules.iii_lecturer.entity.Department;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "majors")
public class Major extends BaseEntity {

    @Column(name = "major_code", nullable = false, unique = true, length = 20)
    private String majorCode;

    @Column(name = "major_name", nullable = false, length = 150)
    private String majorName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "description", length = 500)
    private String description;
}