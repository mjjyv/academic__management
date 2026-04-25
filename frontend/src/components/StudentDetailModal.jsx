// src/pages/students/components/StudentDetailModal.jsx
const StudentDetailModal = ({ isOpen, onClose, studentData }) => {
    if (!isOpen || !studentData) return null;

    const InfoRow = ({ label, value }) => (
        <div className="flex justify-between py-2 border-b border-gray-50 last:border-0">
            <span className="text-gray-500 text-sm">{label}:</span>
            <span className="text-gray-800 font-semibold text-sm">{value || '---'}</span>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 bg-blue-600 text-white flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold">{studentData.fullName}</h2>
                        <p className="text-blue-100 opacity-90">MSSV: {studentData.studentCode}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
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
                            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">Thông tin cá nhân</h3>
                            <div className="bg-gray-50 p-4 rounded-xl space-y-1">
                                <InfoRow label="Giới tính" value={studentData.gender === '1' ? 'Nam' : 'Nữ'} />
                                <InfoRow label="Ngày sinh" value={studentData.dateOfBirth} />
                                <InfoRow label="Email" value={studentData.email} />
                                <InfoRow label="Số điện thoại" value={studentData.phone} />
                                <InfoRow label="Địa chỉ" value={studentData.address} />
                            </div>
                        </section>

                        {/* Cột 2: Thông tin học tập */}
                        <section>
                            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">Học vấn & Trạng thái</h3>
                            <div className="bg-gray-50 p-4 rounded-xl space-y-1">
                                <InfoRow label="Lớp hành chính" value={studentData.className} />
                                <InfoRow label="Ngành học" value={studentData.majorName} />
                                <InfoRow label="Khoa/Viện" value={studentData.departmentName} />
                                <div className="flex justify-between py-2 items-center">
                                    <span className="text-gray-500 text-sm">Trạng thái hiện tại:</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${studentData.statusCode === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {studentData.statusName}
                                    </span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Lịch sử trạng thái (Placeholder cho logic Group VIII/XI) */}
                    <section className="mt-8">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Lịch sử thay đổi trạng thái</h3>
                        <div className="border border-gray-100 rounded-xl overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-500">
                                    <tr>
                                        <th className="p-3 text-left font-medium">Trạng thái</th>
                                        <th className="p-3 text-left font-medium">Ngày bắt đầu</th>
                                        <th className="p-3 text-left font-medium">Ghi chú</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr>
                                        <td className="p-3 font-medium text-green-600">{studentData.statusName}</td>
                                        <td className="p-3 text-gray-600">--/--/----</td>
                                        <td className="p-3 text-gray-400 italic text-xs">Dữ liệu từ hồ sơ gốc</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors">
                        ĐÓNG
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailModal;