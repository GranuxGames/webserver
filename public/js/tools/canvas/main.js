var canvasCanvasScreen;
var canvasSocket;
var toolManager;
var layers = [];
var selectedLayer = 0;

const TILE_SIZE = 512;

window.addEventListener('load', () => {
  canvasCanvasScreen = new CanvasCanvasScreen();

  canvasSocket = new CanvasSocket();
  canvasSocket.connect();

  toolManager = new ToolManager(canvasCanvasScreen);
  toolManager.addTool(ToolPencil);
  toolManager.addTool(ToolEraser);
  toolManager.addTool(ToolPicker);

  canvasCanvasScreen.addKeyDownListener('z',
      [CanvasScreen.MOUSE_MODIFIER.ctrl], () => {
    var msg = {};
    msg.id = layers[selectedLayer].id;
    canvasSocket.emit('undo-layer', msg);
  });

  canvasCanvasScreen.addKeyDownListener('y',
      [CanvasScreen.MOUSE_MODIFIER.ctrl], () => {
    var msg = {};
    msg.id = layers[selectedLayer].id;
    canvasSocket.emit('redo-layer', msg);
  });
});

function uuidv4_weak() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}