var remoteVideo = document.getElementById('remoteVideo');
var localVideo = document.getElementById('localVideo');

var userAgent = new SIP.UA({
    uri: 'bob@example.onsip.com',
    transportOptions: {
        wsServers: ['wss://sip-ws.example.com']
    },
    authorizationUser: '',
    password: '',
    register: true  // 是否连接websocket同时注册座席
});

userAgent.start(); // 连接websocket

userAgent.stop();  // 断开websocket

// 注册座席
userAgent.register({
    extraHeaders: ['X-Foo: foo', 'X-Bar: bar']
});
userAgent.on('registered', function () {
    // 注册成功
});
userAgent.on('registrationFailed', function (response, cause) {
    // 注册失败
});

// 注销座席
userAgent.unregister({
    extraHeaders: [],
    all: true  // 是否注销所有座席
});
userAgent.on('unregistered', function (response, cause) {
    // 注销成功
    // response SIP消息
    // cause 原因
});

// 座席是否注册
userAgent.isRegistered();

// 发送消息
var message = userAgent.message('bob@example.com', 'Hello, Bob!');
console.log(message.body); // 发送的消息
userAgent.on('message', function (message) {
    // 收到消息
    console.log(message.body);
});

userAgent.on('outOfDialogReferRequested', function (referServerContext) {
    if(validateRequest(referServerContext)) {
        referServerContext.accept();
    } else {
        referServerContext.reject();
    }
});

userAgent.once('transportCreated', function (transport) {
    /**
     * 发送信息并触发messageSent事件
     * 第一个参数为发送的信息，必选
     * 第二个参数会传递给sendPromise()方法，可选
     **/
    transport.send("hello",{});
    /**
     * 建立连接并触发connected事件
     * 参数会传递给connectPromise()方法，可选
     * @return Promise
     **/
    transport.connect({});
    /**
     * 断开连接并触发disconnected事件
     * @return Promise
     **/
    transport.disconnect({});
    transport.on('transportError', this.onTransportError.bind(this));
}.bind(this));

// 订阅presence事件
userAgent.subscribe('bob@example.com', 'presence', {
    expires: 3600,  // 秒
    extraHeader: ['X-Foo: foo', 'X-Bar: bar']

});

// 发送SIP消息
userAgent.request("INVITE", 'bob@example.com', {
    extraHeaders: ['X-Foo: foo', 'X-Bar: bar'],
    body: "Hello,Bob!"
})

// 呼出
var session = userAgent.invite('bob@example.com', {
    extraHeaders: ['X-Foo: foo', 'X-Bar: bar'],  // 设置SIP头信息
    anonymous: false,  // 是否允许匿名电话
    rel100: SIP.C.supported.UNSUPPORTED,
    inviteWithoutSdp: false,
    sessionDescriptionHandlerOptions: {
        constraints: {audio: true, video: false}
    },
    modifiers: []
});

var startTime = session.startTime;  // 会话开始时间，接听时间
var endTime = session.endTime;  // 会话结束时间，挂机时间
var userAgent2 = session.ua;  // 用户代理
var method = session.method;  // 呼叫方法名，总是'INVITE'
var sessionDescriptionHandler = session.sessionDescriptionHandler;


userAgent.on('invite', function (session) {
    // 呼入
    session.accept();
});

session.on('failed', function (request) {
    var cause = request.cause; //sometimes this is request.reason_phrase
    if(cause === SIP.C.causes.REJECTED) {
        userAgent.message('alice@example.com', 'Please, call me later!');
    }
});


// 重呼
session.reinvite({
    sessionDescriptionHandlerOptions: {
        constraints: {audio: true, video: true}
    }
});

userAgent.on('invite', function (session) {
    session.accept();  // 接听
});

// 绑定媒体
session.on('trackAdded', function () {
    // We need to check the peer connection to determine which track was added
    var pc = session.sessionDescriptionHandler.peerConnection;

    // Gets remote tracks
    var remoteStream = new MediaStream();
    pc.getReceivers().forEach(function (receiver) {
        remoteStream.addTrack(receiver.track);
    });
    remoteVideo.srcObject = remoteStream;
    remoteVideo.play();

    // Gets local tracks
    var localStream = new MediaStream();
    pc.getSenders().forEach(function (sender) {
        localStream.addTrack(sender.track);
    });
    localVideo.srcObject = localStream;
    localVideo.play();
});

//target address
//refers the call to `test2@example.onsip.com`
var target = `test2@example.onsip.com`;
session.refer(target);

session.on('referRequested', function (referServerContext) {
    if(shouldAcceptRefer(referServerContext)) {
        referServerContext.accept();
    } else {
        referServerContext.reject();
    }
});

document.getElementById('1').addEventListener("click", function () {
    session.dtmf(1);
}, false);
document.getElementById('2').addEventListener("click", function () {
    session.dtmf(2);
}, false);
document.getElementById('3').addEventListener("click", function () {
    session.dtmf(3);
}, false);
document.getElementById('4').addEventListener("click", function () {
    session.dtmf(4);
}, false);
document.getElementById('5').addEventListener("click", function () {
    session.dtmf(5);
}, false);
document.getElementById('6').addEventListener("click", function () {
    session.dtmf(6);
}, false);
document.getElementById('7').addEventListener("click", function () {
    session.dtmf(7);
}, false);
document.getElementById('8').addEventListener("click", function () {
    session.dtmf(8);
}, false);
document.getElementById('9').addEventListener("click", function () {
    session.dtmf(9);
}, false);
document.getElementById('0').addEventListener("click", function () {
    session.dtmf(0);
}, false);

session.on("dtmf", function () {

});

session.terminate();