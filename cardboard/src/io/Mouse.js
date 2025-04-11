class MouseManager
{
  constructor()
  {
    this.m_arrPosition = [];
  }

  GetPosition() { return this.m_arrPosition; }

  // --------------------------------
  // Move
  // --------------------------------
  Move(evt)
  {
    var rect = myGameArea.canvas.getBoundingClientRect();
    this.m_arrPosition = [ evt.clientX - rect.left, evt.clientY - rect.top ];
    if (g_DM.IsDialogShowing())
    {
      var cDialog = g_DM.GetCurrentDialog();
      if (GEO.IsInRect(this.m_arrPosition, cDialog.GetBounds()))
      {
        cDialog.CheckForHighlights(this.m_arrPosition);
      }
    }
    else if (g_OM.GetGrabbedObject() == null)
    {
      if (g_PM.CheckMouse(this.m_arrPosition) == false && GEO.IsInRect(this.m_arrPosition, CONST.CANVAS_VIEW_AREA))
      {
        g_OM.MouseMove(this.m_arrPosition);
      }
    }
    else if (GEO.IsInRect(this.m_arrPosition, CONST.CANVAS_VIEW_AREA))
    {
      g_OM.MouseMove(this.m_arrPosition);
    }
  };

  // --------------------------------
  // LeftClick
  // --------------------------------
  LeftClick(evt)
  {
    if (g_DM.IsDialogShowing())
      {
        var cDialog = g_DM.GetCurrentDialog();
        if (GEO.IsInRect(this.m_arrPosition, cDialog.GetBounds()))
        {
          cDialog.OnClick(this.m_arrPosition);
        }
      }
    else if (g_PM.CheckMouse(this.m_arrPosition, true) == false && GEO.IsInRect(this.m_arrPosition, CONST.CANVAS_VIEW_AREA))
    {
      g_OM.ClickOnObject(this.m_arrPosition);
    }
  }
  
  // --------------------------------
  // RightClick
  // --------------------------------
  RightClick(evt)
  {

  }
}