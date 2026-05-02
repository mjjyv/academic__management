import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import useRegistrationStore from '../../../store/useRegistrationStore';
import useSemesterStore from '../../../store/useSemesterStore';
import toast from 'react-hot-toast';

const RegistrationPeriodModal = ({ isOpen, onClose, selectedPeriod }) => {
  const { addPeriod, updatePeriod } = useRegistrationStore();
  const { semesters, fetchSemesters } = useSemesterStore();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (isOpen) {
      fetchSemesters();
      if (selectedPeriod) {
        reset({
          name: selectedPeriod.name,
          semesterId: selectedPeriod.semesterId,
          startTime: selectedPeriod.startTime,
          endTime: selectedPeriod.endTime,
          maxCredits: selectedPeriod.maxCredits,
          minCredits: selectedPeriod.minCredits,
          allowRetake: selectedPeriod.allowRetake,
          targetConfig: selectedPeriod.targetConfig,
        });
      } else {
        reset({
          name: '',
          semesterId: '',
          startTime: '',
          endTime: '',
          maxCredits: 25,
          minCredits: 12,
          allowRetake: true,
          targetConfig: '',
        });
      }
    }
  }, [isOpen, selectedPeriod, reset, fetchSemesters]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      if (selectedPeriod) {
        await updatePeriod(selectedPeriod.id, data);
        toast.success('Cập nhật đợt đăng ký thành công');
      } else {
        await addPeriod(data);
        toast.success('Thêm đợt đăng ký thành công');
      }
      onClose();
    } catch (error) {
      toast.error('Có lỗi xảy ra: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <h3 className="text-xl font-bold">
            {selectedPeriod ? 'Cập nhật đợt đăng ký' : 'Tạo mới đợt đăng ký'}
          </h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tên đợt đăng ký</label>
              <input
                {...register('name', { required: 'Vui lòng nhập tên' })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="VD: Đăng ký học phần Học kỳ 1 - 2024"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Học kỳ</label>
              <select
                {...register('semesterId', { required: 'Vui lòng chọn học kỳ' })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option value="">Chọn học kỳ...</option>
                {semesters.map(s => (
                  <option key={s.id} value={s.id}>{s.semesterName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cho phép học lại</label>
              <div className="flex items-center h-10">
                <input
                  type="checkbox"
                  {...register('allowRetake')}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-600">Có cho phép</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Thời gian bắt đầu</label>
              <input
                type="datetime-local"
                max="9999-12-31T23:59"
                {...register('startTime', { required: 'Vui lòng chọn thời gian' })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Thời gian kết thúc</label>
              <input
                type="datetime-local"
                max="9999-12-31T23:59"
                {...register('endTime', { required: 'Vui lòng chọn thời gian' })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tín chỉ tối thiểu</label>
              <input
                type="number"
                {...register('minCredits')}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tín chỉ tối đa</label>
              <input
                type="number"
                {...register('maxCredits')}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cấu hình đối tượng (JSON)</label>
              <textarea
                {...register('targetConfig')}
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder='{"majors": ["IT", "CS"], "years": [2021, 2022]}'
              />
            </div>
          </div>

          <div className="mt-8 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:opacity-90 shadow-lg shadow-blue-500/30 transition-all font-semibold"
            >
              {selectedPeriod ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPeriodModal;
