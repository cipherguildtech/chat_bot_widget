import api from './axios';
export async function chat(message: string

) {
 console.log("message",message);
 
    const response = await api.post('/clients/client/chats/query', {

        'question': message,
        'client_id': 'client1'

    });
   
    return response.data.response;
}
