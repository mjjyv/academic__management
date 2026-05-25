package uni.it.stdmanager.modules.vii_schedule.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uni.it.stdmanager.core.exception.AppException;
import uni.it.stdmanager.core.exception.ErrorCode;
import uni.it.stdmanager.modules.ii_student.repository.StudentRepository;
import uni.it.stdmanager.modules.iii_lecturer.entity.Employee;
import uni.it.stdmanager.modules.iii_lecturer.repository.EmployeeRepository;
import uni.it.stdmanager.modules.v_semester.entity.CourseSection;
import uni.it.stdmanager.modules.v_semester.repository.CourseSectionRepository;
import uni.it.stdmanager.modules.vii_schedule.dto.request.ScheduleRequest;
import uni.it.stdmanager.modules.vii_schedule.dto.response.ScheduleResponse;
import uni.it.stdmanager.modules.vii_schedule.entity.Room;
import uni.it.stdmanager.modules.vii_schedule.entity.Schedule;
import uni.it.stdmanager.modules.vii_schedule.repository.RoomRepository;
import uni.it.stdmanager.modules.vii_schedule.repository.ScheduleRepository;
import uni.it.stdmanager.modules.vii_schedule.service.ScheduleService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScheduleServiceImpl implements ScheduleService {

        private final ScheduleRepository scheduleRepository;
        private final CourseSectionRepository courseSectionRepository;
        private final EmployeeRepository employeeRepository;
        private final StudentRepository studentRepository;
        private final RoomRepository roomRepository;

        @Override
        public List<ScheduleResponse> getSchedulesBySection(UUID sectionId) {
                return scheduleRepository.findAllByCourseSectionId(sectionId).stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public List<ScheduleResponse> getStudentSchedule(UUID userId) {
                uni.it.stdmanager.modules.ii_student.entity.Student student = studentRepository.findByUserId(userId)
                                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
                return scheduleRepository.findCurrentSchedulesByStudentId(student.getId()).stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public List<ScheduleResponse> getLecturerSchedule(UUID userId) {
                Employee lecturer = employeeRepository.findByUserId(userId)
                                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
                return scheduleRepository.findCurrentSchedulesByLecturerId(lecturer.getId()).stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public List<ScheduleResponse> getDepartmentSchedule(UUID departmentId) {
                return scheduleRepository.findCurrentSchedulesByDepartmentId(departmentId).stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public List<ScheduleResponse> getSchedulesByClass(UUID classId) {
                return scheduleRepository.findSchedulesByClassId(classId).stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        @Override
        @Transactional
        public ScheduleResponse createSchedule(ScheduleRequest request) {
                CourseSection section = courseSectionRepository.findById(request.getCourseSectionId())
                                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));

                Employee lecturer = null;
                if (request.getLecturerId() != null) {
                        lecturer = employeeRepository.findById(request.getLecturerId())
                                        .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
                }

                Room room = null;
                if (request.getRoomId() != null) {
                        room = roomRepository.findById(request.getRoomId())
                                        .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
                }

                // Logic check conflict: Same room/lecturer, same day, overlapping periods
                checkConflict(null, request);

                Schedule schedule = Schedule.builder()
                                .courseSection(section)
                                .lecturer(lecturer)
                                .room(room)
                                .dayOfWeek(request.getDayOfWeek())
                                .date(request.getDate())
                                .shift(request.getShift())
                                .startPeriod(request.getStartPeriod())
                                .endPeriod(request.getEndPeriod())
                                .startDate(request.getStartDate())
                                .endDate(request.getEndDate())
                                .mode(request.getMode())
                                .note(request.getNote())
                                .status("OFFICIAL")
                                .scheduleStatus("ACTIVE")
                                .build();

                return mapToResponse(scheduleRepository.save(schedule));
        }

        @Override
        @Transactional
        public ScheduleResponse updateSchedule(UUID id, ScheduleRequest request) {
                Schedule schedule = scheduleRepository.findById(id)
                                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));

                checkConflict(id, request);

                if (request.getCourseSectionId() != null) {
                        CourseSection section = courseSectionRepository.findById(request.getCourseSectionId())
                                        .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
                        schedule.setCourseSection(section);
                }

                if (request.getLecturerId() != null) {
                        Employee lecturer = employeeRepository.findById(request.getLecturerId())
                                        .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
                        schedule.setLecturer(lecturer);
                } else {
                        schedule.setLecturer(null);
                }

                if (request.getRoomId() != null) {
                        Room room = roomRepository.findById(request.getRoomId())
                                        .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
                        schedule.setRoom(room);
                } else {
                        schedule.setRoom(null);
                }

                schedule.setDayOfWeek(request.getDayOfWeek());
                schedule.setDate(request.getDate());
                schedule.setShift(request.getShift());
                schedule.setStartPeriod(request.getStartPeriod());
                schedule.setEndPeriod(request.getEndPeriod());
                schedule.setStartDate(request.getStartDate());
                schedule.setEndDate(request.getEndDate());
                schedule.setMode(request.getMode());
                schedule.setNote(request.getNote());

                return mapToResponse(scheduleRepository.save(schedule));
        }

        private void checkConflict(UUID excludeId, ScheduleRequest request) {
                if (request.getRoomId() != null) {
                        boolean roomConflict = scheduleRepository.existsRoomConflict(
                                        request.getRoomId(),
                                        request.getDayOfWeek(),
                                        request.getDate(),
                                        request.getStartPeriod(),
                                        request.getEndPeriod(),
                                        excludeId);
                        if (roomConflict) {
                                throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION, "Phòng học đã bị trùng lịch");
                        }
                }

                if (request.getLecturerId() != null) {
                        boolean lecturerConflict = scheduleRepository.existsLecturerConflict(
                                        request.getLecturerId(),
                                        request.getDayOfWeek(),
                                        request.getDate(),
                                        request.getStartPeriod(),
                                        request.getEndPeriod(),
                                        excludeId);
                        if (lecturerConflict) {
                                throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION, "Giảng viên đã bị trùng lịch dạy");
                        }
                }
        }

        @Override
        @Transactional
        public void deleteSchedule(UUID scheduleId) {
                Schedule schedule = scheduleRepository.findById(scheduleId)
                                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
                scheduleRepository.delete(schedule);
        }

        private ScheduleResponse mapToResponse(Schedule s) {
                return ScheduleResponse.builder()
                                .id(s.getId())
                                .courseSectionId(s.getCourseSection().getId())
                                .classCode(s.getCourseSection().getClassCode())
                                .courseName(s.getCourseSection().getCourse().getCourseName())
                                .lecturerName(s.getLecturer() != null ? s.getLecturer().getFullName() : "N/A")
                                .roomName(s.getRoom() != null ? s.getRoom().getRoomName() : "N/A")
                                .buildingName(s.getRoom() != null && s.getRoom().getBuilding() != null
                                                ? s.getRoom().getBuilding().getBuildingName()
                                                : "N/A")
                                .dayOfWeek(s.getDayOfWeek())
                                .date(s.getDate())
                                .shift(s.getShift())
                                .startPeriod(s.getStartPeriod())
                                .endPeriod(s.getEndPeriod())
                                .startDate(s.getStartDate())
                                .endDate(s.getEndDate())
                                .mode(s.getMode())
                                .status(s.getStatus())
                                .build();
        }
}
