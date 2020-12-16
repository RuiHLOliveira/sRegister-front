
export default {
    fetch(params){

        //posso fazer uma request para validar meu token se necessário.

        const headers = new Headers();

        params.headers.forEach(header => {
            headers.append(header.name, header.value);
        });
        const data = JSON.stringify(params.data);
        const method = params.method !== undefined ? params.method : 'GET'

        return fetch(params.url, {
            headers: headers,
            method: method,
            body: data
        });
    }
};