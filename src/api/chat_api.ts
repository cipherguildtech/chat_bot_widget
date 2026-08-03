import api from './axios';
export async function chat(message: string,
    lastFiveConversations: { question: string; answer: string }[],
    clientId: string

) {
 
 
    const response = await api.post('/clients/client/chats/query', {

        'question': message,
        'client_id': clientId,
        'last_five_conversations': lastFiveConversations

    });

    return response.data.response;
}
