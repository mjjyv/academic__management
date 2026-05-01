import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseSectionApi } from '../../api/courseSectionApi';
import { 
    Users, 
    BookOpen, 
    Calendar, 
    User, 
    ArrowLeft, 
    Download, 
    Search,
    CheckCircle,
    XCircle,
    Info
} from 'lucide-react';

const CourseSectionDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchDetail();
    }, [id]);

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const response = await courseSectionApi.getDetail(id);
            if (response.success) {
                setData(response.data);
            }
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết lớp học phần:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                <p className="animate-pulse">Đang tải chi tiết lớp học phần...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="bg-white rounded-2xl p-20 text-center border border-dashed border-gray-300">
                <Info className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500">Không tìm thấy thông tin lớp học phần yêu cầu.</p>
                <button 
                    onClick={() => navigate(-1)}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                    Quay lại
                </button>
            </div>
        );
    }

    const filteredStudents = data.students.filter(s => 
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.className.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'bg-green-100 text-green-700';
            case 'closed': return 'bg-gray-100 text-gray-700';
            case 'canceled': return 'bg-red-100 text-red-700';
            default: return 'bg-blue-100 text-blue-700';
        }
    };

    const getRegTypeLabel = (type) => {
        switch (type) {
            case 1: return 'Học mới';
            case 2: return 'Học lại';
            case 3: return 'Cải thiện';
            default: return 'Khác';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium transition-colors"
                >
                    <ArrowLeft size={18} /> Quay lại danh sách
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-colors shadow-sm">
                    <Download size={18} /> Xuất danh sách (Excel)
                </button>
            </div>

            {/* Banner Thông tin chung */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10 -translate-y-4 translate-x-4">
                    <BookOpen size={240} />
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-md`}>
                            Mã lớp: {data.classCode}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(data.status)}`}>
                            Trạng thái: {data.status}
                        </span>
                    </div>
                    
                    <h1 className="text-3xl font-black mb-6">{data.courseCode} - {data.courseName}</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-blue-100">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 p-2.5 rounded-xl"><User size={20} /></div>
                            <div>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-blue-300 mb-0.5">Giảng viên</p>
                                <p className="font-bold text-white">{data.lecturerName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 p-2.5 rounded-xl"><Calendar size={20} /></div>
                            <div>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-blue-300 mb-0.5">Học kỳ</p>
                                <p className="font-bold text-white">{data.semesterName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 p-2.5 rounded-xl"><Info size={20} /></div>
                            <div>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-blue-300 mb-0.5">Số tín chỉ</p>
                                <p className="font-bold text-white">{data.credits} tín chỉ ({data.classType})</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 p-2.5 rounded-xl"><Users size={20} /></div>
                            <div>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-blue-300 mb-0.5">Sĩ số</p>
                                <p className="font-bold text-white">{data.enrolledCount} / {data.maxStudents || '---'} sinh viên</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danh sách sinh viên */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-black text-gray-800">Danh sách Sinh viên đăng ký</h3>
                        <p className="text-gray-400 text-xs">Hiển thị {filteredStudents.length} kết quả</p>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Tìm sinh viên trong lớp..." 
                            className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl w-full md:w-80 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                                <th className="px-6 py-4">STT</th>
                                <th className="px-6 py-4">MSSV</th>
                                <th className="px-6 py-4">Họ và Tên</th>
                                <th className="px-6 py-4">Lớp hành chính</th>
                                <th className="px-6 py-4 text-center">Hình thức</th>
                                <th className="px-6 py-4 text-center">Học phí</th>
                                <th className="px-6 py-4 text-right">Ngày đăng ký</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredStudents.map((student, idx) => (
                                <tr key={student.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4 text-sm text-gray-400 font-medium">{idx + 1}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-black text-gray-700 group-hover:text-blue-600 transition-colors">{student.studentCode}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-gray-800">{student.fullName}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">{student.className}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600">
                                            {getRegTypeLabel(student.registrationType)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {student.isPaid ? (
                                            <CheckCircle size={18} className="text-green-500 mx-auto" />
                                        ) : (
                                            <XCircle size={18} className="text-amber-400 mx-auto" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right text-xs text-gray-400 font-medium">
                                        {new Date(student.registeredAt).toLocaleDateString('vi-VN')}
                                    </td>
                                </tr>
                            ))}
                            {filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-400 italic text-sm">
                                        Không tìm thấy sinh viên nào trong danh sách.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase">Đã đóng học phí</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase">Chờ thanh toán</span>
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium italic">Dữ liệu được cập nhật từ hệ thống đăng ký học tập</p>
                </div>
            </div>
        </div>
    );
};

export default CourseSectionDetailPage;
