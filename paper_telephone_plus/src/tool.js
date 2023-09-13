var TOOL = (function () {
  // const
  const TOOL_CLEAR = 0;
  const TOOL_SMALL_DOT = 1;
  const TOOL_BIG_DOT = 2;

  const SMALL_PENCIL_SIZE = 2;
  const BIG_PENCIL_SIZE = 8;

  const DIV_TOOLS_ID = "divDrawingTools";
  // function
  var tool = {};

  tool.CLEAR = TOOL_CLEAR;
  tool.SMALL_DOT = TOOL_SMALL_DOT;
  tool.BIG_DOT = TOOL_BIG_DOT;

  tool.m_iLineWidth = 2;
  tool.m_iCurrentTool = -1;

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

  tool.ClickTool = function(iToolID)
  {
    switch(iToolID)
    {
      case TOOL_CLEAR:
      {
        ClearScreen();
        break;
      }
      case TOOL_SMALL_DOT:
      {
        GetCanvas().lineWidth = SMALL_PENCIL_SIZE;
        tool.m_iLineWidth = SMALL_PENCIL_SIZE;
        tool.m_iCurrentTool = TOOL_SMALL_DOT;
        break;
      }
      case TOOL_BIG_DOT:
      {
        GetCanvas().lineWidth = BIG_PENCIL_SIZE;
        tool.m_iLineWidth = BIG_PENCIL_SIZE;
        tool.m_iCurrentTool = TOOL_BIG_DOT;
        break;
      }
      default: break;
    } // end of switch
  };

  return tool;
}());
