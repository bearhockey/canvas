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
    if (Main.GetDialogManager().IsDialogShowing())
    {
      var cDialog = Main.GetDialogManager().GetCurrentDialog();
      if (GEO.IsInRect(this.m_arrPosition, cDialog.GetBounds()))
      {
        cDialog.CheckForHighlights(this.m_arrPosition);
      }
    }
    else if (Main.GetObjectManager().GetGrabbedObject() == null)
    {
      if (Main.GetPanelManager().CheckMouse(this.m_arrPosition) == false && GEO.IsInRect(this.m_arrPosition, CONST.CANVAS_VIEW_AREA))
      {
        Main.GetObjectManager().MouseMove(this.m_arrPosition);
      }
    }
    else if (GEO.IsInRect(this.m_arrPosition, CONST.CANVAS_VIEW_AREA))
    {
      Main.GetObjectManager().MouseMove(this.m_arrPosition);
    }
  };

  // --------------------------------
  // LeftClick
  // --------------------------------
  LeftClick(evt)
  {
    if (Main.GetDialogManager().IsDialogShowing())
      {
        var cDialog = Main.GetDialogManager().GetCurrentDialog();
        if (GEO.IsInRect(this.m_arrPosition, cDialog.GetBounds()))
        {
          cDialog.OnClick(this.m_arrPosition);
        }
      }
    else if (Main.GetPanelManager().CheckMouse(this.m_arrPosition, true) == false && GEO.IsInRect(this.m_arrPosition, CONST.CANVAS_VIEW_AREA))
    {
      Main.GetObjectManager().ClickOnObject(this.m_arrPosition);
    }
  }
  
  // --------------------------------
  // RightClick
  // --------------------------------
  RightClick(evt)
  {

  }
}