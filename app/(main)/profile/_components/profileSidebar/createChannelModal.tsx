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
import { initChannelChat } from "@/services/channelChat.service"; // تابعی مشابه initGroupChat

const CreateChannelModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  // state ها برای نگهداری ورودی کاربر
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // هندل ایجاد کانال
  const handleCreateChannel = async (onClose: () => void) => {
    if (!channelName.trim()) return alert("نام کانال الزامی است");

    try {
      setLoading(true);

      // درخواست به سرور
      const newChannel = await initChannelChat(channelName, description);

      // بستن مودال
      onClose();
      setChannelName("");
      setDescription("");

      // رفتن به صفحه کانال جدید
      if (newChannel?.id) {
        router.push(`/chats/channel/${newChannel.id}`);
      }
    } catch (error) {
      console.error("خطا در ایجاد کانال:", error);
      alert("ایجاد کانال با مشکل مواجه شد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onPress={onOpen} color="primary">
        ایجاد کانال جدید
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                کانال جدید
              </ModalHeader>

              <ModalBody>
                <Input
                  label="نام کانال"
                  placeholder="نام کانال را وارد کنید"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  isRequired
                />
                <Textarea
                  label="توضیحات"
                  placeholder="توضیحات اختیاری کانال"
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
                  color="primary"
                  isLoading={loading}
                  onPress={() => handleCreateChannel(onClose)}
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

export default CreateChannelModal;
