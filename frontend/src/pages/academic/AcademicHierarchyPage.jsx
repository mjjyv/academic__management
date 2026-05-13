import { useState, useEffect } from 'react';
import { Building2, BookOpen, GraduationCap, Plus, Edit2, Trash2, Search, Filter, ChevronRight, Copy, Loader2, ListTree } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { departmentApi } from '../../api/departmentApi';
import { majorApi } from '../../api/majorApi';
import { trainingProgramApi } from '../../api/trainingProgramApi';
import DepartmentFormModal from '../../components/DepartmentFormModal';
import MajorFormModal from '../../components/MajorFormModal';
import TrainingProgramFormModal from '../../components/TrainingProgramFormModal';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/useAuthStore';

const AcademicHierarchyPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('departments');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [majors, setMajors] = useState([]);
    const [selectedDeptId, setSelectedDeptId] = useState('all');
    const [selectedMajorId, setSelectedMajorId] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
    const [isMajorModalOpen, setIsMajorModalOpen] = useState(false);
    const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const user = useAuthStore(state => state.user);
    const canManage = user?.roles?.some(role => ['ADMIN', 'GIAOVU'].includes(role));

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        setData([]); 
        fetchData();
        if (activeTab === 'programs') fetchMajors();
    }, [activeTab, selectedDeptId, selectedMajorId]);

    const fetchDepartments = async () => {
        try {
            const res = await departmentApi.getAllActive();
            if (res.success) setDepartments(res.data);
        } catch (error) {
            console.error("Error fetching departments", error);
        }
    };

    const fetchMajors = async () => {
        try {
            const res = await majorApi.getAll();
            if (res.success) setMajors(res.data);
        } catch (error) {
            console.error("Error fetching majors", error);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            let res;
            if (activeTab === 'departments') {
                res = await departmentApi.getAllActive();
            } else if (activeTab === 'majors') {
                res = await majorApi.getAll(selectedDeptId === 'all' ? null : selectedDeptId);
            } else if (activeTab === 'programs') {
                res = await trainingProgramApi.getAll(selectedMajorId === 'all' ? null : selectedMajorId);
            }

            if (res?.success) {
                setData(res.data || []);
            }
        } catch (error) {
            toast.error("Không thể tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    const filteredData = data.filter(item => {
        if (!item) return false;
        const search = (searchTerm || '').toLowerCase();
        
        if (activeTab === 'departments') {
            return (item.name?.toLowerCase().includes(search) || item.code?.toLowerCase().includes(search));
        }
        if (activeTab === 'majors') {
            return (item.majorName?.toLowerCase().includes(search) || item.majorCode?.toLowerCase().includes(search));
        }
        if (activeTab === 'programs') {
            return (item.programName?.toLowerCase().includes(search) || item.programCode?.toLowerCase().includes(search));
        }
        return true;
    });

    const handleDuplicateProgram = async (id) => {
        const newCode = window.prompt("Nhập mã chương trình mới:");
        const newName = window.prompt("Nhập tên chương trình mới:");
        if (!newCode || !newName) return;

        try {
            const res = await trainingProgramApi.duplicate(id, newCode, newName);
            if (res.success) {
                toast.success("Sao chép chương trình thành công");
                fetchData();
            }
        } catch (error) {
            toast.error("Lỗi khi sao chép chương trình");
        }
    };

    const handleCreate = () => {
        setSelectedItem(null);
        if (activeTab === 'departments') setIsDeptModalOpen(true);
        else if (activeTab === 'majors') setIsMajorModalOpen(true);
        else if (activeTab === 'programs') setIsProgramModalOpen(true);
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        if (activeTab === 'departments') setIsDeptModalOpen(true);
        else if (activeTab === 'majors') setIsMajorModalOpen(true);
        else if (activeTab === 'programs') setIsProgramModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa mục này?")) return;
        
        try {
            let res;
            if (activeTab === 'departments') {
                toast.error("Xóa Khoa đang tạm khóa để bảo vệ dữ liệu nhân sự");
                return;
            } else if (activeTab === 'majors') {
                res = await majorApi.delete(id);
            } else if (activeTab === 'programs') {
                res = await trainingProgramApi.delete(id);
            }

            if (res?.success) {
                toast.success("Xóa thành công");
                fetchData();
            }
        } catch (error) {
            toast.error("Lỗi khi xóa dữ liệu");
        }
    };

    return (
        <div className="p-6 max-w-[1600px] mx-auto animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Cấu trúc Học thuật</h1>
                    <p className="text-gray-500 mt-1">Quản lý Khoa, Chuyên ngành và các Chương trình đào tạo</p>
                </div>
                {canManage && (
                    <button 
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
                    >
                        <Plus size={20} />
                        Tạo mới {activeTab === 'departments' ? 'Khoa' : activeTab === 'majors' ? 'Chuyên ngành' : 'CTĐT'}
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl w-fit mb-8">
                {[
                    { id: 'departments', label: 'Khoa', icon: Building2 },
                    { id: 'majors', label: 'Chuyên ngành', icon: BookOpen },
                    { id: 'programs', label: 'Chương trình đào tạo', icon: GraduationCap }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                            activeTab === tab.id 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder={`Tìm kiếm ${activeTab === 'departments' ? 'khoa' : activeTab === 'majors' ? 'chuyên ngành' : 'chương trình'}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-medium"
                    />
                </div>
                {activeTab === 'majors' && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-2xl shadow-sm min-w-[240px]">
                        <Filter size={18} className="text-gray-400" />
                        <select 
                            value={selectedDeptId}
                            onChange={(e) => setSelectedDeptId(e.target.value)}
                            className="flex-1 bg-transparent outline-none font-bold text-gray-700 text-sm"
                        >
                            <option value="all">Tất cả Khoa</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>
                )}
                {activeTab === 'programs' && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-2xl shadow-sm min-w-[240px]">
                        <Filter size={18} className="text-gray-400" />
                        <select 
                            value={selectedMajorId}
                            onChange={(e) => setSelectedMajorId(e.target.value)}
                            className="flex-1 bg-transparent outline-none font-bold text-gray-700 text-sm"
                        >
                            <option value="all">Tất cả Ngành</option>
                            {majors.map(major => (
                                <option key={major.id} value={major.id}>{major.majorName}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Content Table/Grid */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[400px]">
                        <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
                        <p className="text-gray-400 font-medium">Đang tải dữ liệu...</p>
                    </div>
                ) : filteredData.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                                    <th className="px-8 py-5">Thông tin định danh</th>
                                    <th className="px-8 py-5">Thuộc tính học thuật</th>
                                    <th className="px-8 py-5">Trạng thái</th>
                                    <th className="px-8 py-5 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredData.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                                    activeTab === 'departments' ? 'bg-amber-50 text-amber-600' :
                                                    activeTab === 'majors' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                                                }`}>
                                                    {activeTab === 'departments' ? <Building2 size={24} /> :
                                                     activeTab === 'majors' ? <BookOpen size={24} /> : <GraduationCap size={24} />}
                                                </div>
                                                <div>
                                                    <div className="font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {activeTab === 'departments' ? item.name : 
                                                         activeTab === 'majors' ? item.majorName : item.programName}
                                                    </div>
                                                    <div className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5">
                                                        Mã: {activeTab === 'departments' ? item.code : 
                                                             activeTab === 'majors' ? item.majorCode : item.programCode}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {activeTab === 'majors' ? (
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-bold text-gray-700">{item.departmentName}</span>
                                                    <span className="text-[10px] text-gray-400">Khoa quản lý</span>
                                                </div>
                                            ) : activeTab === 'programs' ? (
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-bold text-gray-700">{item.totalCredits} tín chỉ</span>
                                                    <span className="text-[10px] text-gray-400">{item.majorName}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs font-bold text-gray-500">Chính quy</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase tracking-wider">
                                                Hoạt động
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {activeTab === 'programs' && (
                                                    <button 
                                                        onClick={() => handleDuplicateProgram(item.id)}
                                                        className="p-2 hover:bg-amber-50 text-amber-600 rounded-xl transition-all"
                                                        title="Sao chép chương trình"
                                                    >
                                                        <Copy size={16} />
                                                    </button>
                                                )}
                                                
                                                <button 
                                                    onClick={() => handleEdit(item)}
                                                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 hover:bg-red-50 text-red-600 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                {activeTab === 'programs' && (
                                                    <button 
                                                        onClick={() => navigate(`/academic-hierarchy/programs/${item.id}/curriculum`)}
                                                        className="p-2 hover:bg-gray-100 text-gray-400 rounded-xl transition-all"
                                                        title="Xem khung chương trình"
                                                    >
                                                        <ListTree size={16} />
                                                    </button>
                                                )}
                                                <button className="p-2 hover:bg-gray-100 text-gray-400 rounded-xl transition-all">
                                                    <ChevronRight size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[400px] text-gray-300">
                        <Search size={64} className="opacity-10 mb-4" />
                        <p className="font-bold uppercase tracking-widest text-sm">Không tìm thấy dữ liệu</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            <DepartmentFormModal 
                isOpen={isDeptModalOpen}
                onClose={() => setIsDeptModalOpen(false)}
                initialData={selectedItem}
                onUpdate={fetchData}
            />
            <MajorFormModal 
                isOpen={isMajorModalOpen}
                onClose={() => setIsMajorModalOpen(false)}
                initialData={selectedItem}
                onUpdate={fetchData}
            />
            <TrainingProgramFormModal 
                isOpen={isProgramModalOpen}
                onClose={() => setIsProgramModalOpen(false)}
                initialData={selectedItem}
                onUpdate={fetchData}
            />
        </div>
    );
};

export default AcademicHierarchyPage;
