var TILE = (function () {
  // privates
  const DEFAULT_NODE_COLOR = "#000000";
  // main
  var tile = function(idx, bIsPassable=true, color=DEFAULT_NODE_COLOR)
  {
    this.idx = idx;
    this.color = color;
    this.bIsPassable = bIsPassable;
    this.bIsDiscovered = true;
    this.bIsVisible = false;
    this.arrEntities = [];
    // this.objPathData = null; // might need pathing?

    this.GetIdx       = function() { return this.idx; };
    this.GetColor     = function() { return this.color; };
    this.IsDiscovered = function() { return this.bIsDiscovered; };
    this.IsVisible    = function() { return this.bIsVisible; };

    // ----------------
    // this.IsPassable
    //     Checks if the node is passable, both intrinsicly and if any entities block movement
    // ----------------
    this.IsPassable = function()
    {
      var bPawnPassable = true;
      var idx;
      var iEntitiesLength = this.arrEntities.length;
      var objEntity;
      for (idx = 0; idx < iEntitiesLength; ++idx)
      {
        objEntity = this.arrEntities[idx];
        if (objEntity != null &&
            typeof objEntity.GetPassable === 'function' &&
            objEntity.GetPassable() == false)
        {
          bPawnPassable = false;
          break;
        }
      }

      return (this.bIsPassable && bPawnPassable);
    }

    // ----------------
    // this.PlaceEntity
    //     Moves an ENTITY to this tile from an old tile (removes the old one if possible)
    // ----------------
    this.PlaceEntity = function(cEntity)
    {
      if (cEntity == null) { return; } // no entity
      if (this.arrEntities.indexOf(cEntity) > -1) { return; } // already there

      var cOldTile = cEntity.GetTile();
      this.arrEntities.push(cEntity);
      cEntity.SetTile(this);
      if (cOldTile != null) { cOldTile.RemoveEntity(cEntity); }
    };

    // ----------------
    // this.RemoveEntity
    //     Removes an entity from this tile
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
    // this.Print
    //     Returns a string of info to print out in a text field
    // ----------------
    this.Print = function()
    {
      return "strReturn";
    };
  }; // end of class

  return tile;
}());
