class MouseManager
{
  constructor()
  {
    this.arrPosition = [];
  }

  // --------------------------------
  // Move
  // --------------------------------
  Move(evt)
  {
    var rect = myGameArea.canvas.getBoundingClientRect();
    this.arrPosition = [ evt.clientX - rect.left, evt.clientY - rect.top ];
    if (GEO.IsInRect(this.arrPosition, CONST.CANVAS_VIEW_AREA))
    {
      m_OM.MouseMove(this.arrPosition);
    }
  };

  // --------------------------------
  // LeftClick
  // --------------------------------
  LeftClick(evt)
  {
    if (GEO.IsInRect(this.arrPosition, CONST.CANVAS_VIEW_AREA))
    {
      m_OM.ClickOnObject();
    }
  }
  
  // --------------------------------
  // RightClick
  // --------------------------------
  RightClick(evt)
  {

  }
}