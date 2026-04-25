// 1. Department.java (Module III - Giảng viên & Nhân sự)
package uni.it.stdmanager.modules.iii_lecturer.entity;

import jakarta.persistence.*;
import lombok.*;
import uni.it.stdmanager.core.entity.BaseEntity;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "departments")
public class Department extends BaseEntity {

    @Column(name = "department_code", nullable = false, unique = true, length = 20)
    private String departmentCode;

    @Column(name = "department_name", nullable = false, length = 150)
    private String departmentName;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "founding_date")
    private LocalDate foundingDate;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "email", length = 100)
    private String email;
}