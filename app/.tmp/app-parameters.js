(function(window){
window.PARAMETERS = {
    "ENV": "test",
    "SERVER_URL": "http://servertest.tastdapp.com:6081",
    "API_PREFIX": "/api",
    "PUBLIC_API_PREFIX": "/public-api",
    "AUTH_PREFIX": "/auth",
    "AUTH_TOKEN_HEADER": "X-Tastd-AuthToken",
    "APP": {
        "NAME": "Tastd",
        "VERSION": "1.8.0"
    },
    "FACEBOOK": {
        "APP_NAME": "Tastd Test",
        "APP_ID": "480756635430936",
        "API_VERSION": "v2.1",
        "APP_PERMISSIONS": {
            "LOGIN": [
                "public_profile",
                "email",
                "user_birthday",
                "user_friends"
            ]
        },
        "ENABLED": true
    },
    "HTTP_TIMEOUT": 20000
};
})(window);