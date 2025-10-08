// services/user.service.ts
import { searchtApi } from "@/lib/apiInstances";
import { SearchChatItem } from './../types/index';

// دریافت نتایج سرچ چت
export async function searchChats(query: string): Promise<SearchChatItem[]> {
    console.log(query)
    return await searchtApi.get<SearchChatItem[]>("/chats", { q: query });

}
