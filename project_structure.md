.
├── brandGuidelines.md
├── db
│   └── project-structure.md
├── docker
│   └── docker-compose.yml
├── frontend
│   ├── src
│   │   ├── api
│   │   │   ├── authApi.js
│   │   │   ├── axiosClient.js
│   │   │   ├── courseApi.js
│   │   │   ├── departmentApi.js
│   │   │   ├── financeApi.js
│   │   │   ├── gradeApi.js
│   │   │   ├── lecturerApi.js
│   │   │   ├── profileApi.js
│   │   │   ├── registrationApi.js
│   │   │   ├── scheduleApi.js
│   │   │   ├── semesterApi.js
│   │   │   └── studentApi.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── components
│   │   │   ├── ClassDetailModal.jsx
│   │   │   ├── CourseFormModal.jsx
│   │   │   ├── LecturerDetailModal.jsx
│   │   │   ├── LecturerFormModal.jsx
│   │   │   ├── ProfileEditModal.jsx
│   │   │   ├── ScheduleFormModal.jsx
│   │   │   ├── SectionDetailModal.jsx
│   │   │   ├── SectionFormModal.jsx
│   │   │   ├── SemesterFormModal.jsx
│   │   │   ├── StudentDetailModal.jsx
│   │   │   ├── StudentFormModal.jsx
│   │   │   └── StudentStatusModal.jsx
│   │   ├── constants
│   │   │   ├── dashboardConfig.js
│   │   │   └── menuConfig.js
│   │   ├── features
│   │   │   └── registration
│   │   │       └── components
│   │   │           └── RegistrationPeriodModal.jsx
│   │   ├── index.css
│   │   ├── layouts
│   │   │   ├── MainLayout.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── academic
│   │   │   ├── finance
│   │   │   ├── grade
│   │   │   ├── registration
│   │   │   └── students
│   │   ├── routes
│   │   └── store
│   │       ├── useAuthStore.js
│   │       ├── useFinanceStore.js
│   │       ├── useGradeStore.js
│   │       ├── useRegistrationStore.js
│   │       ├── useScheduleStore.js
│   │       └── useSemesterStore.js
└── stdmanager
    └── src
        ├── main
        │   ├── java
        │   │   └── uni
        │   │       └── it
        │   │           └── stdmanager
        │   │               ├── core
        │   │               │   ├── config
        │   │               │   │   ├── AuditorAwareImpl.java
        │   │               │   │   ├── AuthConfig.java
        │   │               │   │   ├── JpaAuditingConfig.java
        │   │               │   │   ├── OpenApiConfig.java
        │   │               │   │   ├── SecurityConfig.java
        │   │               │   │   └── WebMvcConfig.java
        │   │               │   ├── dto
        │   │               │   │   ├── ApiResponse.java
        │   │               │   │   ├── ErrorDetail.java
        │   │               │   │   └── PageResponse.java
        │   │               │   ├── entity
        │   │               │   │   └── BaseEntity.java
        │   │               │   ├── exception
        │   │               │   │   ├── AppException.java
        │   │               │   │   ├── ErrorCode.java
        │   │               │   │   ├── GlobalExceptionHandler.java
        │   │               │   │   └── ResourceNotFoundException.java
        │   │               │   └── security
        │   │               │       ├── JwtAuthenticationFilter.java
        │   │               │       ├── JwtService.java
        │   │               │       ├── SecurityAuditInterceptor.java
        │   │               │       └── SecurityUtils.java
        │   │               ├── modules
        │   │               │   ├── i_auth
        │   │               │   │   ├── controller
        │   │               │   │   ├── dto
        │   │               │   │   │   ├── request
        │   │               │   │   │   └── response
        │   │               │   │   ├── entity
        │   │               │   │   ├── repository
        │   │               │   │   └── service
        │   │               │   ├── iii_lecturer
        │   │               │   ├── ii_student
        │   │               │   ├── iv_course
        │   │               │   ├── ix_tuition
        │   │               │   ├── viii_grade
        │   │               │   ├── vii_schedule
        │   │               │   ├── vi_registration
        │   │               │   └── v_semester
        │   │               └── StdmanagerApplication.java
        │   └── resources
        │       ├── application.yaml
        │       ├── db
        │       │   └── migration
        │       └── static