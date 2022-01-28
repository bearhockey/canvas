var MOUSE = (function () {
  // const
  const VIEW_AREA = { left:0, top:0, right:400, bottom:600 };
  // function
  var mouse = {};
  mouse.arrPosition = [];
  mouse.strToolIcon = "";
  mouse.m_bToolStarted = false;

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

  // ----------------
  // Move
  // ----------------
  mouse.Move = function(evt)
  {
    mouse.arrPosition = mouse.GetMousePosition(evt);
    if (mouse.IsInView())
    {
      if (mouse.m_bToolStarted && STATE.CanDraw())
      {
        var ctx = GetCanvas();
        ctx.lineTo(mouse.arrPosition[0], mouse.arrPosition[1]);
        ctx.stroke();
      }
    }
  };

  // ----------------
  // MouseDown
  // ----------------
  mouse.MouseDown = function(evt)
  {
    if (!STATE.CanDraw()) { return; } // disable mouse if client is waiting
    var ctx = GetCanvas();
    if (mouse.IsInView())
    {
      ctx.beginPath();
      ctx.moveTo(mouse.arrPosition[0], mouse.arrPosition[1]);
      mouse.m_bToolStarted = true;
    }
  };

  // ----------------
  // MouseUp
  // ----------------
  mouse.MouseUp = function(evt)
  {
    if (!STATE.CanDraw()) { return; } // disable mouse if client is waiting
    if (mouse.m_bToolStarted)
    {
      mouse.m_bToolStarted = false;
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

    } // end main vs side view check
  };

  mouse.RightClick = function(evt)
  {

  };

  // ----------------
  // GetMousePosition
  // ----------------
  mouse.GetMousePosition = function(evt)
  {
    var rect = myGameArea.canvas.getBoundingClientRect();
    return [ evt.clientX - rect.left, evt.clientY - rect.top ];
  };

  return mouse;
}());
