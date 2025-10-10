"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/features/userSlice";
import EditUsername from "./editUsernameModal";

const EditUserDisplayName = () => {
  const userStore = useAppSelector(selectUser);
  return (
    <>
      <div className=" flex items-center gap-4">
        <p>
          نام کاربری :{" "}
          {userStore?.displayName ?? (
            <span className="text-yellow-400">
              کاربر هنوز نام کاربری ندارد .
            </span>
          )}
        </p>
        <EditUsername />
      </div>
    </>
  );
};
export default EditUserDisplayName;
