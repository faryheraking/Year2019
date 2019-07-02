require('@babel/polyfill');
var SIP = require('sip.js');

var config = {
    // Replace this IP address with your FreeSWITCH IP address
    uri: '1001@192.168.183.56',

    // Replace this IP address with your FreeSWITCH IP address
    // and replace the port with your FreeSWITCH ws port
    //wsServers: 'ws://192.168.183.56:5066',
    transportOptions: {
        wsServers: ['ws://192.168.183.56:5066']
    },

    // FreeSWITCH Default Username
    authorizationUser: '1001',

    // FreeSWITCH Default Password
    password: '1234'
};

var ua = new SIP.UA(config);