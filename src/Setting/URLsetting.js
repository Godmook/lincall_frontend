export default Object.freeze({
    LOCAL_API_URL:"http://172.16.43.219:8080/",

    REAL_API_URL:"",

    STUN_CONFIG :{
        'iceServers': [
            {
                "urls": "stun:stun.l.google.com:19302"
            },
            {
                "urls": "turn:211.202.222.162:8080",
                'credential' : '1234',
                'username' : 'admin'
            },
            {
                "urls": "stun1:stun.l.google.com:19302"
            },
        ]
    },

    MEDIACONSTRAINTS : {
        'OfferToReceiveAudio': true,
        'OfferToReceiveVideo': true
    }
})