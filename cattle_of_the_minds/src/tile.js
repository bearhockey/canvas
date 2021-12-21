var TILE = (function () {
  // privates
  const DEFAULT_NODE_COLOR = "#000000";
  // main
  var tile = function(idx, bIsPassable=true, bIsLit=false, color=DEFAULT_NODE_COLOR)
  {
    this.idx = idx;
    this.color = color;
    this.bIsPassable = bIsPassable;
    this.bIsLit = bIsLit;
    this.bIsDiscovered = false;
    this.bIsVisible = false;
    this.arrEntities = [];
    // this.objPathData = null; // might need pathing?

    this.GetIdx       = function() { return this.idx; };
    this.GetColor     = function() { return this.color; };
    this.GetEntities  = function() { return this.arrEntities; };
    this.IsPassable   = function() { return this.bIsPassable; };
    this.IsDiscovered = function() { return this.bIsDiscovered; };
    this.IsVisible    = function() { return this.bIsVisible; };
    this.HasEntity    = function() { return (this.arrEntities.length > 0); };

    this.GetEntities  = function() { return this.arrEntities; };

    // ----------------
    // GetStore
    //     Returns the first store on this tile - if it exists (assumes only one store per tile)
    // ----------------
    this.GetStore = function()
    {
      var bHasStore = false;
      var idx;
      var cPawn;
      var iLength = this.arrEntities.length;
      for (idx = 0; idx < iLength; ++idx)
      {
        cPawn = this.arrEntities[idx];
        if (cPawn != null && cPawn.GetPawnType() == CONST.PAWN_STORE)
        {
          bHasStore = true;
          break;
        }
      } // end for loop

      return (bHasStore) ? cPawn : null;
    };

    // ----------------
    // GetFirstEnemy
    //     Returns the first enemy on this tile, if exists
    // ----------------
    this.GetFirstEnemy = function()
    {
      var cPawn = null;
      var idx;
      var iLength = this.arrEntities.length;
      for (idx = 0; idx < iLength; ++idx)
      {
        cPawn = this.arrEntities[idx];
        if (cPawn != null && cPawn.iPawnType == CONST.PAWN_ENEMY)
        {
          return cPawn;
        }
      } // end of for loop

      return null;
    };

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
            typeof objEntity.IsPassable === 'function' &&
            objEntity.IsPassable() == false)
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
      if (cEntity == null) { return false; } // no entity
      var idx = this.arrEntities.indexOf(cEntity);
      if (idx > -1)
      {
        this.arrEntities.splice(idx, 1);
        return true;
      }

      return false;
    };

    // ----------------
    // Copy
    //     Returns a shallow copy of this tile
    // ----------------
    this.Copy = function(idx=-1)
    {
      return new TILE(idx, this.bIsPassable, this.bIsLit, this.color);
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
