"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/features/userSlice";
import EditUserDisplayNameModal from "./editUserDisplayNameModal";

const EditUserDisplayName = () => {
  const userStore = useAppSelector(selectUser);
  return (
    <>
      <div className=" flex items-center gap-4">
        <p>
          نام کاربر :{" "}
          {userStore?.displayName ?? (
            <span className="text-yellow-400">کاربر هنوز نامی ندارد .</span>
          )}
        </p>
        <EditUserDisplayNameModal />
      </div>
    </>
  );
};
export default EditUserDisplayName;
