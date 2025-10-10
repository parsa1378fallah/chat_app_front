"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/features/userSlice";
import EditBioUser from "./editUserBioModal";

const EditUserDisplayName = () => {
  const userStore = useAppSelector(selectUser);
  return (
    <>
      <div className=" flex items-center gap-4">
        <p>
          بیو :{" "}
          {userStore?.bio ?? (
            <span className="text-yellow-400">کاربر بیو ندارد .</span>
          )}
        </p>
        <EditBioUser />
      </div>
    </>
  );
};
export default EditUserDisplayName;
