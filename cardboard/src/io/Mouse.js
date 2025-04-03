class MouseManager
{
  constructor()
  {
    this.arrPosition = [];
  }

  GetPosition() { return this.arrPosition; }

  // --------------------------------
  // Move
  // --------------------------------
  Move(evt)
  {
    var rect = myGameArea.canvas.getBoundingClientRect();
    this.arrPosition = [ evt.clientX - rect.left, evt.clientY - rect.top ];
    if (g_DM.IsDialogShowing())
    {
      var cDialog = g_DM.GetCurrentDialog();
      if (GEO.IsInRect(this.arrPosition, cDialog.GetBounds()))
      {
        cDialog.CheckForHighlights(this.arrPosition);
      }
    }
    else if (g_OM.GetGrabbedObject() == null)
    {
      if (GEO.IsInRect(this.arrPosition, cTopPanel.GetBounds()))
      {
        cTopPanel.CheckForHighlights(this.arrPosition);
      }
      else if (GEO.IsInRect(this.arrPosition, CONST.CANVAS_VIEW_AREA))
      {
        g_OM.MouseMove(this.arrPosition);
      }
    }
    else if (GEO.IsInRect(this.arrPosition, CONST.CANVAS_VIEW_AREA))
    {
      g_OM.MouseMove(this.arrPosition);
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
        if (GEO.IsInRect(this.arrPosition, cDialog.GetBounds()))
        {
          cDialog.OnClick(this.arrPosition);
        }
      }
    else if (GEO.IsInRect(this.arrPosition, cTopPanel.GetBounds()))
    {
      cTopPanel.OnClick(this.arrPosition);
    }
    else if (GEO.IsInRect(this.arrPosition, cRightPanel.GetBounds()))
    {
      cRightPanel.OnClick(this.arrPosition);
    }
    else if (GEO.IsInRect(this.arrPosition, CONST.CANVAS_VIEW_AREA))
    {
      g_OM.ClickOnObject(this.arrPosition);
    }
  }
  
  // --------------------------------
  // RightClick
  // --------------------------------
  RightClick(evt)
  {

  }
}