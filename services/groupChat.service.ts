import { groupChatApi } from "@/lib/apiInstances";
import { Message, groupChatTypes } from "@/types";


export async function getGroupMessages(chatId: number): Promise<Message[]> {
    return await groupChatApi.get<Message[]>(`/${chatId}`);
}

export async function sendGroupMessage(
    chatId: number,
    content: string,
    messageType: string = "text"
): Promise<Message> {
    return await groupChatApi.post<Message>("/sendMessage", {
        chatId,
        content,
        messageType,
        chatType: "group",
    });
}
export async function initGroupChat(groupName: string, description: string): Promise<groupChatTypes> {
    return await groupChatApi.post<groupChatTypes>("/init", { groupName, description })
}

export async function joinGroupChat(groupId: number) {
    return await groupChatApi.post<>("/join", { groupId })
}
