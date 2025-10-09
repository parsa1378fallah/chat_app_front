"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Textarea,
} from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { initGroupChat } from "@/services/groupChat.service";

const CreateGroupModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  // state ها برای نگهداری ورودی کاربر
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // هندل ایجاد گروه
  const handleCreateGroup = async (onClose: () => void) => {
    if (!groupName.trim()) return alert("نام گروه الزامی است");

    try {
      setLoading(true);

      // درخواست به سرور
      const newGroup = await initGroupChat(groupName, description);

      // بستن مودال
      onClose();
      setGroupName("");
      setDescription("");
      console.log(newGroup);
      // رفتن به صفحه گروه جدید
      if (newGroup?.id) {
        router.push(`/chats/group/${newGroup?.id}`);
      }
    } catch (error) {
      console.error("خطا در ایجاد گروه:", error);
      alert("ایجاد گروه با مشکل مواجه شد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onPress={onOpen} color="success">
        ایجاد گروه جدید
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                گروه جدید
              </ModalHeader>

              <ModalBody>
                <Input
                  label="نام گروه"
                  placeholder="نام گروه را وارد کنید"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  isRequired
                />
                <Textarea
                  label="توضیحات"
                  placeholder="توضیحات اختیاری گروه"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  minRows={3}
                />
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  انصراف
                </Button>
                <Button
                  color="success"
                  isLoading={loading}
                  onPress={() => handleCreateGroup(onClose)}
                >
                  ایجاد
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateGroupModal;
