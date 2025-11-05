class ToolManager {

  constructor(canvasScreen) {
    this.tools = [];
    this.canvasScreen = canvasScreen;
  }

  addTool(ToolClass) {
    this.tools.push(new ToolClass(this));
  }

  switchTool(target) {
    for (var tool of this.tools) {
      if (tool == target)
        tool.select();
      else
        tool.deselect();
    }
  }

  getTool(ToolClass = null) {
    if (ToolClass == null) {
      for (var tool of this.tools) {
        if (tool.isSelected())
          return tool;
      }
      return null;
    }

    for (var tool of this.tools) {
      if (tool instanceof ToolClass)
        return tool;
    }
    return null;
  }

  repaint(canvasScreen) {
    var tool = this.getTool();
    if (tool == null)
      return;

    tool.repaint(canvasScreen);
  }

}