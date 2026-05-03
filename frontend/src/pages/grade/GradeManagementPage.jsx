import React, { useEffect, useState } from 'react';
import { Users, Search, Filter, CheckCircle2, AlertCircle, FileText, ChevronRight, Save, Edit3, X } from 'lucide-react';
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
  
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRegistrationId, setEditingRegistrationId] = useState(null);
  const [editValues, setEditValues] = useState({}); // { componentId: score }

  useEffect(() => {
    fetchManagementSections();
  }, [fetchManagementSections]);

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="text-blue-600" />
            Quản lý Điểm học phần
          </h1>
          <p className="text-sm text-gray-500">
            {user?.roles?.includes('GIANGVIEN') ? 'Quản lý điểm các lớp được phân công.' : 'Quản lý điểm toàn hệ thống.'}
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 w-full md:w-auto">
            <Filter size={16} className="text-gray-400" />
            <select 
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="bg-transparent text-sm text-gray-600 outline-none min-w-[200px]"
            >
              <option value="">Chọn lớp học phần...</option>
              {managementSections.map(section => (
                <option key={section.sectionId} value={section.sectionId}>
                  {section.classCode} - {section.courseName} ({section.semesterName})
                </option>
              ))}
            </select>
          </div>
          
          {selectedSectionId && (
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Tìm tên, mã SV..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              />
            </div>
          )}
        </div>
      </div>

      {!selectedSectionId ? (
        <div className="bg-white rounded-2xl p-20 text-center border border-dashed border-gray-200">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChevronRight className="text-blue-500" size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Bắt đầu quản lý điểm</h3>
          <p className="text-gray-500 max-w-xs mx-auto mt-2">Vui lòng chọn một lớp học phần từ danh sách phía trên để xem và nhập điểm cho sinh viên.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                  <tr>
                    <th className="px-6 py-4">Sinh viên</th>
                    {componentColumns.map(comp => (
                      <th key={comp.componentId} className="px-4 py-4 text-center">
                        {comp.componentName}
                        <span className="block text-[10px] text-gray-400 normal-case font-medium">({comp.weightPercentage}%)</span>
                      </th>
                    ))}
                    <th className="px-6 py-4 text-center">Tổng điểm</th>
                    <th className="px-6 py-4 text-center">Kết quả</th>
                    <th className="px-6 py-4 text-right">Thao tác</th>
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
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Sửa điểm"
                            >
                              <Edit3 size={18} />
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
