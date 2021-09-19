import config from "./config.js";
import EventBus from "./EventBus.js";

export default {

    fetch(params){
        const data = JSON.stringify(params.data);
        params.method = params.method !== undefined ? params.method : 'GET'
        params.headers.append("Authorization", window.localStorage.sRegisterToken);
        params.headers.append('Accept','application/json');
        if(params.method == 'POST' || params.method == 'PUT')
            params.headers.append('Content-Type','application/json');

        return new Promise((resolve, reject) => {
            try {
                fetch(params.url, {
                    headers: params.headers,
                    method: params.method,
                    body: data,
                })
                .then( (response) => {
                    if(!response.ok && response.status != 401) {
                        console.log('[Warning] [Error non-401]')
                        console.log(response);
                        response.text().then((text) => {
                            console.log('[Log] [decoded text]', text)
                            try {
                                let json = JSON.parse(text);
                                reject('[Warning] [' +  json.message ? json.message : json.detail ? json.detail : "an error ocurred" + "]")
                            } catch (error) {
                                console.error('[Warning] [catch json.parse]', error)
                                reject(text)
                            }
                        })
                        .catch((error) => {
                            console.error('[Warning] [catch response.text]', error)
                            reject(error)
                        })
                        return;
                    }
                    response.json().then((json) => {
                        if(response.ok) {
                            //REQUEST SUCCESS
                            resolve([response,json]);
                        } else {
                            //TRY TOKEN REFRESH
                            if(response.status == 401){
                                this.refreshToken().then((responseData) => {
                                    //TOKEN REFRESH SUCCESS, REPEAT REQUEST
                                    this.requestRepeat(params)
                                    .then(([response,json]) => {
                                        resolve([response,json]);
                                    })
                                    .catch((error) => {
                                        console.error('[Warning] [invalid refresh token (1)]', error)
                                        reject(error);
                                    });
                                }).catch((error) => {
                                    //TOKEN REFRESH ERROR, QUIT
                                    // console.log(error);
                                    console.error('[Warning] [invalid refresh token (2)]', error)
                                    EventBus.$emit('LOGOUT',{});
                                    reject(error);
                                });
                            } else {
                                //ELSE, THATS A REQUEST ERROR
                                reject('[Warning] [' +  json.message ? json.message : json.detail ? json.detail : "an error ocurred" + "]")
                            }
                        }
                    })
                })
                .catch ((error) => {
                    reject(error);
                })
            } catch (error) {
                //NETWORK ERROR
                reject(error);
            }
        });
    },
    
    refreshToken(){
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const data = JSON.stringify({
            'refresh_token': window.localStorage.sRegisterRefreshToken,
            'token': window.localStorage.sRegisterToken
        });
        console.log('[Warning] [refreshing token]');
        return new Promise((resolve, reject) => {
            try {
                if(window.localStorage.sRegisterRefreshToken == null || window.localStorage.sRegisterToken == null){
                    reject("Token not found. Reset session.")
                }
                fetch(config.serverUrl + "/auth/refreshToken",{
                    headers: headers,
                    method: "POST",
                    body: data
                })
                .then( (response) => {
                    response.json().then((json) => {
                        if(response.ok) {
                            //REQUEST SUCCESS
                            window.localStorage.sRegisterToken = json.token;
                            window.localStorage.sRegisterRefreshToken = json.refresh_token;
                            resolve({response,json});
                        } else {
                            //ELSE, THATS A REQUEST ERROR
                            // console.log(json.message);
                            reject(json.message ? json.message : json.detail ? json.detail : "an error ocurred")
                        }
                    })
                })
            } catch (error) {
                //NETWORK ERROR
                reject(error);
            }
        });
    },
    
    requestRepeat(params){
        const data = JSON.stringify(params.data);
        params.method = params.method !== undefined ? params.method : 'GET';
        // params.headers.delete('Authorization');
        params.headers.set("Authorization", window.localStorage.sRegisterToken);
        if(params.method == 'POST' || params.method == 'PUT') {
            params.headers.append('Content-Type','application/json');
        }

        return new Promise((resolve, reject) => {
            try {
                fetch(params.url, {
                    headers: params.headers,
                    method: params.method,
                    body: data
                })
                .then( (response) => {
                    if(!response.ok && response.status != 401) {
                        console.log('erro non-401 ao repetir request')
                        response.json().then((json) => {
                            reject(json.message ? json.message : json.detail ? json.detail : "an error ocurred")
                        })
                        .catch((error) => {
                            reject(response)
                        })
                        return;
                    }
                    response.json().then((json) => {
                        if(response.ok) {
                            //REQUEST SUCCESS
                            resolve([response,json]);
                        } else {
                            //ELSE, THATS A REQUEST ERROR
                            // console.log(json.message);
                            reject(json.message ? json.message : json.detail ? json.detail : "an error ocurred")
                        }
                    })
                })
                .catch ((error) => {
                    reject(error);
                })
            } catch (error) {
                //NETWORK ERROR
                // console.log(error);
                reject(error);
            }
        });
    }
};