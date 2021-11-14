var FLOOR = (function () {
  var field = {};

  const GRID_SIZE = 16; // a box of AxA
  const NODE_SIZE = 16; // pixels sized nodes

  field.iDrawMode = CONST.DRAW_ORTH;

  field.iOffset = 10;
  field.bShowGrid = false;
  field.arrNodes = [];
  field.iHighlightIdx = -1;
  field.iCursorIdx = -1;

  field.arrVisibleNodes = [];

  field.Init = function()
  {
    var idx;
    for (idx = 0; idx < GRID_SIZE*GRID_SIZE; ++idx)
    {
      field.arrNodes.push(new NODE(idx, true, field.GetRandomGrassColor()));
    }
  };

  field.GetDrawMode = function() { return field.iDrawMode; };
  field.GetRowSize  = function() { return GRID_SIZE; };
  field.GetNodeSize = function() { return NODE_SIZE*CAMERA.GetCameraZoom(); };

  field.ChangeDrawMode = function(iDrawMode)
  {
    field.iDrawMode = iDrawMode;
  }

  // ----------------
  // field.GetNode
  //     Returns a node specified by the index
  // ----------------
  field.GetNode = function(idx)
  {
    if (idx >= 0 && idx < field.arrNodes.length)
    {
      return field.arrNodes[idx];
    }

    return null;
  };

  // ----------------
  // field.GetNodeNeighbors
  //     Returns an array of nodes that are neighbors to the current node
  // @params - cNode        :Node    - Node to look for neighbors
  // @params - bOnlyPassable:Boolean - Only add neighbors that can be passed through
  // ----------------
  field.GetNodeNeighbors = function(cNode, bOnlyPassable=false)
  {
    if (cNode == null) { return null; }

    var arrNeighbors = [];
    var idx = cNode.idx;
    var arrNodeCords = field.GetCords(idx);
    var x;
    var y;
    var cNeighbor;
    for (y = arrNodeCords[1]-1; y <= arrNodeCords[1]+1; ++y)
    {
      for (x = arrNodeCords[0]-1; x <= arrNodeCords[0]+1; ++x)
      {
        cNeighbor = field.GetNodeFromCords([x, y]);
        if (cNeighbor && cNeighbor != cNode && (!bOnlyPassable || cNeighbor.IsPassable()))
        {
          arrNeighbors.push(cNeighbor);
        }
      } // end for loop x
    } // end for loop y

    return arrNeighbors;
  };

  field.OrthToIso = function(arrPosition, iNodeSize, iCenterOffset=0)
  {
    var y = arrPosition[1];
    var iIsoOffset = 300;
    var iRowOffset = y * (iNodeSize/2);
    var isoX = arrPosition[0] * iNodeSize/2 + field.iOffset + iCenterOffset - iRowOffset + iIsoOffset;
    var isoY = (arrPosition[1]/4) * iNodeSize + field.iOffset + iCenterOffset + (arrPosition[0] * iNodeSize/4);
    return [isoX, isoY];
  };

  // ----------------
  // field.GetPosition
  //     Returns the position of something
  // ----------------
  field.GetPosition = function(idx, bIsCenter=true)
  {
    var arrCameraPos = CAMERA.GetCameraCords();
    var x = (idx % GRID_SIZE) - arrCameraPos[0];
    var y = Math.floor(idx / GRID_SIZE) - arrCameraPos[1];
    var iNodeSize = NODE_SIZE * CAMERA.GetCameraZoom();
    var iCenterOffset = (bIsCenter) ? iNodeSize/2 : 0;
    if (field.GetDrawMode() == CONST.DRAW_ISO)
    {
      return field.OrthToIso([x, y], iNodeSize, iCenterOffset);
    }
    else
    {
      return [x * iNodeSize + field.iOffset + iCenterOffset,
              y * iNodeSize + field.iOffset + iCenterOffset];
    }
  };

  // ----------------DRAW_MODE == "iso"
  // field.GetCords
  //     Returns an array of cords for the corresponding field node
  // ----------------
  field.GetCords = function(idx)
  {
    var x = idx % GRID_SIZE;
    var y = Math.floor(idx / GRID_SIZE);
    return [x, y];
  };

  // ----------------
  // field.GetIdxFromCords
  //     Returns an idx corresponding to the cords given
  // ----------------
  field.GetIdxFromCords = function(arrCords)
  {
    var x = arrCords[0];
    var y = arrCords[1];
    if      (x < 0 || x >= GRID_SIZE) { return -1;}
    else if (y < 0 || y > GRID_SIZE) { return -1; }
    return (y * GRID_SIZE) + x;
  };

  field.GetNodeFromCords = function(arrCords)
  {
    var cNode = null;
    var idx = field.GetIdxFromCords(arrCords);
    if (idx >= 0 && idx < field.arrNodes.length)
    {
      cNode = field.GetNode(idx);
    }

    return cNode;
  };

  // ----------------
  // field.GetNodesFromArea
  //     Returns an array of nodes from a given x by y area
  // ----------------
  field.GetNodesFromArea = function(arrCords, iWidth, iHeight)
  {
    var arrNodes = [];
    var cNode;
    var x;
    var y;
    for (y = arrCords[1]; y < iHeight + arrCords[1]; ++y)
    {
      for (x = arrCords[0]; x < iWidth + arrCords[0]; ++x)
      {
        cNode = field.GetNodeFromCords([x,y]);
        if (cNode != null) { arrNodes.push(cNode); }
      } // end x loop
    } // end y loop

    return arrNodes;
  };

  // ----------------
  // field.GetNodesFromRadius
  //     Gets all nodes within a certain radius of cNode
  // ----------------
  field.GetNodesFromRadius = function(cNode, iRadius)
  {
    var cNode;
    var arrNodes = [];
    var arrOriginalCords = field.GetCords(cNode.idx);
    var x1 = arrOriginalCords[0]-iRadius;
    var x2 = arrOriginalCords[0]+iRadius;
    var y1 = arrOriginalCords[1]-iRadius;
    var y2 = arrOriginalCords[1]+iRadius;
    var ix, iy;
    for (iy = y1; iy < y2; ++iy)
    {
      for (ix = x1; ix < x2; ++ix)
      {
        cNode = field.GetNodeFromCords([ix, iy]);
        if (cNode != null) { arrNodes.push(cNode); }
      }
    } // iy for loop

    return arrNodes;
  }

  // ----------------
  // field.GetEntities
  //     Gets all entities within a certain range
  // ----------------
  field.GetEntities = function(cNode, iRadius)
  {
    var arrNodes = field.GetNodesFromRadius(cNode, iRadius);
    var arrEntities = [];
    var arrNodeEntities;
    var idx;
    var iEntIdx;
    var iNodesLength = arrNodes.length;
    for (idx = 0; idx < iNodesLength; ++idx)
    {
      arrNodeEntities = arrNodes[idx].arrEntities;
      if (arrNodeEntities != null)
      {
        for (iEntIdx = 0; iEntIdx < arrNodeEntities.length; ++iEntIdx)
        {
          arrEntities.push(arrNodeEntities[iEntIdx]);
        } // end iEntIdx for loop
      }
    } // end idx for loop

    return arrEntities;
  };

  // ----------------
  // field.GetNearestResource
  // ----------------
  field.GetNearestResource = function(cNode, iRadius, iResourceType)
  {
    var arrEntities = field.GetEntities(cNode, iRadius);
    if (arrEntities.length < 1) { return null; } // no entities at alll
    var idx;
    var cEntity;
    var nBestDistance = Number.MAX_VALUE;
    var nDistance;
    var idxBest = -1;

    var iEntitiesLength = arrEntities.length;
    for (idx = 0; idx < iEntitiesLength; ++idx)
    {
      cEntity = arrEntities[idx];
      if (cEntity == null) { continue; }
      if (cEntity.iResourceType == null || cEntity.iResourceType != iResourceType) { continue; }
      nDistance = cNode.GetDistance(cEntity.GetNode());
      if (nDistance < nBestDistance)
      {
        idxBest = idx;
        nBestDistance = nDistance;
      }
    } // end for loop

    return arrEntities[idxBest];
  };

  // ----------------
  // field.FindNodeFromCords
  //     Finds a node from given coordinates
  // ----------------
  field.FindNodeFromCords = function(arrCords)
  {
    // var arrCameraPos = CAMERA.GetCameraCords();
    // var x = Math.floor((arrCords[0] - field.iOffset) / NODE_SIZE)+arrCameraPos[0];
    // var y = Math.floor((arrCords[1] - field.iOffset) / NODE_SIZE)+arrCameraPos[1];

    // var cNode = field.GetNodeFromCords([x, y]);
    var cNode;
    var idx;
    var iNodesLength = field.arrVisibleNodes.length;
    for (idx = 0; idx < iNodesLength; ++idx)
    {
      cNode = field.arrVisibleNodes[idx];
      if (cNode != null)
      {
        if (GEO.InsidePolygon(arrCords, cNode.GetPolygon()))
        {
          return cNode;
        }
      }
    } // end of for loop

    return null;
  };

  field.SetHighlight = function(idx) { field.iHighlightIdx = idx; };
  field.SetCursor    = function(idx) { field.iCursorIdx    = idx; };

  // ----------------
  // field.GetRandomGrassColor
  //     Does what it says on the tin
  // ----------------
  field.GetRandomGrassColor = function()
  {
    var r = Math.floor(Math.random()*10) + 10;
    var g = Math.floor(Math.random()*10) + 120;
    var b = Math.floor(Math.random()*15) + 5;
    return "rgb(" + r.toString() + "," + g.toString() + "," + b.toString() + ")";
  };

  // ----------------
  // field.Draw
  //     Draws the field
  // ----------------
  field.Draw = function(ctx, bShowImpassible=false)
  {
    var arrNodes = field.arrVisibleNodes = field.arrNodes; // TODO: fix this so its not every node
    // this.arrVisibleNodes = field.GetNodesFromArea(CAMERA.GetCameraCords(), CAMERA.GetCameraWidth(), CAMERA.GetCameraHeight());
    if (field.bShowGrid)
    {
      field.DrawGrid(ctx);
    }

    var idx;
    var iNodesLength = arrNodes.length;
    var cNode;
    var cEntity;
    for (idx = 0; idx < iNodesLength; ++idx)
    {
      cNode = arrNodes[idx];
      if (cNode != null)
      {
        if (bShowImpassible && !cNode.IsPassable())
        {
          cNode.Draw(ctx, IMPASS_COLOR);
        }
        else
        {
          cNode.Draw(ctx);
        }

        cNode.DrawEntities(ctx);
      }
    } // end for loop

    field.DrawHighlightedNode(ctx);
    field.DrawCursor(ctx);
  };

  // ----------------
  // field.DrawHighlightedNode
  //
  // ----------------
  field.DrawHighlightedNode = function(ctx)
  {
    if (this.iHighlightIdx >= 0)
    {
      field.GetNode(this.iHighlightIdx).Draw(ctx, HIGHLIGHT_COLOR);
    }
  };

  // ----------------
  // this.DrawCursor
  // ----------------
  field.DrawCursor = function(ctx)
  {
    if (this.iCursorIdx >= 0)
    {
      field.GetNode(this.iCursorIdx).Draw(ctx, CURSOR_COLOR);
    }
  };

  // ----------------
  // field.DrawGrid
  // ----------------
  field.DrawGrid = function(ctx)
  {
    var idx, x;
    var iOffset = field.iOffset;
    ctx.beginPath();

    x = iOffset;
    for (idx = 0; idx <= GRID_SIZE; ++idx)
    {
      ctx.moveTo(x, iOffset);
      ctx.lineTo(x, GRID_SIZE*NODE_SIZE + iOffset);
      x += NODE_SIZE;
    }

    x = iOffset;
    for (idx = 0; idx <= GRID_SIZE; ++idx)
    {
      ctx.moveTo(iOffset, x);
      ctx.lineTo(GRID_SIZE*NODE_SIZE + iOffset, x);
      x += NODE_SIZE;
    }

    ctx.strokeStyle = "#EEEEEE";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    ctx.stroke();

    ctx.setLineDash([]); // reset line dash
  };

  return field;
}());
