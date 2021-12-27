var MOUSE = (function () {
  // const
  const VIEW_AREA = { left:0, top:0, right:960, bottom:960 };
  // function
  var mouse = {};
  mouse.arrPosition = [];
  mouse.strDragIcon = "";

  mouse.Move = function(evt)
  {
    mouse.arrPosition = mouse.GetMousePosition(evt);
    if (mouse.IsInView())
    {
      if (STATE.GetState() == STATE.STATE_DIALOG)
      {
        DIALOG.HandleMouseMove(mouse.arrPosition[0], mouse.arrPosition[1]);
      }
    }
  };

  // ----------------
  // LeftClick
  //     Handles left mouse clicks and screen taps
  // ----------------
  mouse.LeftClick = function(evt)
  {
    var idx;
    if (mouse.IsInView())
    {
      var iState = STATE.GetState();
      if (iState == STATE.STATE_INVENTORY)
      {
        INVENTORY.HandleMouseClick(mouse.arrPosition[0], mouse.arrPosition[1]);
      }
      else if (iState == STATE.STATE_DIALOG)
      {
        DIALOG.HandleMouseClick(mouse.arrPosition[0], mouse.arrPosition[1]);
      }
    } // end main vs side view check
  };

  mouse.RightClick = function(evt)
  {

  };

  // ----------------
  // mouse.IsInView
  // ----------------
  mouse.IsInView = function()
  {
    return (mouse.arrPosition[0] > VIEW_AREA.left &&
            mouse.arrPosition[0] < VIEW_AREA.right &&
            mouse.arrPosition[1] > VIEW_AREA.top &&
            mouse.arrPosition[1] < VIEW_AREA.bottom);
  };

  mouse.GetMousePosition = function(evt)
  {
    var rect = myGameArea.canvas.getBoundingClientRect();
    return [ evt.clientX - rect.left, evt.clientY - rect.top ];
  };

  mouse.SetDragIcon = function(cItem)
  {
    if (cItem != null && typeof cItem.GetIcon === 'function')
    {
      mouse.strDragIcon = cItem.GetIcon();
    }
  };

  return mouse;
}());
