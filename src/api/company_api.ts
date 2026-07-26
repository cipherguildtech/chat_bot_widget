import api from './axios';
// import { ChatHistoryChat, Chat, QueryRequest } from '@/types/chats';

export async function fetchBotCustomaization(//companyId: string

) {
    const response = await api.get('demo.php');
    return response.data;
}

// export async function fetchChatHistory(docId: string): Promise<ChatHistoryChat[]> {
//     const response = await api.get(`users/user/chats/doc/${docId}`);
//     return response.data;
// }

// export async function fetchChat(chatId: string): Promise<Chat> {
//     const response = await api.get(`users/user/chats/${chatId}`);
//     return response.data;
// }

// export async function fetchLastFiveChats(docId: string): Promise<Chat[]> {
//     const response = await api.get(`users/user/chats/doc/recent/${docId}`);
//     return response.data;
// }

// export async function query(data: QueryRequest): Promise<Chat> {
//     const response = await api.post(
//         'users/user/chats/query',
//         data
//     )

//     return response.data
// }

// export async function deleteChat(chatId: string) {
//     const response = await api.delete(
//         `users/user/chats/${chatId}`,
//     )

//     return response.data
// }