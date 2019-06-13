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
    transport.send("hello", {});
    transport.on('messageSent', function (message) {
        // 通过transport发送消息时执行
        // message为send()发送的消息
        console.log(message);
    });
    transport.on('message', function (message) {
        // 通过transport接收消息时执行
        // message为收到的消息
        console.log(message);
    });
    /**
     * 建立连接并触发connected事件
     * 参数会传递给connectPromise()方法，可选
     * @return Promise
     **/
    var connectPromise = transport.connect({});
    transport.on('connected', function () {
        // 连接建立后执行
    });
    /**
     * 断开连接并触发disconnected事件
     * 参数会传递给disconnectPromise()方法，可选
     * @return Promise
     **/
    transport.disconnect({});
    transport.on('disconnected', function () {
        // 连接断开或丢失时执行
    });
    /**
     * 连接建立完成之后执行回调
     **/
    transport.afterConnected(function () {
        // 连接建立后执行的逻辑
    });
    transport.on('transportError', function () {
        // transport层抛出异常时执行
        // 常用于执行通知其它层的逻辑
    });

    /**
     * ------------------ WebSocket Transport
     **/
    var logger = transport.logger;  // 日志信息
    var configuration = transport.configuration;  // 配置对象
    var ws = transport.ws;  // websocket对象
    var server = transport.server;  // transport层通过websocket连接到的服务对象
    var connectionTimer = transport.connectionTimer;  // 连接计时ID
    var connectionPromise = transport.connectionPromise;  // connect()方法返回的Promise对象
    var reconnectionAttempts = transport.reconnectionAttempts;  // transport层出现连接出错时尝试重连次数
    var reconnectTimer = transport.reconnectTimer;  // 重连计时ID
    var transportRecoveryAttempts = transport.transportRecoveryAttempts;  // 尝试恢复服务次数
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

/**
 * 收到外呼
 **/
userAgent.on('invite', function (session) {
    session.accept();  // 请求接听
    session.on('accepted', function (data) {
        // 已接听
    });

});

/**
 * 错误响应触发
 * 亦触发failed、terminated事件
 **/
session.on('rejected', function (response, cause) {
    // 已挂机
    // response 接收到的响应
    // cause 响应说明
});

/**
 * 请求失败
 * 未被接听的电话触发，接听后触发bye事件
 * 此事件也触发terminated事件
 **/
session.on('failed', function (request) {
    var cause = request.cause; //sometimes this is request.reason_phrase
    if(cause === SIP.C.causes.REJECTED) {
        userAgent.message('alice@example.com', 'Please, call me later!');
    }
});

/**
 * 会话在接听前或接听后销毁时触发
 **/
session.on('terminated', function (message, cause) {
    // message Object
    // cause 会话销毁说明
    console.log(message.body);
});

/**
 * 会话被客户端取消时触发
 **/
session.on('cancel', function () {
});

// 重呼
session.reinvite({
    sessionDescriptionHandlerOptions: {
        constraints: {audio: true, video: true}
    }
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

/**
 * 呼出或呼入拨号时触发
 **/
session.on("dtmf", function (request, dtmf) {
    var logger = request.logger;  // 日志
    var ua = request.ua;  // 消息发送或接收的用户代理
    var headers = request.headers;
    var method = request.method;  // 请求或响应的SIP方法
    var body = request.body;  // 消息体
    var from = request.from;  // 消息来源的Header
    var to = request.to;  // 消息去向的Header
    var call_id = request.call_id;  // Header域
    var cseq = request.cseq;  // Header域
    var ruri = request.ruri;  // SIP.URI
    var extraHeaders = request.extraHeaders;  // 仅呼出请求
    var statusCode = request.statusCode;  // 仅呼出状态码
    var status_code = request.status_code;  // 仅呼入状态码
    var reasonPhrase = request.reasonPhrase;  // 仅呼出请求
    var reason_phrase = request.reason_phrase;  // 仅呼入请求
    var data = request.data;  // 仅呼入请求
    var via = request.via;  // viaHeaders，仅呼入请求
    var via_branch = request.via_branch;  // 第一条viaHeaders，仅呼入请求
    var from_tag = request.from_tag;  // fromHeader的tag，仅呼入请求
    var to_tag = request.to_tag;  // toHeader的tag，仅呼入请求
    var transport = request.transport;  // 接收到的请求的transport，仅呼入请求
    var server_transaction = request.server_transaction;  // 请求相关的事务，仅呼入请求
});

// 终止会话
var currentSession = session.terminate({
    status_code: 202,
    reason_phrase: "断网了",
    extraHeaders: "",
    body: "断网了"  // 设置body必须设置extraHeaders
});

session.bye({
    status_code: 300,
    reason_phrase: "",
    extraHeaders: ['X-Foo: foo', 'X-Bar: bar'],
    body: ""
});

// 保持
session.hold({
    extraHeaders: ['X-Foo: foo', 'X-Bar: bar'],
    anonymous: false,
    rel100: SIP.C.supported.UNSUPPORTED,
    inviteWithoutSdp: true,
    sessionDescriptionHandlerOptions: {}

}, function () {
    return new Promise();
});

// 取消保持
session.unhold({
    extraHeaders: ['X-Foo: foo', 'X-Bar: bar'],
    anonymous: false,
    rel100: SIP.C.supported.UNSUPPORTED,
    inviteWithoutSdp: true,
    sessionDescriptionHandlerOptions: {}
}, function () {
    return new Promise();
});

// 重拨
session.reinvite({
    extraHeaders: ['X-Foo: foo', 'X-Bar: bar'],
    anonymous: false,
    rel100: SIP.C.supported.UNSUPPORTED,
    inviteWithoutSdp: true,
    sessionDescriptionHandlerOptions: {}
});
/**
 * 收到重拨时触发
 **/
session.on('reinvite', function (session) {
    // session 接收呼叫的session
});

/**
 * 转接
 * @return 当前会话session
 **/
session.refer(session, {
    activeAfterTransfer: false,  // 转接后是否不挂机
    extraHeaders: ['X-Foo: foo', 'X-Bar: bar'],
    receiveResponse: function () {
    }

});
/**
 * 转接发送或接收时触发
 * @context SIP.ReferClientContext / SIP.ReferServerContext
 **/
session.on('referRequested', function (context) {
    // 外呼转接
    if(context instanceof SIP.ReferClientContext) {
        // Set up event listeners
        context.on();
        return;
    }
    // 呼入转接
    if(context instanceof SIP.ReferServerContext) {
        // Set up event listeners
        context.on();
        context.accept();
        return;
    }
});

session.on('progress', function (response) {
});
/**
 * 会话被替换时触发
 **/
session.on('replaced', function (newSession) {
    // newSession 替换当前session的会话
});

