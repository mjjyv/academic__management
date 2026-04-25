Dưới đây là tổng hợp các giai đoạn triển khai dự án University IT Management System (stdmanager) từ con số 0:

🏗️ Giai đoạn 1: Thiết lập hạ tầng & Cơ sở dữ liệu (Infrastructure)
Đây là bước đặt nền móng, đảm bảo dữ liệu có nơi trú ngụ an toàn và có quy trình quản lý chuyên nghiệp.
    • Docker hóa Database: Triển khai SQL Server trên Docker để đồng bộ môi trường phát triển cho toàn đội ngũ.
    • Thiết kế Schema 13 nhóm bảng: Quy hoạch toàn bộ cấu trúc dữ liệu từ sinh viên, giảng viên, học phí đến lịch thi.
    • Flyway Migration: Sử dụng Flyway để quản lý phiên bản cơ sở dữ liệu (từ V1 đến V14), giúp việc nâng cấp database trở nên tự động và không bị lỗi xung đột.

⚙️ Giai đoạn 2: Xây dựng "Xương sống" Backend (Core Engine)
Thiết lập bộ khung logic cho Spring Boot 3 để xử lý các yêu cầu nghiệp vụ phức tạp.
    • Cấu trúc dự án: Phân chia theo kiến trúc Layered Architecture (Controller - Service - Repository - Entity).
    • Base Components: Xây dựng BaseEntity (tự động lưu thời gian tạo/sửa) và ApiResponse (chuẩn hóa dữ liệu trả về cho Frontend).
    • Global Exception Handling: Thiết lập bộ bắt lỗi tập trung, đảm bảo hệ thống không bao giờ "văng" lỗi thô ra màn hình người dùng.
    • JPA Auditing: Tự động hóa việc ghi nhận ai là người tạo hoặc cập nhật dữ liệu.

🛡️ Giai đoạn 3: Bảo mật & Xác thực (Security & Identity)
Xây dựng "tường lửa" để bảo vệ dữ liệu nhạy cảm của nhà trường.
    • Spring Security 6 & JWT: Triển khai xác thực không trạng thái (Stateless) bằng mã thông báo JSON Web Token.
    • RBAC (Role-Based Access Control): Thiết lập phân quyền chi tiết cho 4 nhóm người dùng: Admin, Giảng viên, Sinh viên, Nhân viên.
    • Xử lý lỗi hạ tầng: Giải quyết các vấn đề phức tạp như Vòng lặp phụ thuộc (Circular Dependency) và xung đột phiên bản thư viện (NoSuchMethodError).

🔌 Giai đoạn 4: Cổng giao tiếp & Tài liệu hóa (API Documentation)
Tạo ra "bản hợp đồng" để Frontend và Backend hiểu nhau.
    • OpenAPI 3 (Swagger UI): Tự động hóa tài liệu API, cho phép thử nghiệm trực tiếp trên trình duyệt.
    • Cấu hình CORS: Phá bỏ rào cản trình duyệt, cho phép ứng dụng React (Vite) gọi API tới Spring Boot một cách an toàn.
    • Chuẩn hóa DTO: Sử dụng Data Transfer Object để đóng gói dữ liệu, tăng tính bảo mật và hiệu suất truyền tải.

🎨 Giai đoạn 5: Frontend Connectivity & Dynamic UI (Giao diện động)
Biến các API thành trải nghiệm người dùng thực tế.
    • State Management (Zustand): Quản lý trạng thái đăng nhập và thông tin người dùng toàn cục, hỗ trợ lưu trữ bền vững (Persistence).
    • Axios Interceptor: Tự động đính kèm Token vào Header và xử lý lỗi 401 (hết hạn phiên làm việc).
    • Route Guarding: Bảo vệ các tuyến đường, chỉ cho phép người dùng đã đăng nhập và đúng quyền hạn mới được truy cập.
    • MainLayout & Dynamic Sidebar: Xây dựng giao diện Sidebar tự động co giãn và hiển thị các mục menu dựa trên vai trò của người dùng.




Nhóm I: Quản trị và Bảo mật (Auth Module)
đóng vai trò là "người gác cổng" và điều phối toàn bộ quyền hạn trong hệ thống. Dưới đây là các tính năng chi tiết:
1.  1. Xác thực người dùng (Authentication)
    • Đăng nhập hệ thống: Tiếp nhận và kiểm tra thông tin định danh (Username/Password) từ người dùng thông qua endpoint /api/v1/auth/login.
    • Cấp phát mã thông báo (JWT Issue): Sau khi xác thực thành công, hệ thống sinh mã JSON Web Token (JWT) chứa thông tin định danh và quyền hạn để người dùng sử dụng cho các yêu cầu tiếp theo mà không cần gửi lại mật khẩu.
    • Kiểm tra trạng thái xác thực: Cung cấp tính năng xác minh mã thông báo hiện tại còn hiệu lực hay không qua endpoint /me.
2. Quản lý phân quyền (Authorization - RBAC)
    • Phân quyền dựa trên vai trò (Role-Based Access Control): Gán và kiểm soát quyền hạn dựa trên 4 nhóm vai trò chính: Admin, Giảng viên, Sinh viên, Nhân viên.
    • Bảo vệ tài nguyên phía Server: Sử dụng các bộ lọc bảo mật và chú thích @PreAuthorize để chặn các yêu cầu không đủ thẩm quyền truy cập vào các API nghiệp vụ.
    • Điều hướng động phía Client: Tự động lọc danh sách menu hiển thị trên Sidebar và bảo vệ các tuyến đường (Route Guarding) để đảm bảo người dùng chỉ thấy và truy cập được các chức năng thuộc thẩm quyền của mình.
3. Bảo mật hạ tầng và Giao tiếp
    • Cấu hình CORS (Cross-Origin Resource Sharing): Cho phép các ứng dụng Frontend tin cậy (như React chạy trên cổng 5173/5174) gửi yêu cầu và nhận dữ liệu từ Backend một cách an toàn.
    • Xác thực không trạng thái (Stateless Security): Hệ thống không lưu trữ phiên làm việc (Session) trên Server, giúp tăng hiệu suất và khả năng mở rộng bằng cách tin tưởng hoàn toàn vào chữ ký số của JWT.
    • Truy vết hoạt động (Auditing): Kết hợp với cơ chế JPA Auditing để tự động ghi nhận danh tính người thực hiện các thao tác tạo mới hoặc cập nhật dữ liệu trên toàn hệ thống.
4. Tích hợp hệ thống Frontend (Auth Integration)
    • Quản lý trạng thái toàn cục: Sử dụng useAuthStore để lưu trữ bền vững (Persistence) Token và thông tin người dùng trong localStorage, giúp duy trì phiên làm việc ngay cả khi tải lại trang.
    • Tự động hóa giao tiếp (Interceptor): Tự động đính kèm mã JWT vào Header của mọi yêu cầu gửi lên Server và xử lý các tình huống mã lỗi 401 (hết hạn phiên) hoặc 403 (không đủ quyền) để điều hướng người dùng kịp thời.


Nhóm Quản lý Người dùng (User Module)
là tập hợp các chức năng cốt lõi để quản lý "thực thể" con người trong hệ thống. Nhóm này không chỉ lưu trữ thông tin cơ bản mà còn kết nối trực tiếp với tài khoản hệ thống (Auth) và các hoạt động nghiệp vụ khác.
Dưới đây là chi tiết các tính năng nghiệp vụ của nhóm này:
1. Module Sinh viên (Student Module - Nhóm II)
Đây là module quan trọng nhất, quản lý toàn bộ vòng đời của một sinh viên tại trường:
    • Quản lý hồ sơ định danh: Lưu trữ chi tiết thông tin cá nhân, mã số sinh viên (MSSV) và thông tin liên lạc.
    • Theo dõi trạng thái học tập: Cập nhật và quản lý tình trạng hiện tại của sinh viên như: Đang học, Bảo lưu, Thôi học hoặc Đã tốt nghiệp.
    • Phân quyền trải nghiệm người dùng: Cho phép sinh viên truy cập các tính năng đặc thù như tra cứu điểm thi, xem lịch học cá nhân và theo dõi công nợ học phí.
    • Liên kết tài khoản: Mỗi hồ sơ sinh viên được gắn chặt với một tài khoản người dùng (User) để thực hiện đăng nhập và bảo mật thông tin.
2. Module Giảng viên & Nhân viên (Lecturer/Staff Module - Nhóm III)
Module này tập trung vào việc quản lý đội ngũ nhân sự vận hành nhà trường:
    • Quản lý hồ sơ nhân sự: Lưu trữ thông tin chuyên môn, học vị và thông tin liên lạc của giảng viên cũng như cán bộ nhân viên.
    • Phân định quyền hạn nghiệp vụ:
        ◦ Giảng viên: Được cấp quyền truy cập các tính năng quản lý lớp học, nhập điểm và xem lịch giảng dạy.
        ◦ Nhân viên: Được cấp quyền quản lý hồ sơ, điều phối chương trình đào tạo hoặc quản lý tài chính tùy theo vai trò cụ thể.
3. Các tính năng quản trị chung (Core User Features)
Ngoài các nghiệp vụ riêng biệt, nhóm này sở hữu các tính năng nền tảng:
    • Quản lý dữ liệu (CRUD): Cung cấp các giao diện và API để Thêm mới, Cập nhật, Xóa và Liệt kê danh sách người dùng.
    • Tự động truy vết (Auditing): Sử dụng cơ chế JPA Auditing để tự động ghi lại danh tính người thực hiện thao tác và thời điểm tạo/sửa hồ sơ người dùng.
    • Bảo vệ dữ liệu nhạy cảm: Áp dụng kiểm tra quyền hạn mức phương thức (như @PreAuthorize("hasRole('ADMIN')")) để đảm bảo chỉ những người có thẩm quyền mới được phép chỉnh sửa hồ sơ người dùng khác.
    • Tìm kiếm và Lọc dữ liệu: Hỗ trợ tìm kiếm người dùng theo mã định danh, tên hoặc trạng thái để phục vụ việc quản lý nhanh chóng.

Nhóm Học thuật và Đào tạo (Academic Module)
là trung tâm vận hành các hoạt động giáo dục của hệ thống, quản lý toàn bộ quy trình từ xây dựng chương trình đến đánh giá kết quả học tập.
Dưới đây là các tính năng nghiệp vụ chi tiết của nhóm này:
1.  1. Quản lý Chương trình & Học phần (Nhóm IV, V)
    • Xây dựng khung chương trình: Thiết lập cấu trúc các chương trình đào tạo và sơ đồ cây môn học cho từng ngành.
    • Quản lý danh mục học phần: Lưu trữ thông tin chi tiết về các môn học, số tín chỉ và các điều kiện tiên quyết.
    • Thiết lập thời gian biểu học thuật: Định nghĩa các niên khóa, học kỳ và các cột mốc thời gian quan trọng trong năm học.
2. Đăng ký Học phần (Nhóm VI)
    • Điều phối đợt đăng ký: Thiết lập và vận hành các khoảng thời gian cho phép sinh viên đăng ký môn học trực tuyến.
    • Xử lý đăng ký: Tiếp nhận và phê duyệt danh sách sinh viên vào các lớp học phần dựa trên chương trình đào tạo.
3. Tổ chức Lịch học & Lịch dạy (Nhóm VII)
    • Xây dựng thời khóa biểu: Sắp xếp lịch học, phòng học và phân bổ giảng viên cho từng lớp học phần.
    • Cung cấp lịch cá nhân:
        ◦ Sinh viên: Tự động tổng hợp và hiển thị lịch học cá nhân trên giao diện Dashboard.
        ◦ Giảng viên: Hiển thị chi tiết lịch giảng dạy, danh sách lớp và phòng học tương ứng.
4. Quản lý Điểm & Kết quả học tập (Nhóm VIII)
    • Vận hành quy trình nhập điểm: Cung cấp công cụ cho giảng viên thực hiện ghi nhận và quản lý điểm số cho sinh viên theo từng lớp học phần.
    • Quản lý kết quả học tập: Lưu trữ bảng điểm tổng hợp và quản lý quy trình xét duyệt điểm thi.
    • Tra cứu kết quả: Cho phép sinh viên và giảng viên thực hiện xem lại lịch sử học tập cũng như kết quả điểm số thông qua các chức năng tra cứu chuyên biệt.

Nhóm Tài chính (Finance Module - Nhóm IX)
đóng vai trò quản lý toàn bộ dòng tiền liên quan đến nghĩa vụ học tập của sinh viên, đảm bảo tính minh bạch và chính xác trong các giao dịch tài chính nội bộ nhà trường.
Dưới đây là các tính năng nghiệp vụ chi tiết của nhóm này:
1. Quản lý Định mức & Biểu phí
    • Thiết lập cấu hình học phí: Định nghĩa các định mức học phí dựa trên số tín chỉ, loại học phần hoặc theo từng học kỳ cụ thể.
    • Quản lý danh mục khoản thu: Thiết lập các loại phí ngoài học phí như phí nội trú, phí bảo hiểm hoặc các loại lệ phí hành chính khác.
2. Theo dõi Hóa đơn & Công nợ (Billing & Debt)
    • Khởi tạo hóa đơn tự động: Hệ thống dựa trên danh sách đăng ký học phần (từ Nhóm VI) để tự động tính toán và xuất hóa đơn học phí cho từng sinh viên.
    • Theo dõi công nợ: Cập nhật tình trạng đóng phí theo thời gian thực, giúp nhà trường quản lý danh sách sinh viên còn nợ phí hoặc đã hoàn thành nghĩa vụ.
3. Quy trình Thanh toán & Đối soát
    • Ghi nhận giao dịch: Lưu trữ lịch sử thanh toán, mã giao dịch và phương thức thanh toán của sinh viên.
    • Đối soát tài chính: Cung cấp các báo cáo tổng hợp về doanh thu theo đợt thu hoặc theo từng đơn vị đào tạo.
4. Phân quyền truy cập & Hiển thị (RBAC)
    • Giao diện dành cho Sinh viên: Cho phép sinh viên truy cập mục "Học phí & Thanh toán" để tự theo dõi công nợ, xem lịch sử đóng phí và nhận thông báo nhắc nợ.
    • Giao diện dành cho Cán bộ tài chính/Admin: Cấp quyền toàn diện để điều chỉnh hóa đơn, phê duyệt các trường hợp miễn giảm học phí và quản lý báo cáo tài chính tổng thể.
    • Truy vết dữ liệu (Auditing): Mọi thao tác chỉnh sửa số liệu tài chính đều được hệ thống JPA Auditing ghi lại để đảm bảo tính an toàn và khả năng kiểm toán sau này.

Nhóm Khảo thí và Tốt nghiệp
đảm nhận vai trò then chốt trong việc đánh giá kết quả học tập và công nhận hoàn thành chương trình đào tạo cho sinh viên. Dưới đây là các tính năng nghiệp vụ chi tiết của nhóm này:
1.  1. Module Khảo thí (Exam Module - Nhóm X)
    • Lập kế hoạch tổ chức thi: Xây dựng phương án và lên kế hoạch tổ chức cho các đợt thi cử trong hệ thống.
    • Quản lý phòng thi: Tổ chức và quản lý danh sách các phòng thi phục vụ cho công tác khảo thí.
    • Quản lý lịch thi: Thiết lập và vận hành các lịch thi định kỳ dành cho người dùng.
    • Hiển thị lịch thi: Lịch thi được tích hợp để hiển thị trực tiếp trên giao diện của người dùng tương ứng với các học phần tham gia.
2. Module Tốt nghiệp (Graduation Module - Nhóm XI)
    • Xét điều kiện tốt nghiệp: Thực hiện quy trình xử lý và kiểm tra hồ sơ sinh viên để xác định các điều kiện đủ để tốt nghiệp.
    • Quản lý chứng chỉ: Lưu trữ và quản lý các thông tin liên quan đến chứng chỉ của sinh viên trong quá trình học tập.
    • Cấp phát văn bằng: Vận hành quy trình quản lý và thực hiện cấp phát bằng tốt nghiệp cho sinh viên sau khi hoàn thành chương trình.
3. Tính năng quản trị bổ trợ
    • Kiểm soát quyền hạn (RBAC): Đảm bảo chỉ những người dùng có vai trò phù hợp như Admin hoặc Nhân viên đào tạo mới có quyền truy cập vào các chức năng quản lý khảo thí và tốt nghiệp.
    • Truy vết dữ liệu (Auditing): Mọi thao tác cập nhật lịch thi hoặc trạng thái xét tốt nghiệp đều được hệ thống tự động ghi lại danh tính người thực hiện và thời gian cập nhật thông qua cơ chế JPA Auditing.

Nhóm Hạ tầng và Giao tiếp (Infrastructure Module)
đóng vai trò là "mạch máu" thông tin, giúp hệ thống tương tác mượt mà với người dùng và duy trì tính minh bạch dữ liệu. Dưới đây là các tính năng nghiệp vụ chi tiết của nhóm này:
1.  1. Hệ thống Thông báo nội bộ (Notification Module - Nhóm XII)
    • Vận hành thông báo hệ thống: Cung cấp hạ tầng để gửi các thông báo nội bộ đến người dùng ngay trên giao diện ứng dụng.
    • Gửi tin nhắn theo vai trò: Hỗ trợ gửi thông báo đích danh hoặc gửi hàng loạt đến các nhóm đối tượng cụ thể (Admin, Giảng viên, Sinh viên, Nhân viên) dựa trên vai trò của họ.
    • Tương tác thời gian thực: Đảm bảo người dùng nhận được các thông tin quan trọng về lịch học, lịch thi hoặc biến động học phí kịp thời.
2. Hệ thống Email tự động (Email Module - Nhóm XIV)
    • Quản lý hạ tầng gửi thư: Thiết lập và duy trì khả năng gửi email tự động từ hệ thống đến địa chỉ email cá nhân của người dùng.
    • Thiết kế mẫu nội dung (Template): Sử dụng các mẫu email được thiết kế sẵn để chuẩn hóa nội dung liên lạc như: Thư chào mừng sinh viên mới, thông báo mã OTP, hoặc xác nhận thanh toán học phí.
    • Tự động hóa giao tiếp: Kích hoạt gửi email dựa trên các sự kiện nghiệp vụ cụ thể (như khi có điểm mới hoặc khi tạo tài khoản thành công).
3. Hạ tầng Kỹ thuật & Truy vết (Core Infrastructure)
    • Tự động truy vết (JPA Auditing): Tự động ghi lại danh tính người thực hiện thao tác và thời điểm tạo hoặc cập nhật dữ liệu trên toàn hệ thống để phục vụ công tác kiểm soát.
    • Giao tiếp API an toàn (Axios Interceptor): Tự động hóa việc đính kèm mã xác thực JWT vào các yêu cầu gửi lên Server và xử lý phản hồi lỗi bảo mật (401, 403) một cách tập trung.
    • Duy trì phiên làm việc (Auth Persistence): Sử dụng cơ chế lưu trữ bền vững để giữ trạng thái đăng nhập và thông tin người dùng ngay cả khi trình duyệt được tải lại.