// Initial variable declaring
const html = document.getElementById("htmlArea");
const css = document.getElementById("cssArea");
let js = document.getElementById("jsArea");
const saveState = document.getElementById("saveState");
const downloadHTML = document.getElementById("downloadHtml");
const downloadJS = document.getElementById("downloadJs");
const downloadCSS = document.getElementById("downloadCss");
const clearState = document.getElementById("clearState");
const settingsIcon = document.getElementById("settingsIcon");
const closeWindow = document.getElementById("closeWindow");
const buttonsDownload = document.getElementById("buttonsDownload");
const code = document.getElementById("code").contentWindow.document;

// Declaring opening and closing symbols
// const single_quote = "'";
const lParen = "(";
const rParen = ")";
const lBrack = "[";
const rBrack = "]";
const lCurly = "{";
const rCurly = "}";
const lBrace = "<";
const rBrace = ">";
// const back_tick = "`";

// Declaring pairs
const pairs = {
  // [single_quote]: single_quote,
  [lParen]: rParen,
  [lBrack]: rBrack,
  [lCurly]: rCurly,
  [lBrace]: rBrace,
  // [back_tick]: back_tick,
};

// Check if there is data previously saved and provide them in html, css, js textarea
for (let i = 0; i < localStorage.length; i++) {
  let key = localStorage.key(i);
  let code = localStorage.getItem(key);
  key === "html" ? (html.innerHTML += code) : null;
  key === "css" ? (css.innerHTML += code) : null;
  key === "js" ? (js.innerHTML += code) : null;
}

// Assign event listener on the body
document.body.onkeyup = (e) => {
  let keyTyped = e.key;
  let inputElement = e.target;

  // Check If first digit starts with one the left symbols, close it with its right one
  if (
    keyTyped.startsWith(lBrace) ||
    keyTyped.startsWith(lCurly) ||
    keyTyped.startsWith(lParen) ||
    // keyTyped.startsWith(single_quote) ||
    keyTyped.startsWith(lBrack)
    // keyTyped.startsWith(back_tick)
  ) {
    let caretPosition = inputElement.selectionStart;
    let closingChar = pairs[keyTyped];
    inputElement.value =
      inputElement.value.substr(0, caretPosition) +
      closingChar +
      inputElement.value.substr(caretPosition);
    inputElement.setSelectionRange(caretPosition, caretPosition);
    return;
  }

  // Write inside Iframe the code
  code.open();
  code.writeln(
    html.value +
      "<style>" +
      css.value +
      "</style>" +
      "<script>" +
      js.value +
      "</script>"
  );
  code.close();
};

// Event that runs Js code
let run = document.getElementById("runJs");
run.addEventListener("click", () => {
  let code = document.getElementById("code").contentWindow.document;
  let js = document.getElementById("jsArea");
  code.open();
  code.writeln("<script>" + js.value + "</script>");
  code.close();
});

// Assign listener for each download button
[downloadHTML, downloadJS, downloadCSS].forEach((item) => {
  item.addEventListener("click", () => {
    let fileToDownload =
      item.id === "downloadHtml"
        ? document.getElementById("htmlArea").value
        : item.id === "downloadCss"
        ? document.getElementById("cssArea").value
        : item.id === "downloadJs"
        ? document.getElementById("jsArea").value
        : null;

    let textFileAsBlob = new Blob([fileToDownload], { type: "text/plain" });

    // Saving file in a certain extension
    let fileNameToSaveAs =
      item.id === "downloadHtml"
        ? "index.html"
        : item.id === "downloadCss"
        ? "style.css"
        : item.id === "downloadJs"
        ? "index.js"
        : null;

    // Creating the link
    let downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
      // for Chrome: allows the link to be clicked without actually adding it to the DOM.
      downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
      // for Firefox: requires the link to be added to the DOM before it can be clicked.
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.onclick = destroyClickedElement;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
    }
    downloadLink.click();
  });
});

// Assign local storage to save a code session
saveState.addEventListener("click", () => {
  html.value ? localStorage.setItem("html", html.value) : null;
  css.value ? localStorage.setItem("css", css.value) : null;
  js.value ? localStorage.setItem("js", js.value) : null;
  location.reload();
  window.scrollTo(0, 0);
});

// Delete local storage
clearState.addEventListener("click", () => {
  localStorage.clear();
  location.reload();
  window.scrollTo(0, 0);
});

// Popup toggler
const toggle = () => {
  document.getElementById("popupId").classList.toggle("active");
};
