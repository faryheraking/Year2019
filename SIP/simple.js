// Create a Simple interface with a user named bob and a remote video element in the DOM
var simple = new SIP.Web.Simple({
    media: {
        remote: {
            video: document.getElementById('remoteVideo'),
            // This is necessary to do an audio/video call as opposed to just a video call
            audio: document.getElementById('remoteAudio')
        }
    },
    ua: {
        uri: 'bob@example.com',
        wsServers: ['wss://sip-ws.example.com']
    }
});

simple.call('bob@example.com');

simple.answer();

simple.reject();

simple.hangup();

// DTMF
simple.sendDTMF('1');
simple.on('dtmf', function (tone) {
})

// 发送信息
simple.message('bob@example.com', 'Hello Bob');
simple.on('message', function (message) {
    // 收到信息
    console.log(message.body);
})
// 签入
simple.on('registered', function () {
})
// 签出
simple.on('unregistered', function () {
})
// 新来电
simple.on('new', function () {
})
// 呼入振铃
simple.on('ringing', function () {
})
// 接线中
simple.on('connectiing', function () {
})
// 接通
simple.on('connected', function () {
})
// 结束
simple.on('ended', function () {
})

// 保持
simple.hold();
simple.on('hold', function () {
})

// 恢复通话
simple.unhold();
simple.on('unhold', function () {
})

// 静音
simple.mute();
simple.on('mute', function () {
})

// 取消静音
simple.unmute();
simple.on('unmute', function () {
})