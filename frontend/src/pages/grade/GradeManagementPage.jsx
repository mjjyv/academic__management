import React, { useEffect, useState } from 'react';
import { Users, Search, Filter, CheckCircle2, AlertCircle, FileText, ChevronRight, Save, Edit3, X, Shield, Layout } from 'lucide-react';
import useGradeStore from '../../store/useGradeStore';
import useAuthStore from '../../store/useAuthStore';
import toast from 'react-hot-toast';

const GradeManagementPage = () => {
  const { 
    managementSections, 
    sectionDetails, 
    loading, 
    fetchManagementSections, 
    fetchSectionDetails, 
    updateGrades 
  } = useGradeStore();
  const { user } = useAuthStore();
  
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRegistrationId, setEditingRegistrationId] = useState(null);
  const [editValues, setEditValues] = useState({}); // { componentId: score }

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchManagementSections(selectedDeptId || null);
    setSelectedSectionId('');
  }, [fetchManagementSections, selectedDeptId]);

  const fetchDepartments = async () => {
    try {
      const { departmentApi } = await import('../../api/departmentApi');
      const res = await departmentApi.getAllActive();
      if (res.success) setDepartments(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách khoa", error);
    }
  };

  useEffect(() => {
    if (selectedSectionId) {
      fetchSectionDetails(selectedSectionId);
    }
  }, [selectedSectionId, fetchSectionDetails]);

  const handleEditClick = (studentDetail) => {
    setEditingRegistrationId(studentDetail.registrationId);
    const initialValues = {};
    studentDetail.componentGrades.forEach(cg => {
      initialValues[cg.componentId] = cg.score || '';
    });
    setEditValues(initialValues);
  };

  const handleSave = async (registrationId) => {
    const gradesInput = Object.entries(editValues).map(([id, val]) => ({
      componentId: id,
      score: val === '' ? null : parseFloat(val)
    }));

    const success = await updateGrades(registrationId, gradesInput);
    if (success) {
      setEditingRegistrationId(null);
      fetchSectionDetails(selectedSectionId);
    }
  };

  const filteredDetails = sectionDetails.filter(d => 
    (d.studentName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (d.studentCode?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const selectedSection = managementSections.find(s => s.sectionId === selectedSectionId);

  // Get dynamic component columns
  const componentColumns = sectionDetails.length > 0 ? sectionDetails[0].componentGrades : [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-30 p-6 rounded-3xl shadow-sm border border-white/20 ring-1 ring-black/5 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Users className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-800 tracking-tight">
                Quản lý Điểm học phần
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <Layout size={12} /> {user?.roles?.includes('ADMIN') ? 'Toàn hệ thống' : 'Giảng viên'}
                </span>
                <p className="text-xs text-gray-400">Hệ thống đồng bộ dữ liệu đào tạo thời gian thực</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Department Filter (Admin only) */}
            {user?.roles?.some(r => ['ADMIN', 'GIAOVU'].includes(r)) && (
              <div className="group relative">
                <div className="flex items-center gap-2 bg-gray-50 hover:bg-white transition-all px-4 py-2.5 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 cursor-pointer">
                  <Filter size={16} className="text-blue-500" />
                  <select 
                    value={selectedDeptId}
                    onChange={(e) => setSelectedDeptId(e.target.value)}
                    className="bg-transparent text-sm font-bold text-gray-600 outline-none cursor-pointer pr-4 min-w-[140px]"
                  >
                    <option value="">Tất cả khoa</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            
            {/* Section Filter */}
            <div className="group relative">
              <div className="flex items-center gap-2 bg-gray-50 hover:bg-white transition-all px-4 py-2.5 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 cursor-pointer">
                <FileText size={16} className="text-indigo-500" />
                <select 
                  value={selectedSectionId}
                  onChange={(e) => setSelectedSectionId(e.target.value)}
                  className="bg-transparent text-sm font-bold text-gray-600 outline-none cursor-pointer pr-4 max-w-[300px]"
                >
                  <option value="">{managementSections.length > 0 ? "Chọn lớp học phần..." : "Không có lớp học phần"}</option>
                  {managementSections.map(section => (
                    <option key={section.sectionId} value={section.sectionId}>
                      {section.classCode} - {section.courseName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Bar */}
            <div className={`relative transition-all duration-300 overflow-hidden ${selectedSectionId ? 'w-full md:w-64 opacity-100' : 'w-0 opacity-0'}`}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Tìm tên, mã SV..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all text-sm font-medium shadow-inner"
              />
            </div>
          </div>
        </div>
      </div>

      {!selectedSectionId ? (
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-20 text-center border-2 border-dashed border-blue-100 animate-pulse">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <ChevronRight className="text-blue-500" size={40} />
          </div>
          <h3 className="text-xl font-black text-gray-800">Bắt đầu quản lý điểm</h3>
          <p className="text-gray-500 max-w-xs mx-auto mt-3 font-medium">Vui lòng chọn một lớp học phần từ danh sách phía trên để truy cập bảng điểm chi tiết.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600"></div>
              <p className="text-sm font-bold text-gray-400 animate-pulse">Đang tải dữ liệu bảng điểm...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Thông tin sinh viên</th>
                    {componentColumns.map(comp => (
                      <th key={comp.componentId} className="px-4 py-5 text-center text-xs font-black text-gray-400 uppercase tracking-widest">
                        {comp.componentName}
                        <span className="block text-[10px] text-blue-400 normal-case font-bold mt-1 bg-blue-50 py-0.5 rounded-full">{comp.weightPercentage}%</span>
                      </th>
                    ))}
                    <th className="px-6 py-5 text-center text-xs font-black text-gray-400 uppercase tracking-widest">Tổng kết</th>
                    <th className="px-6 py-5 text-center text-xs font-black text-gray-400 uppercase tracking-widest">Kết quả</th>
                    <th className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {filteredDetails.map((d) => (
                    <tr key={d.registrationId} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-800">{d.studentName}</div>
                        <div className="text-xs text-gray-400 font-mono">{d.studentCode}</div>
                      </td>
                      
                      {d.componentGrades.map(comp => (
                        <td key={comp.componentId} className="px-4 py-4 text-center">
                          {editingRegistrationId === d.registrationId ? (
                            <input
                              type="number"
                              min="0"
                              max="10"
                              step="0.1"
                              value={editValues[comp.componentId] ?? ''}
                              onChange={(e) => setEditValues({
                                ...editValues,
                                [comp.componentId]: e.target.value
                              })}
                              className="w-16 px-2 py-1 border border-blue-200 rounded text-center focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          ) : (
                            <span className="font-medium text-gray-700">{comp.score?.toFixed(1) || '-'}</span>
                          )}
                        </td>
                      ))}

                      <td className="px-6 py-4 text-center">
                        <span className={`font-bold text-lg ${d.totalScore >= 4 ? 'text-blue-600' : 'text-red-500'}`}>
                          {d.totalScore?.toFixed(2) || '-'}
                        </span>
                        {d.letterGrade && (
                          <span className="ml-2 px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-black">
                            {d.letterGrade}
                          </span>
                        )}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          {d.result === 'PASS' ? (
                            <span className="flex items-center gap-1 text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full text-[10px]">
                              <CheckCircle2 size={12} /> ĐẠT
                            </span>
                          ) : d.result === 'FAIL' ? (
                            <span className="flex items-center gap-1 text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full text-[10px]">
                              <AlertCircle size={12} /> TRƯỢT
                            </span>
                          ) : (
                            <span className="text-gray-300 text-[10px]">CHƯA XÉT</span>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {editingRegistrationId === d.registrationId ? (
                            <>
                              <button 
                                onClick={() => handleSave(d.registrationId)}
                                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-sm"
                                title="Lưu"
                              >
                                <Save size={16} />
                              </button>
                              <button 
                                onClick={() => setEditingRegistrationId(null)}
                                className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-all"
                                title="Hủy"
                              >
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <button 
                              onClick={() => handleEditClick(d)}
                              disabled={d.isFinalized}
                              className={`p-2 rounded-lg transition-all ${
                                d.isFinalized 
                                  ? 'text-gray-300 cursor-not-allowed bg-gray-50' 
                                  : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                              }`}
                              title={d.isFinalized ? "Điểm đã chốt (Locked)" : "Sửa điểm"}
                            >
                              {d.isFinalized ? <Shield size={18} /> : <Edit3 size={18} />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {filteredDetails.length === 0 && !loading && (
            <div className="py-20 text-center">
              <p className="text-gray-400">Không tìm thấy sinh viên nào trong lớp này.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GradeManagementPage;
