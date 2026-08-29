function ToolBar() {
  return (
    <div className="toolBarContainer h-[70px] md:h-[30px]">
      <div
        id="toolbar"
        className="relative flex flex-wrap items-center justify-center w-full h-fit gap-[2px]"
      >
        <button className="ql-bold"></button>
        <button className="ql-italic"></button>
        <button className="ql-underline"></button>
        <button className="ql-strike"></button>

        <button className="ql-align" value=""></button>
        <button className="ql-align" value="center"></button>
        <button className="ql-align" value="right"></button>
        <button className="ql-align" value="justify"></button>

        <button className="ql-header" value="1"></button>
        <button className="ql-header" value="2"></button>

        <button className="ql-blockquote"></button>
        <button className="ql-code-block"></button>

        <button className="ql-link"></button>

        <button className="ql-list" value="ordered"></button>
        <button className="ql-list" value="bullet"></button>

        <button className="ql-script" value="sub"></button>
        <button className="ql-script" value="super"></button>

        <select className="ql-color">
          <option value="#F44336">Red</option>
          <option value="#4CAF50">Green</option>
          <option value="#2196F3">Blue</option>
          <option value="#FFC107">Orange</option>
          <option value="#9C27B0">Purple</option>
          <option value="#FF5722">Deep Orange</option>
          <option value="#FFEB3B">Yellow</option>
          <option value="#607D8B">Gray</option>
          <option value="#03A9F4">Light Blue</option>
          <option value="#9E9E9E">Dark Gray</option>
          <option value="#E91E63">Pink</option>
          <option value="#8BC34A">Light Green</option>
          <option value="#00BCD4">Cyan</option>
          <option value="white">White</option>
        </select>

        <button className="ql-clean"></button>
      </div>
    </div>
  );
}

export default ToolBar;
