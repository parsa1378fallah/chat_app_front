"use client";
import { useParams } from "next/navigation";
import NewPrivateChat from "./_components/newPrivateChat";
const NewPrivateChatPage = () => {
  const params = useParams();

  const receiverId = Number(params.receiverId);

  return <NewPrivateChat receiverId={receiverId} />;
};

export default NewPrivateChatPage;
