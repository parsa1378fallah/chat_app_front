import { channelChatApi } from "@/lib/apiInstances";
import { Message } from "@/types";


export async function getChannelMessages(chatId: number): Promise<Message[]> {
    return await channelChatApi.get<Message[]>(`/${chatId}`);
}

export async function sendChannelMessage(
    channelId: number,
    content: string,
    messageType: string = "text"
): Promise<Message> {
    return await channelChatApi.post<Message>("/sendMessage", {
        channelId,
        content,
        messageType,
        chatType: "channel",
    });
}
export async function initChannelChat(channelName: string, description: string) {
    return await channelChatApi.post<>("/init", { channelName, description })
}

export async function joinChannelChat(channelId: number) {
    return await channelChatApi.post<>("/join", { channelId })
}

export async function isChannelOwner(channelId: number) {
    return await channelChatApi.post<>("/isOwner", { channelId })
}
