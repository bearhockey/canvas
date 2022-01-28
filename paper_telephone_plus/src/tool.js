var TOOL = (function () {
  // const
  const MAX_LINE_WIDTH = 10;
  const LINE_INCREMENT = 3;

  const DIV_TOOLS_ID = "divDrawingTools";
  // function
  var tool = {};

  tool.m_iLineWidth = 1;

  // ----------------
  // ShowTools
  // ----------------
  tool.ShowTools = function()
  {
    var divTools = document.getElementById(DIV_TOOLS_ID);
    divTools.style.display = "block";
  };

  // ----------------
  // HideTools
  // ----------------
  tool.HideTools = function()
  {
    var divTools = document.getElementById(DIV_TOOLS_ID);
    divTools.style.display = "none";
  }

  // ----------------
  // IncreaseLineWidth
  // ----------------
  tool.IncreaseLineWidth = function(iValue)
  {
    tool.m_iLineWidth += (iValue*LINE_INCREMENT);
    if      (tool.m_iLineWidth > MAX_LINE_WIDTH) { tool.m_iLineWidth = MAX_LINE_WIDTH; }
    else if (tool.m_iLineWidth < 1)              { tool.m_iLineWidth = 1; }

    tool.UpdateLineWidth();
  };

  // ----------------
  // UpdateLineWidth
  // ----------------
  tool.UpdateLineWidth = function()
  {
    var docBrushSize = document.getElementById('brush_size_indicator');
    GetCanvas().lineWidth = tool.m_iLineWidth;
    docBrushSize.innerHTML = tool.m_iLineWidth;
  };

  return tool;
}());
