"use client";
import ProfileImageUploader from "./_components/profileImageUploader";
import EditUserDisplayName from "./_components/deitUserDisplayName";
const EditProfilePage = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      <ProfileImageUploader />
      <EditUserDisplayName />
    </div>
  );
};
export default EditProfilePage;
