import { useState, useEffect } from 'react';
import { X, Save, UserPlus, FileEdit } from 'lucide-react';
import { employeeApi } from '../api/lecturerApi';
import toast from 'react-hot-toast';

const LecturerFormModal = ({ isOpen, onClose, data, departments, positions }) => {
    const isEdit = !!data;
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        employeeCode: '',
        fullName: '',
        dateOfBirth: '',
        gender: '1',
        email: '',
        phone: '',
        address: '',
        departmentId: '',
        positionId: '',
        hireDate: '',
        contractType: '',
        salaryCoefficient: '',
        academicDegree: '',
        academicTitle: '',
        specialization: ''
    });

    useEffect(() => {
        if (data) {
            setFormData({
                employeeCode: data.employeeCode || '',
                fullName: data.fullName || '',
                dateOfBirth: data.dateOfBirth || '',
                gender: data.gender || '1',
                email: data.email || '',
                phone: data.phone || '',
                address: data.address || '',
                departmentId: data.departmentId || '',
                positionId: data.positionId || '',
                hireDate: data.hireDate || '',
                contractType: data.contractType || '',
                salaryCoefficient: data.salaryCoefficient || '',
                academicDegree: data.academicDegree || '',
                academicTitle: data.academicTitle || '',
                specialization: data.specialization || ''
            });
        } else {
            setFormData({
                employeeCode: '', fullName: '', dateOfBirth: '', gender: '1', email: '', phone: '',
                address: '', departmentId: '', positionId: '', hireDate: '', contractType: '',
                salaryCoefficient: '', academicDegree: '', academicTitle: '', specialization: ''
            });
        }
    }, [data, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Chuẩn bị payload (có thể cần format lại kiểu dữ liệu nếu cần)
            const payload = { ...formData };
            if (!payload.departmentId) payload.departmentId = null;
            if (!payload.positionId) payload.positionId = null;

            if (isEdit) {
                const res = await employeeApi.update(data.id, payload);
                if (res.success) {
                    toast.success("Cập nhật thành công!");
                    onClose();
                }
            } else {
                const res = await employeeApi.create(payload);
                if (res.success) {
                    toast.success("Thêm mới thành công!");
                    onClose();
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        {isEdit ? <FileEdit size={24} className="text-blue-200" /> : <UserPlus size={24} className="text-blue-200" />}
                        <h3 className="text-xl font-bold">{isEdit ? 'Cập nhật Cán bộ / Giảng viên' : 'Thêm mới Cán bộ / Giảng viên'}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    <form id="lecturerForm" onSubmit={handleSubmit} className="space-y-6">
                        
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Thông tin cá nhân</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Mã Cán bộ (*)</label>
                                    <input required name="employeeCode" value={formData.employeeCode} onChange={handleChange} disabled={isEdit}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-60" 
                                        placeholder="VD: GV1001" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Họ và tên (*)</label>
                                    <input required name="fullName" value={formData.fullName} onChange={handleChange}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Email (*)</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleChange}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Số điện thoại</label>
                                    <input name="phone" value={formData.phone} onChange={handleChange}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Giới tính</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option value="1">Nam</option>
                                        <option value="2">Nữ</option>
                                        <option value="0">Khác</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Ngày sinh</label>
                                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Thông tin công tác & Học vụ</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Khoa / Viện (*)</label>
                                    <select required name="departmentId" value={formData.departmentId} onChange={handleChange}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option value="">-- Chọn Khoa/Viện --</option>
                                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Chức danh (*)</label>
                                    <select required name="positionId" value={formData.positionId} onChange={handleChange}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option value="">-- Chọn Chức danh --</option>
                                        {positions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Học vị (VD: ThS, TS)</label>
                                    <input name="academicDegree" value={formData.academicDegree} onChange={handleChange}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Học hàm (VD: GS, PGS)</label>
                                    <input name="academicTitle" value={formData.academicTitle} onChange={handleChange}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Chuyên môn sâu</label>
                                    <input name="specialization" value={formData.specialization} onChange={handleChange}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Loại hợp đồng</label>
                                    <input name="contractType" value={formData.contractType} onChange={handleChange}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-white border-t border-slate-200 flex justify-end gap-3 shrink-0">
                    <button type="button" onClick={onClose} disabled={loading}
                        className="px-5 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                        Hủy
                    </button>
                    <button type="submit" form="lecturerForm" disabled={loading}
                        className="px-5 py-2 flex items-center gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-200 transition-all disabled:opacity-50">
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save size={18} />}
                        Lưu thông tin
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LecturerFormModal;
