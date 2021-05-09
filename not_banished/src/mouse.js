var MOUSE = (function () {
  // const
  const NO_HIGHLIGHT = -1;
  const VIEW_AREA = { left:0, top:0, right:600, bottom:600 };
  // function
  var mouse = {};

  mouse.arrPosition = [];
  mouse.cCurrenNode = null;

  mouse.Move = function(evt)
  {
    mouse.arrPosition = mouse.GetMousePosition(evt);
    if (mouse.IsInView())
    {
      mouse.cCurrentNode = FIELD.FindNodeFromCords(mouse.arrPosition);
      if (mouse.cCurrentNode != null)
      {
        FIELD.SetCursor(mouse.cCurrentNode.idx);
      }
    }
  };

  mouse.LeftClick = function(evt)
  {
    var idx;
    if (mouse.IsInView())
    {
      var arrEntities;
      var cPawn = null;
      var cNode = mouse.cCurrentNode;
      if (cNode == null) { cNode = FIELD.FindNodeFromCords(mouse.arrPosition); }
      if (cNode != null)
      {
        arrEntites = cNode.arrEntities;
        if (arrEntites != null && arrEntites.length > 0)
        {
          for (var idx = 0; idx < arrEntites.length; ++idx)
          {
            if (arrEntites[idx] && arrEntites[idx].strName)
            {
              cPawn = arrEntites[idx];
              break;
            }
          } // end for loop
        }

        if (cPawn != null && cPawn.strName != null)
        {
          SIDEPANEL.HighlightPawn(cPawn);
          FIELD.SetHighlight(NO_HIGHLIGHT);
        }
        else
        {
          SIDEPANEL.HighlightNode(cNode);
        }
      }
      else
      {
        FIELD.SetHighlight(NO_HIGHLIGHT);
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
    return GEO.IsInRect(mouse.arrPosition, VIEW_AREA);
  };

  mouse.GetMousePosition = function(evt)
  {
    var rect = myGameArea.canvas.getBoundingClientRect();
    return [ evt.clientX - rect.left, evt.clientY - rect.top ];
  };



  return mouse;
}());
