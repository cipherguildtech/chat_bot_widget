import api from './axios';
 
export async function trackLink(clientId: string

) {

    const response = await api.post('/clients/verify', {

        client_id: clientId,
        client_domain: window.location.href

    });
    
    return response.status;
}