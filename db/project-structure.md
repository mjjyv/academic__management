uni__it__web2/
├── frontend/
│   └── src/
│       ├── api
│       ├── App.jsx
│       ├── components
│       ├── features
│       ├── index.css
│       ├── layouts
│       │   └── MainLayout.jsx
│       ├── main.jsx
│       ├── pages
│       │   ├── profile
│       │   │   └── ProfilePage.jsx
│       │   └── students
│       │       ├── components
│       ├── routes
│       ├── store
│       └── utils
└── stdmanager
    ├── pom.xml
    └── src
        └── main
            ├── java
            │   └── uni
            │       └── it
            │           └── stdmanager
            │               ├── core
            │               │   ├── config
            │               │   │   ├── AuditorAwareImpl.java
            │               │   │   ├── AuthConfig.java
            │               │   │   ├── JpaAuditingConfig.java
            │               │   │   ├── OpenApiConfig.java
            │               │   │   └── SecurityConfig.java
            │               │   ├── dto
            │               │   │   └── ApiResponse.java
            │               │   ├── entity
            │               │   │   └── BaseEntity.java
            │               │   ├── exception
            │               │   │   └── GlobalExceptionHandler.java
            │               │   └── security
            │               ├── modules
            │               │   ├── i_auth
            │               │   │   ├── controller
            │               │   │   ├── dto
            │               │   │   ├── entity
            │               │   │   ├── repository
            │               │   │   └── service
            │               │   ├── iii_lecturer
            │               │   ├── ii_student
            │               │   │   ├── controller
            │               │   │   ├── dto
            │               │   │   ├── entity
            │               │   │   ├── repository
            │               │   │   └── service
            │               │   ├── iv_course
            │               │   ├── ix_tuition
            │               │   ├── viii_grade
            │               │   ├── vii_schedule
            │               │   ├── vi_registration
            │               │   ├── v_semester
            │               │   ├── x_exam
            │               │   ├── xi_graduation
            │               │   ├── xii_notification
            │               │   └── xiv_email
            │               └── StdmanagerApplication.java
            └── resources
                ├── application.yaml
                ├── db
                │   └── migration
                │       ├── V10__Init_Exam_Group_X.sql
                │       ├── V11__Init_Graduation_Group_XI.sql
                │       ├── V12__Init_Notification_Group_XII.sql
                │       ├── V13__Init_Email_Group_XIV.sql
                │       ├── V14__Init-User.sql
                │       ├── V1__Init_Auth_Group_I.sql
                │       ├── V2__Init_Lecturer_Group_III.sql
                │       ├── V3__Init_Student_Group_II.sql
                │       ├── V4__Init_Course_Group_IV.sql
                │       ├── V5__Init_Semester_Group_V.sql
                │       ├── V6__Init_Registration_Group_VI.sql
                │       ├── V7__Init_Schedule_Group_VII.sql
                │       ├── V8__Init_Grade_Group_VIII.sql
                │       └── V9__Init_Tuition_Group_IX.sql

58 directories, 63 files