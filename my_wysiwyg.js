export class MyWysiwyg {
  constructor() {
    this.editor = document.getElementsByClassName("textEditor")[0];
    this.toolbar = this.editor.getElementsByClassName("toolbar")[0];
    this.buttons = this.toolbar.querySelectorAll(
      ".editor-button:not(.has-submenu)"
    );
    this.contentArea = this.editor.getElementsByClassName("content-area")[0];
    this.visualView = this.contentArea.getElementsByClassName("visual-view")[0];
    this.htmlView = this.contentArea.getElementsByClassName("html-view")[0];
    this.modal = document.getElementsByClassName("modal")[0];
    this.getImage();


    document.addEventListener(
      "selectionchange",
      this.selectionChange.bind(this)
    );
    this.visualView.addEventListener("paste", this.pasteEvent.bind(this));
    this.contentArea.addEventListener(
      "keypress",
      this.addParagraphTag.bind(this)
    );

    this.buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        let action = button.dataset.action;

        switch (action) {
          case "toggle-view":
            this.execCodeAction(button);
            break;
          case "createLink":
            this.execLinkAction();
            break;
          default:
            this.execDefaultAction(action);
        }
      });
    });
  }



  getImage() {
      let imageLoader = document.querySelector("input#file");
      imageLoader.addEventListener("change", function(){
      let file = document.querySelector('input[type="file"]').files[0];
      let reader = new FileReader();
      let dataURI;
      
      reader.addEventListener("load", () => {
      dataURI = reader.result;
      const img = document.createElement("img");
      img.src = dataURI;
      this.visualView.appendChild(img);
    }, false);
    if (file) {
      console.log("success");
      reader.readAsDataURL(file);
    }
  })
}

  execCodeAction(button) {
    if (button.classList.contains("active")) {
      this.visualView.innerHTML = this.htmlView.value;
      this.htmlView.style.display = "none";
      this.visualView.style.display = "block";
      button.classList.remove("active");
    } else {
      this.htmlView.innerText = this.visualView.innerHTML;
      this.visualView.style.display = "none";
      this.htmlView.style.display = "block";
      button.classList.add("active");
    }
  }

  execLinkAction() {
    this.modal.style.display = "block";
    let selection = this.saveSelection();
    let submit = this.modal.querySelectorAll("button.done")[0];
    let close = this.modal.querySelectorAll(".close")[0];

    submit.addEventListener("click", (e) => {
      e.preventDefault();
      let newTabCheckbox = this.modal.querySelectorAll("#new-tab")[0];
      let linkInput = this.modal.querySelectorAll("#linkValue")[0];
      let linkValue = linkInput.value;
      let newTab = newTabCheckbox.checked;
      this.restoreSelection(selection);

      if (window.getSelection().toString()) {
        let a = document.createElement("a");
        a.href = linkValue;
        if (newTab) a.target = "_blank";
        window.getSelection().getRangeAt(0).surroundContents(a);
      }

      this.modal.style.display = "none";
      linkInput.value = "";

      submit.removeEventListener("click", arguments.callee);
      close.removeEventListener("click", arguments.callee);
    });

    close.addEventListener("click", (e) => {
      e.preventDefault();
      let linkInput = this.modal.querySelectorAll("#linkValue")[0];
      this.modal.style.display = "none";
      linkInput.value = "";
      submit.removeEventListener("click", arguments.callee);
      close.removeEventListener("click", arguments.callee);
    });
  }

  execDefaultAction(action) {
    document.execCommand(action, false);
  }

  saveSelection() {
    if (window.getSelection) {
      const sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        let ranges = [];
        for (var i = 0, len = sel.rangeCount; i < len; ++i) {
          ranges.push(sel.getRangeAt(i));
        }
        return ranges;
      }
    } else if (document.selection && document.selection.createRange) {
      return document.selection.createRange();
    }
    return null;
  }

  restoreSelection(savedSel) {
    if (savedSel) {
      if (window.getSelection) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        for (var i = 0, len = savedSel.length; i < len; ++i) {
          sel.addRange(savedSel[i]);
        }
      } else if (document.selection && savedSel.select) {
        savedSel.select();
      }
    }
  }

  selectionChange(e) {
    this.buttons.forEach((button) => {
      if (button.dataset.action !== "toggle-view") {
        button.classList.remove("active");
      }
    });

    if (!this.childOf(window.getSelection().anchorNode.parentNode, this.editor))
      return false;

    this.parentTagActive(window.getSelection().anchorNode.parentNode);
  }

  childOf(child, parent) {
    return parent.contains(child);
  }

  parentTagActive(elem) {
    if (!elem || !elem.classList || elem.classList.contains("visual-view"))
      return false;

    let toolbarButton;
    let tagName = elem.tagName.toLowerCase();
    toolbarButton = document.querySelectorAll(
      `.toolbar .editor-button[data-tag-name="${tagName}"]`
    )[0];
    if (toolbarButton) {
      toolbarButton.classList.add("active");
    }

    let textAlign = elem.style.textAlign;
    toolbarButton = document.querySelectorAll(
      `.toolbar .editor-button[data-style="textAlign:${textAlign}"]`
    )[0];
    if (toolbarButton) {
      toolbarButton.classList.add("active");
    }

    return this.parentTagActive(elem.parentNode);
  }

  pasteEvent(e) {
    e.preventDefault();
    let text = (e.originalEvent || e).clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, text);
  }

  addParagraphTag(event) {
    if (event.keyCode == "13") {
      if (window.getSelection().anchorNode.parentNode.tagName === "LI") return;
      document.execCommand("formatBlock", false, "p");
    }
  }
}
