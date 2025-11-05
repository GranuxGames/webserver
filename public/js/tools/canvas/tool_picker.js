const TOOL_PICKER_HTML_IDS = {
  picker: 'picker'
};

class ToolPicker extends Tool {

  constructor(toolManager) {
    super('Color Picker', document.getElementById(TOOL_PICKER_HTML_IDS.picker),
          toolManager);
  }

}