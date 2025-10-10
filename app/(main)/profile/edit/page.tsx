"use client";
import ProfileImageUploader from "./_components/profileImageUploader";
import EditUserDisplayName from "./_components/deitUserDisplayName";
import EditUsername from "./_components/editUsername";
import EditUserBio from "./_components/editUserBio";
const EditProfilePage = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      <ProfileImageUploader />
      <EditUserDisplayName />
      <EditUsername />
      <EditUserBio />
    </div>
  );
};
export default EditProfilePage;
