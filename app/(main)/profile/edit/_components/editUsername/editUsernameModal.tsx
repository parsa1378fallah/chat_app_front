"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  addToast,
} from "@heroui/react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useAppDispatch } from "@/store/hooks";
import { editUserProfile } from "@/services/user.service";
import { updateProfile } from "@/store/features/userSlice";
export default function EditUsernameModal() {
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username.trim()) {
      addToast({
        title: "خطا",
        description: "نام کاربر نمی‌تواند خالی باشد ❌",
        color: "danger",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await editUserProfile({ username });

      if (res) {
        dispatch(updateProfile(res));
        addToast({
          title: "موفقیت ✅",
          description: "نام کاربر با موفقیت ویرایش شد",
          color: "success",
        });
        onClose();
      } else {
        addToast({
          title: "خطا",
          description: "مشکلی در ویرایش نام پیش آمد",
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "خطا",
        description: "اتصال به سرور برقرار نشد 😔",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* دکمه مداد برای باز کردن مودال */}
      <Button
        isIconOnly
        radius="full"
        className="bg-transparent p-2"
        variant="faded"
        onPress={onOpen}
      >
        <PencilIcon className="w-5 h-5 text-primary" />
      </Button>

      {/* مودال */}
      <Modal backdrop="opaque" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-right">
                تغییر نام کاربر
              </ModalHeader>

              <ModalBody>
                <Input
                  label="نام کاربری"
                  type="text"
                  variant="faded"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="@parsaffa"
                  autoFocus
                />
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  انصراف
                </Button>
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  isLoading={loading}
                >
                  ویرایش
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
