import React, { useState, useRef } from "react";

const TextEditor = () => {
    const [text, setText] = useState("");
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [underline, setUnderline] = useState(false);
    const [color, setColor] = useState("");
    const contentEditableRef = useRef(null);
    const [resizing, setResizing] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [leading, setLeading] = useState("normal"); // Default leading value


  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    contentEditableRef.current.focus();
  };

  const toggleBold = () => {
    setBold(!bold);
    execCommand("bold");
  };

  const toggleItalic = () => {
    setItalic(!italic);
    execCommand("italic");
  };

  const toggleUnderline = () => {
    setUnderline(!underline);
    execCommand("underline");
  };

  const handleColorChange = (e) => {
    setColor(e.target.value);
    execCommand("foreColor", e.target.value);
  };

  const handleClear = () => {
    setText("");
    contentEditableRef.current.innerHTML = "";
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgElement = document.createElement("img");
        imgElement.src = event.target.result;
        imgElement.style.width = "200px";
        imgElement.style.height = "200px";
        contentEditableRef.current.appendChild(imgElement);
      };
      reader.readAsDataURL(file);
    }
  };

  const adjustFontSize = (adjustment) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const span = document.createElement("span");
    span.appendChild(range.extractContents());
    range.insertNode(span);

    const computedStyle = window.getComputedStyle(span, null);
    const currentSize = parseFloat(computedStyle.getPropertyValue('font-size'));
    const newSize = currentSize + adjustment;

    span.style.fontSize = `${newSize}px`;
    range.selectNodeContents(span);

    selection.removeAllRanges();
    selection.addRange(range);
  };

  const increaseFontSize = () => {
    adjustFontSize(1);
  };

  const decreaseFontSize = () => {
    adjustFontSize(-1);
  };

  const handleLeadingChange = (e) => {
    setLeading(e.target.value);
    contentEditableRef.current.style.lineHeight = e.target.value;
  };



  return (
    <div className="flex flex-col p-8 w-full h-screen">
      <div className="flex flex-row items-center gap-3 mb-4">
        <button onClick={toggleBold} className={`p-3 pl-6 pr-6 ${bold ? "bg-black text-white transition-color duration-[500ms]" : "bg-blue-900 text-white  transition-color duration-[500ms]"} rounded`}>
          Bold
        </button>
        <button onClick={toggleItalic} className={`p-3 pl-6 pr-6 ${italic ? "bg-black text-white transition-color duration-[500ms]" : "bg-blue-900 text-white  transition-color duration-[500ms]"} rounded`}>
          Italic
        </button>
        <button onClick={toggleUnderline} className={`p-3 pl-6 pr-6 ${underline ? "bg-black text-white transition-color duration-[500ms]" : "bg-blue-900 text-white  transition-color duration-[500ms]"} rounded`}>
          Underline
        </button>
        <input type="color" onChange={handleColorChange} placeholder="*" className="p-3 pl-6 pr-6 bg-blue-900 text-white border rounded" />
        <button onClick={handleClear} className="p-3 pl-6 pr-6">
          Clear
        </button>
        <select value={leading} onChange={handleLeadingChange} className="p-3 pl-6 pr-6 bg-blue-900 text-white border rounded">
          <option value="normal">Normal</option>
          <option value="1.5">1.5</option>
          <option value="2">2</option>
        </select>
        <button onClick={increaseFontSize} className="p-3 pl-6 pr-6 bg-blue-900 text-white rounded">
          +1
        </button>
        <button onClick={decreaseFontSize} className="p-3 pl-6 pr-6 bg-blue-900 text-white rounded">
          -1
        </button>

        <input type="file" accept="image/*" onChange={handleImageUpload} className="p-3 pl-6 pr-6 border rounded" />
        
      </div>
      <div className="w-full bg-blue-900 text-white p-3 pl-6 pr-6">
      <p className="text-2xl font-medium">Editor</p>

      </div>

      <div
        ref={contentEditableRef}
        contentEditable
        className="w-full h-full p-3 pl-6 pr-6 outline-none border border-gray-300"
        style={{ whiteSpace: "pre-wrap" }}
        onInput={(e) => setText(e.currentTarget.innerHTML)}
      />
    </div>

  );
};

export default TextEditor;
