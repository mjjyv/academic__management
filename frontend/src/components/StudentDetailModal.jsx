const StudentDetailModal = ({ isOpen, onClose, studentData }) => {
    if (!isOpen || !studentData) return null;

    const InfoRow = ({ label, value }) => (
        <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
            <span className="text-gray-500 text-sm">{label}:</span>
            <span className="text-gray-900 font-medium text-sm text-right max-w-[60%]">{value || '---'}</span>
        </div>
    );

    console.log(studentData);

    const getStatusColor = (statusCode) => {
        if (statusCode === 'STUDYING' || statusCode === 'ACTIVE') return 'bg-green-100 text-green-700';
        if (statusCode === 'SUSPENDED') return 'bg-amber-100 text-amber-700';
        if (statusCode === 'EXPELLED') return 'bg-red-100 text-red-700';
        if (statusCode === 'GRADUATED') return 'bg-blue-100 text-blue-700';
        return 'bg-gray-100 text-gray-700'; // PENDING / Default
    };

    const formatGender = (gender) => {
        if (gender === '1' || gender === 'Nam') return 'Nam';
        if (gender === '2' || gender === 'Nữ') return 'Nữ';
        return 'Khác';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="p-6 bg-blue-700 text-white flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold">{studentData.fullName}</h2>
                        <div className="flex gap-4 mt-2 text-blue-100 text-sm">
                            <p>MSSV: <span className="font-bold text-white">{studentData.studentCode}</span></p>
                            <p>Khóa: <span className="font-bold text-white">{studentData.admissionYear || '---'}</span></p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Cột 1: Thông tin cá nhân */}
                        <section>
                            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                Thông tin cá nhân
                            </h3>
                            <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm space-y-1">
                                <InfoRow label="Giới tính" value={formatGender(studentData.gender)} />
                                <InfoRow label="Ngày sinh" value={studentData.dateOfBirth} />
                                <InfoRow label="Số CMND/CCCD" value={studentData.personalIdentificationNumber} />
                                <InfoRow label="Email" value={studentData.email} />
                                <InfoRow label="Số điện thoại" value={studentData.phone} />
                                <InfoRow label="Địa chỉ" value={studentData.address} />
                            </div>
                        </section>

                        {/* Cột 2: Thông tin học tập */}
                        <section>
                            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                Học vấn & Phân bổ
                            </h3>
                            <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm space-y-1">
                                <InfoRow label="Lớp hành chính" value={studentData.className} />
                                <InfoRow label="Ngành học" value={studentData.majorName} />
                                <InfoRow label="Khoa/Viện" value={studentData.departmentName} />
                                <div className="flex justify-between py-2 items-center mt-2 border-t border-gray-100 pt-3">
                                    <span className="text-gray-500 text-sm font-medium">Trạng thái hiện tại:</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(studentData.statusCode)}`}>
                                        {studentData.statusName || studentData.statusCode || 'Chưa xác định'}
                                    </span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Lịch sử trạng thái */}
                    <section className="mt-8">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Lịch sử thay đổi trạng thái</h3>
                        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                                    <tr>
                                        <th className="p-4 font-semibold">Trạng thái</th>
                                        <th className="p-4 font-semibold">Ngày bắt đầu</th>
                                        <th className="p-4 font-semibold">Ghi chú / Lý do</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {/* Giả lập map dữ liệu trạng thái nếu Backend có trả về mảng statusHistory */}
                                    {studentData.statusHistory && studentData.statusHistory.length > 0 ? (
                                        studentData.statusHistory.map((status, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(status.statusCode)}`}>
                                                        {status.statusName}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-gray-700">{status.startDate || '---'}</td>
                                                <td className="p-4 text-gray-500 text-xs italic">{status.reason || status.description || 'Không có ghi chú'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(studentData.statusCode)}`}>
                                                    {studentData.statusName}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-700">Theo hồ sơ gốc</td>
                                            <td className="p-4 text-gray-400 text-xs italic">Dữ liệu trạng thái hiện tại</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-200 bg-gray-50 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg font-bold shadow-sm hover:bg-gray-300 transition-colors">
                        Đóng cửa sổ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailModal;