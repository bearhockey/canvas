var NODE = (function () {
  // privates
  const DEFAULT_NODE_COLOR = "#000000";
  // main
  var node = function(idx, bIsPassable=true, color=DEFAULT_NODE_COLOR)
  {
    this.idx = idx;
    this.color = color;
    this.bIsPassable = bIsPassable;
    this.bHighlight = false;
    this.arrEntities = [];
    this.objPathData = null;
    this.polygon = null; // stores polygon points for bounds testing

    this.GetIdx      = function() { return this.idx; };
    this.GetPathData = function() { return this.objPathData; };
    this.GetPolygon  = function() { return this.polygon; };

    // ----------------
    // this.IsPassable
    //     Checks if the node is passable, both intrinsicly and if any entities block movement
    // ----------------
    this.IsPassable = function()
    {
      var bPawnPassable = true;
      var idx;
      var iEntitiesLength = this.arrEntities.length;
      for (idx = 0; idx < iEntitiesLength; ++idx)
      {
        if (!this.arrEntities[idx].GetPassable())
        {
          bPawnPassable = false;
          break;
        }
      }

      return (this.bIsPassable && bPawnPassable);
    }

    // this.GetCords
    //     Returns an array of cords for the corresponding field node
    this.GetCords = function()
    {
      return FIELD.GetCords(this.idx);
    };

    this.GetPosition = function(bGetCenter=true)
    {
      return FIELD.GetPosition(this.idx, bGetCenter);
    };

    // ----------------
    // this.AddPathData
    //     Adds temporary path data to the node for determining paths
    // ----------------
    this.AddPathData = function(objData)
    {
      if (this.objPathData == null) { this.objPathData = objData; }
      else
      {
        this.objPathData = Object.assign(this.objPathData, objData);
      }
    };

    // ----------------
    // this.ClearPathData
    //     Clears the path data for future path algorithms
    // ----------------
    this.ClearPathData = function() { this.objPathData = null; };

    // ----------------
    // this.PlaceEntity
    //     Moves an ENTITY to this node from an old node (removes the old one if possible)
    // ----------------
    this.PlaceEntity = function(cEntity)
    {
      if (cEntity == null) { return; } // no entity
      if (this.arrEntities.indexOf(cEntity) > -1) { return; } // already there

      var cOldNode = cEntity.GetNode();
      this.arrEntities.push(cEntity);
      cEntity.SetNode(this);
      if (cOldNode) { cOldNode.RemoveEntity(cEntity); }
    };

    // ----------------
    // this.RemoveEntity
    //     Removes an entity from this node
    // @params - cEntity:ENTITY - Entity to remove
    // ----------------
    this.RemoveEntity = function(cEntity)
    {
      if (cEntity == null) { return; } // no entity
      var idx = this.arrEntities.indexOf(cEntity);
      if (idx > -1)
      {
        this.arrEntities.splice(idx, 1);
      }
    };

    // ----------------
    // this.GetResource
    //     Returns the first instance of a resource type in this node
    // ----------------
    this.GetResource = function(iResourceType)
    {
      var cEntity;
      var idx;
      var iEntitiesLength = this.arrEntities.length;
      for (idx = 0; idx < iEntitiesLength; ++idx)
      {
        cEntity = this.arrEntities[idx];
        if (cEntity != null &&
            cEntity.iResourceType != null &&
            cEntity.iResourceType == iResourceType)
        {
          return cEntity;
        }
      } // end for loop

      return null; // nothing found
    };

    // ----------------
    // this.GetDistance
    //     Returns the distance (as the crow flies) between this and nother node
    // ----------------
    this.GetDistance = function(cOtherNode)
    {
      var arrCords = this.GetCords();
      var arrTargetCords = cOtherNode.GetCords();

      var iXDiff = Math.abs(arrCords[0] - arrTargetCords[0]);
      var iYDiff = Math.abs(arrCords[1] - arrTargetCords[1]);

      return Math.sqrt((iXDiff*iXDiff) + (iYDiff*iYDiff));
    };

    // ----------------
    // this.Draw
    //     Draws the node a certain color - useful for debugging
    // ----------------
    this.Draw = function(ctx, color=null)
    {
      var arrPosition = this.GetPosition();
      var nodeColor = (color != null) ? color : this.color;
      if (FIELD.GetDrawMode() == CONST.DRAW_ISO)
      {
        this.polygon = ISO.DrawTile(ctx, arrPosition, FIELD.GetNodeSize()/2, nodeColor);
      }
      else
      {
        this.polygon = GEO.DrawShape(GEO.SQUARE, ctx, arrPosition[0], arrPosition[1], FIELD.GetNodeSize()/2, nodeColor);
      }
      // degbug text
      if (FIELD.GetNodeSize() > 40)
      {
        ctx.font = '9px serif';
        ctx.fillStyle = "#000000";
        ctx.fillText(this.idx.toString(), arrPosition[0], arrPosition[1]);
      }
    };

    // ----------------
    // this.DrawEntities
    //     Draws any entities within this node
    // @params - ctx - Drawing contex
    // ----------------
    this.DrawEntities = function(ctx)
    {
      var idx;
      var iEntitiesLength = this.arrEntities.length;
      for (idx = 0; idx < iEntitiesLength; ++idx)
      {
        this.arrEntities[idx].Draw(ctx);
      }
    };

    // ----------------
    // this.Print
    //     Returns a string of info to print out in a text field
    // ----------------
    this.Print = function()
    {
      var strReturn = "<ul>";
      strReturn += "<li>IDX : " + this.idx.toString() + "</li>";
      strReturn += "<li>COLOR : " + this.color.toString() + "</li>";
      strReturn += "<li>ENTITIES: " + this.arrEntities.toString() + "</li>";
      strReturn += "</il>";

      return strReturn;
    };
  }; // end of class

  return node;
}());
