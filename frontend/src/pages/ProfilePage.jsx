import { useState, useEffect, useRef } from 'react';
import { profileApi } from '../api/profileApi';
import { User, Mail, Phone, Calendar, MapPin, Briefcase, Award, BookOpen, Shield, Loader2, CreditCard, Edit3, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import ProfileEditModal from '../components/ProfileEditModal';
import useAuthStore from '../store/useAuthStore';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const fileInputRef = useRef(null);
    const setAuth = useAuthStore(state => state.setAuth);
    const token = useAuthStore(state => state.token);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await profileApi.getProfile();
            if (res.success) {
                setProfile(res.data);
            } else {
                setError(true);
            }
        } catch (error) {
            console.error(error);
            setError(true);
            toast.error("Không thể tải thông tin cá nhân");
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const loadingToast = toast.loading("Đang tải ảnh lên...");
        try {
            const res = await profileApi.updateAvatar(file);
            if (res.success) {
                toast.success("Cập nhật ảnh đại diện thành công", { id: loadingToast });
                // Cập nhật lại profile cục bộ
                const updatedProfile = { ...profile, avatarUrl: res.data };
                setProfile(updatedProfile);
                
                // Đồng bộ với AuthStore
                setAuth(token, {
                    ...useAuthStore.getState().user,
                    avatarUrl: res.data
                });
            }
        } catch (error) {
            toast.error("Lỗi khi tải ảnh lên", { id: loadingToast });
        }
    };

    const handleProfileUpdated = (updatedData) => {
        setProfile(updatedData);
        // Đồng bộ với AuthStore
        setAuth(token, {
            ...useAuthStore.getState().user,
            fullName: updatedData.fullName,
            email: updatedData.email
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 size={40} className="animate-spin text-gray-400" />
                <p className="text-gray-400 text-sm animate-pulse">Đang tải hồ sơ của bạn...</p>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm animate-fadeIn">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
                    <User size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Không thể tải thông tin</h3>
                <p className="text-gray-500 mb-6 max-w-xs">Đã có lỗi xảy ra khi kết nối với máy chủ. Vui lòng thử lại sau.</p>
                <button 
                    onClick={fetchProfile}
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-black transition-colors"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    const isStudent = profile.profileType === 'STUDENT';
    const isEmployee = profile.profileType === 'EMPLOYEE';
    const subProfile = isStudent ? profile.studentProfile : profile.employeeProfile;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-fadeIn">
            {/* Header Section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm relative overflow-hidden group">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-black transition-all shadow-lg shadow-gray-200"
                    >
                        <Edit3 size={14} /> CHỈNH SỬA
                    </button>
                </div>

                <div className="relative group/avatar cursor-pointer" onClick={handleAvatarClick}>
                    <div className="w-32 h-32 rounded-full border-4 border-gray-50 overflow-hidden bg-gray-100 flex items-center justify-center transition-transform group-hover/avatar:scale-105 duration-300">
                        {profile.avatarUrl ? (
                            <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />
                        ) : (
                            <User size={64} className="text-gray-300" />
                        )}
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300">
                        <Camera size={24} className="text-white" />
                    </div>
                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleAvatarChange} 
                        className="hidden" 
                        accept="image/*"
                    />
                </div>

                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                        <h1 className="text-3xl font-semibold text-gray-900">{profile.fullName}</h1>
                        <div className="flex gap-2 justify-center md:justify-start">
                            {profile.roles.map(role => (
                                <span key={role} className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                                    {role}
                                </span>
                            ))}
                        </div>
                    </div>
                    <p className="text-gray-500 font-medium text-lg mb-4">@{profile.username}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <Mail size={16} className="text-gray-400" />
                            {profile.email || 'Chưa cập nhật email'}
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <Phone size={16} className="text-gray-400" />
                            {profile.phone || 'Chưa cập nhật SĐT'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Section 1: Basic Info */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 pb-4 border-b border-gray-50">
                        <User size={18} className="text-gray-400" /> Thông tin cơ bản
                    </h3>
                    
                    <div className="space-y-4">
                        <InfoItem label="Giới tính" value={subProfile?.gender === '1' ? 'Nam' : subProfile?.gender === '2' ? 'Nữ' : 'Khác'} icon={<User size={16}/>} />
                        <InfoItem label="Ngày sinh" value={subProfile?.dateOfBirth || 'N/A'} icon={<Calendar size={16}/>} />
                        <InfoItem label="Địa chỉ" value={subProfile?.address || 'N/A'} icon={<MapPin size={16}/>} />
                        {isStudent && (
                            <InfoItem label="CCCD/CMND" value={subProfile?.personalIdentificationNumber || 'N/A'} icon={<CreditCard size={16}/>} />
                        )}
                    </div>
                </div>

                {/* Section 2: Domain Info */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 pb-4 border-b border-gray-50">
                        <Briefcase size={18} className="text-gray-400" /> {isStudent ? 'Thông tin Học vụ' : 'Thông tin Công tác'}
                    </h3>

                    <div className="space-y-4">
                        {isStudent ? (
                            <>
                                <InfoItem label="Mã sinh viên" value={subProfile.studentCode} icon={<Award size={16}/>} />
                                <InfoItem label="Lớp học" value={subProfile.className} icon={<Shield size={16}/>} />
                                <InfoItem label="Khoa/Viện" value={subProfile.departmentName} icon={<Briefcase size={16}/>} />
                                <InfoItem label="Ngành học" value={subProfile.majorName} icon={<BookOpen size={16}/>} />
                                <InfoItem label="Năm nhập học" value={subProfile.admissionYear} icon={<Calendar size={16}/>} />
                                <InfoItem label="Trạng thái" value={subProfile.statusName} icon={<Shield size={16}/>} />
                            </>
                        ) : isEmployee ? (
                            <>
                                <InfoItem label="Mã cán bộ" value={subProfile.employeeCode} icon={<Award size={16}/>} />
                                <InfoItem label="Đơn vị" value={subProfile.departmentName} icon={<Briefcase size={16}/>} />
                                <InfoItem label="Chức danh" value={subProfile.positionName} icon={<Shield size={16}/>} />
                                <InfoItem label="Học vị" value={subProfile.academicDegree} icon={<Award size={16}/>} />
                                <InfoItem label="Chuyên môn" value={subProfile.specialization} icon={<BookOpen size={16}/>} />
                                <InfoItem label="Ngày vào làm" value={subProfile.hireDate} icon={<Calendar size={16}/>} />
                            </>
                        ) : (
                            <p className="text-gray-400 text-sm italic">Chưa liên kết hồ sơ định danh</p>
                        )}
                    </div>
                </div>
            </div>

            <ProfileEditModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                initialData={profile}
                onUpdate={handleProfileUpdated}
            />
        </div>
    );
};

const InfoItem = ({ label, value, icon }) => (
    <div className="flex items-start gap-3">
        <div className="mt-1 text-gray-400">{icon}</div>
        <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
            <p className="text-sm text-gray-700 font-medium">{value || 'N/A'}</p>
        </div>
    </div>
);

export default ProfilePage;
