import { privteChatApi } from "@/lib/apiInstances";
import { Message } from "@/types";


export async function getPrivateMessages(chatId: number): Promise<Message[]> {
    return await privteChatApi.get<Message[]>(`/getMessages/${chatId}`);
}

export async function sendPrivateMessage(
    chatId: number,
    content: string,
    messageType: string = "text"
): Promise<Message> {
    return await privteChatApi.post<Message>("/sendMessage", {
        chatId,
        content,
        messageType,
        chatType: "private",
    });
}
export async function initPrivateChat(receiverId: number) {
    return await privteChatApi.post<>("/init", { receiverId })
}
export async function getOtherUserInfo(chatId: number) {
    return await privteChatApi.get<>(`/${chatId}/friend`)
}
