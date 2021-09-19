export default {
    isLoggedIn() {
        return window.localStorage.sRegisterToken != null &&
          window.localStorage.sRegisterRefreshToken != null
          ? true
          : false;
    },

    storeCredentials (token, refreshToken){
        window.localStorage.sRegisterToken = token;
        window.localStorage.sRegisterRefreshToken = refreshToken;
        if(token == null) {
            window.localStorage.removeItem('sRegisterToken');
        }
        if(refreshToken == null) {
            window.localStorage.removeItem('sRegisterRefreshToken');
        }
    },

    getCredentials () {
        return {
            'token': window.localStorage.sRegisterToken,
            'refreshToken': window.localStorage.sRegisterRefreshToken
        };
    },

    invalidateSession(){
        this.storeCredentials(null,null);
    }
}