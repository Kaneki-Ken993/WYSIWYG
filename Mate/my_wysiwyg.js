export class MyWysiwyg {
  constructor(div, options) {
    this.div = div;
    this.buttons = options.buttons || [];
    this.colors = options.colors || [];

    this.createToolbar();
  }

  createToolbar() {
    const toolbar = document.createElement("div");
    toolbar.classList.add("toolbar");

    this.buttons.forEach((buttonType) => {
      const button = document.createElement("button");
      button.textContent = buttonType;
      button.addEventListener("click", () => this.applyStyle(buttonType));
      toolbar.appendChild(button);
    });

    const colorSelector = document.createElement("input");
    colorSelector.type = "color";
    colorSelector.addEventListener("input", () =>
      this.changeColor(colorSelector.value)
    );
    toolbar.appendChild(colorSelector);

    const fontSizeSelector = document.createElement("select");
    fontSizeSelector.innerHTML = `<option value="">Size</option>
        <option value="1">Small</option>
        <option value="2">Medium</option>
        <option value="3">Large</option>
        <option value="4">Extra Large</option>`;
    fontSizeSelector.addEventListener("change", () =>
      this.changeFontSize(fontSizeSelector.value)
    );
    toolbar.appendChild(fontSizeSelector);

    this.div.parentNode.insertBefore(toolbar, this.div.nextSibling);

    ["Left", "Center", "Right"].forEach((alignType) => {
      const alignButton = document.createElement("button");
      alignButton.textContent = `Align ${alignType}`;
      alignButton.addEventListener("click", () =>
        this.alignText(alignType.toLowerCase())
      );
      toolbar.appendChild(alignButton);
    });

    this.div.parentNode.insertBefore(toolbar, this.div.nextSibling);
  }

  applyStyle(buttonType) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();

      if (selectedText) {
        let startTag, endTag;
        switch (buttonType) {
          case "bold":
            startTag = "<strong>";
            endTag = "</strong>";
            break;
          case "italic":
            startTag = "<em>";
            endTag = "</em>";
            break;
          case "strikethrough":
            startTag = "<del>";
            endTag = "</del>";
            break;
          default:
            console.error("Unknown button type:", buttonType);
            return;
        }

        const newContent = startTag + selectedText + endTag;
        const newNode = document.createElement("span");
        newNode.innerHTML = newContent;

        range.deleteContents();
        range.insertNode(newNode);
      }
    }
  }

  changeColor(color) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.cloneContents();

      const newNode = document.createElement("span");
      newNode.style.color = color;
      newNode.appendChild(selectedText);

      range.deleteContents();
      range.insertNode(newNode);
    }
  }

  changeFontSize(fontSize) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.cloneContents();

      const newNode = document.createElement("span");
      newNode.style.fontSize = fontSize + "rem";
      newNode.appendChild(selectedText);

      range.deleteContents();
      range.insertNode(newNode);
    }
  }

  alignText(alignType) {
    this.div.style.textAlign = alignType;
  }
}
