import { useState, useEffect } from 'react';
import { classApi } from '../../api/studentApi';
import { ChevronRight, ChevronDown, GraduationCap, School, Users, Layers, Search } from 'lucide-react';
import ClassDetailModal from '../../components/ClassDetailModal';

const ClassHierarchyPage = () => {
    const [hierarchy, setHierarchy] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedDepts, setExpandedDepts] = useState({});
    const [expandedMajors, setExpandedMajors] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchHierarchy();
    }, []);

    const fetchHierarchy = async () => {
        setLoading(true);
        try {
            const response = await classApi.getHierarchy();
            if (response.success) {
                setHierarchy(response.data);
                // Mở mặc định khoa đầu tiên nếu có dữ liệu
                if (response.data.length > 0) {
                    setExpandedDepts({ [response.data[0].id]: true });
                }
            }
        } catch (error) {
            console.error('Lỗi khi tải cấu trúc lớp:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleDept = (id) => {
        setExpandedDepts(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleMajor = (id) => {
        setExpandedMajors(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleClassClick = (id) => {
        setSelectedClassId(id);
        setIsModalOpen(true);
    };

    // Lọc dữ liệu theo từ khóa tìm kiếm (lớp, ngành, khoa)
    const filteredHierarchy = hierarchy.map(dept => {
        const filteredMajors = dept.majors.map(major => {
            const filteredClasses = major.classes.filter(c => 
                c.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.classCode.toLowerCase().includes(searchTerm.toLowerCase())
            );
            return { ...major, classes: filteredClasses };
        }).filter(major => 
            major.majorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
            major.classes.length > 0
        );

        return { ...dept, majors: filteredMajors };
    }).filter(dept => 
        dept.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        dept.majors.length > 0
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                        <School className="text-blue-600" /> Quản lý Lớp hành chính
                    </h2>
                    <p className="text-gray-500 text-sm">Phân loại theo Khoa/Viện và Chuyên ngành đào tạo</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm lớp, ngành, khoa..." 
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl w-full md:w-80 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                    <p className="animate-pulse">Đang tải cấu trúc dữ liệu học vụ...</p>
                </div>
            ) : filteredHierarchy.length === 0 ? (
                <div className="bg-white rounded-2xl p-20 text-center border border-dashed border-gray-300">
                    <Layers className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500">Không tìm thấy dữ liệu phù hợp với yêu cầu.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredHierarchy.map(dept => (
                        <div key={dept.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300">
                            {/* Department Header */}
                            <button 
                                onClick={() => toggleDept(dept.id)}
                                className={`w-full flex items-center justify-between p-5 text-left transition-colors ${expandedDepts[dept.id] ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-lg shadow-blue-200">
                                        <School size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{dept.departmentName}</h3>
                                        <span className="text-[10px] font-black text-blue-600 bg-blue-100 px-2 py-0.5 rounded uppercase tracking-wider">Mã khoa: {dept.departmentCode}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="hidden sm:block text-xs font-medium text-gray-400">{dept.majors.length} ngành học</span>
                                    {expandedDepts[dept.id] ? <ChevronDown size={20} className="text-gray-400" /> : <ChevronRight size={20} className="text-gray-400" />}
                                </div>
                            </button>

                            {/* Majors List */}
                            {expandedDepts[dept.id] && (
                                <div className="p-5 pt-0 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="h-px bg-gray-100 mb-5"></div>
                                    {dept.majors.map(major => (
                                        <div key={major.id} className="ml-2 md:ml-4 border-l-2 border-gray-100 pl-4 md:pl-6 pb-2">
                                            <button 
                                                onClick={() => toggleMajor(major.id)}
                                                className="flex items-center gap-2 mb-3 group"
                                            >
                                                <GraduationCap size={18} className="text-amber-500" />
                                                <h4 className="font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{major.majorName}</h4>
                                                <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{major.classes.length} lớp</span>
                                                {expandedMajors[major.id] ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
                                            </button>

                                            {/* Classes Grid */}
                                            {expandedMajors[major.id] && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 animate-in zoom-in-95 duration-200">
                                                    {major.classes.map(cls => (
                                                        <div 
                                                            key={cls.id} 
                                                            onClick={() => handleClassClick(cls.id)}
                                                            className="group bg-white border border-gray-200 p-4 rounded-xl hover:border-blue-300 hover:shadow-md hover:shadow-blue-50 transition-all cursor-pointer relative overflow-hidden"
                                                        >
                                                            <div className="absolute top-0 right-0 p-1">
                                                                <div className="w-8 h-8 bg-blue-50 rounded-bl-xl flex items-center justify-center text-blue-300 group-hover:text-blue-600 transition-colors">
                                                                    <Users size={14} />
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="text-[10px] font-bold text-blue-500 mb-1">{cls.classCode}</div>
                                                            <h5 className="font-bold text-gray-800 text-sm mb-3 line-clamp-1">{cls.className}</h5>
                                                            
                                                            <div className="flex items-center justify-between mt-auto">
                                                                <span className="text-[10px] text-gray-400 font-medium italic">Khóa: {cls.courseYear || 'N/A'}</span>
                                                                <button className="text-[10px] font-bold text-blue-600 hover:underline">Chi tiết →</button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {major.classes.length === 0 && (
                                                        <div className="col-span-full py-4 text-center text-xs text-gray-400 italic">Chưa có lớp hành chính nào được tạo cho ngành này.</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <ClassDetailModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                classId={selectedClassId}
            />
        </div>
    );
};

export default ClassHierarchyPage;
