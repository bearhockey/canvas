var MOUSE = (function () {
  // const
  const VIEW_AREA = { left:0, top:0, right:480, bottom:800 };
  // function
  var mouse = {};
  mouse.arrPosition = [];
  mouse.m_arrHitBoxes = [];

  // ----------------
  // mouse.IsInBox
  // ----------------
  mouse.IsInBox = function(x1, y1, x2, y2, bIncludeBounds = false)
  {
    if (bIncludeBounds)
    {
      return (mouse.arrPosition[0] >= x1 &&
              mouse.arrPosition[0] <= x2 &&
              mouse.arrPosition[1] >= y1 &&
              mouse.arrPosition[1] <= y2);
    }

    return (mouse.arrPosition[0] > x1 &&
            mouse.arrPosition[0] < x2 &&
            mouse.arrPosition[1] > y1 &&
            mouse.arrPosition[1] < y2);
  };

  // ----------------
  // mouse.IsInView
  // ----------------
  mouse.IsInView = function()
  {
    return mouse.IsInBox(VIEW_AREA.left, VIEW_AREA.top, VIEW_AREA.right, VIEW_AREA.bottom);
  };

  // ----------------
  // Move
  // ----------------
  mouse.Move = function(evt)
  {
    // mouse.arrPosition = mouse.GetMousePosition(evt);
  };

  // ----------------
  // MouseDown
  // ----------------
  mouse.MouseDown = function(evt)
  {
    // if (STATE.GetWaitState()) { return; } // disable mouse if client is waiting
  };

  // ----------------
  // MouseUp
  // ----------------
  mouse.MouseUp = function(evt)
  {
    // if (STATE.GetWaitState()) { return; } // disable mouse if client is waiting
  };

  // ----------------
  // LeftClick
  //     Handles left mouse clicks and screen taps
  // ----------------
  mouse.LeftClick = function(evt)
  {
    mouse.arrPosition = mouse.GetMousePosition(evt);
    if (mouse.IsInView())
    {
      var cHitBox = mouse.GetClickedHitBox();
      if (cHitBox != null)
      {
        cHitBox.Click();
      }
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

  // ----------------
  // AddHitBox
  // ----------------
  mouse.AddHitBox = function(cHitBox)
  {
    if (mouse.m_arrHitBoxes.includes(cHitBox))
    {
      console.warn("Warning: mouse.AddHitBox() called with duplicate HitBox: " + cHitBox);
    }
    else
    {
      mouse.m_arrHitBoxes.push(cHitBox);
    }
  };

  // ----------------
  // RemoveHitBox
  // ----------------
  mouse.RemoveHitBox = function(cHitBox)
  {
    var idx = mouse.m_arrHitBoxes.indexOf(cHitBox);
    if (idx > -1)
    {
      mouse.m_arrHitBoxes.splice(idx, 1);
    }
    else
    {
      console.warn("Warning: mouse.RemoveHitBox() called with no HitBox: " + cHitBox);
    }
  };

  // ----------------
  // ClearHitBoxes
  // ----------------
  mouse.ClearHitBoxes = function()
  {
    var cHitBox;
    while (mouse.m_arrHitBoxes.length > 0)
    {
      cHitBox = mouse.m_arrHitBoxes.pop();
      delete cHitBox;
    }
  };

  // ---------------
  // GetClickedHitBox
  // ----------------
  mouse.GetClickedHitBox = function()
  {
    var idx;
    var iLength = mouse.m_arrHitBoxes.length;
    var cHitBox;
    var arrBounds;
    for (idx = 0; idx < iLength; ++idx)
    {
      cHitBox = mouse.m_arrHitBoxes[idx];
      if (cHitBox != null)
      {
        arrBounds = cHitBox.GetBounds();
        if (mouse.IsInBox(arrBounds[0], arrBounds[1], arrBounds[2], arrBounds[3]))
        {
          return cHitBox;
        }
      }
    } // end of for loop

    return null;
  };

  return mouse;
}());
