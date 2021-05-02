var MOUSE = (function () {
  // const
  const NO_HIGHLIGHT = -1;
  const VIEW_AREA = { left:0, top:0, right:600, bottom:600 };
  // function
  var mouse = {};

  mouse.Move = function(evt)
  {
    // var idx;
    // var arrPosition = mouse.GetMousePosition(evt);
  };

  mouse.LeftClick = function(evt)
  {
    var idx;
    var arrPosition = mouse.GetMousePosition(evt);
    if (GEO.IsInRect(arrPosition, VIEW_AREA))
    {
      var arrEntities;
      var cPawn = null;
      var cNode = FIELD.FindNodeFromCords(arrPosition);
      if (cNode != null)
      {
        console.debug("Found node)");
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
          FIELD.SetHighlight(cNode.idx);
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

  mouse.GetMousePosition = function(evt)
  {
    var rect = myGameArea.canvas.getBoundingClientRect();
    return [ evt.clientX - rect.left, evt.clientY - rect.top ];
  };



  return mouse;
}());
