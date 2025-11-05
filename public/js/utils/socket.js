class Socket {

  static STATE = {
    NOT_CONNECTED: 'Not Connected',
    CONNECTED: 'Connected',
    DISCONNECTED: 'Disconnected'
  };

  constructor(path) {
    this.path = path;
    this.state = Socket.STATE.NOT_CONNECTED;
    this.lastState = Socket.STATE.NOT_CONNECTED;

    this.emits = [];

    this.connectListeners = [];
    this.reconnectListeners = [];
    this.disconnectListeners = [];
  }

  attachCallbacks() {}

  connect() {
    this.socket = io();

    this.attachCallbacks();

    this.socket.on('connect', this.onConnect.bind(this));
    this.socket.on('request-connection-response', this.onRequestConnectionResponse.bind(this));
    this.socket.on('disconnect', this.onDisconnect.bind(this));
  }

  onConnect() {
    this.lastState = this.state;
    this.state = Socket.STATE.CONNECTED;

    this.socket.emit('request-connection', this.path);
  }

  onRequestConnectionResponse() {
    if (this.state != Socket.STATE.CONNECTED)
      return;

    if (this.lastState == Socket.STATE.NOT_CONNECTED) {
      this.connectListeners.forEach((callback) => {
        callback();
      });
    } else {
      this.reconnectListeners.forEach((callback) => {
        callback();
      });
    }

    while (this.emits.length > 0) {
      var request = this.emits.shift();
      this.socket.emit(request.signal, request.value);
    }
  }

  onDisconnect() {
    this.lastState = this.state;
    this.state = Socket.STATE.DISCONNECTED;
    this.disconnectListeners.forEach((callback) => {
      callback();
    });
  }

  on(signal, callback) {
    if (signal == 'connect') {
      this.connectListeners.push(callback);
      return;
    } else if (signal == 'reconnect') {
      this.reconnectListeners.push(callback);
      return;
    } else if (signal == 'disconnect') {
      this.connectListeners.push(callback);
      return;
    }

    this.socket.on(signal, (value) => {
      callback(JSON.parse(value));
    });
  }

  emit(signal, value) {
    if (this.state == Socket.STATE.CONNECTED) {
      this.socket.emit(signal, JSON.stringify(value));
      return;
    }

    this.emits.push({signal: signal, value: JSON.stringify(value)});
  }

}