var RESOURCE = (function () {
  // privates
  // main
  var resource = function(cNode, iResourceType=-1, iQuantity=1)
  {
    // overloaded methods - must be predefined
    this.GetNode = function() {};
    this.SetNode = function() {};
    this.GetPassable = function() {};
    this.MarkAsTarget = function() {};
    this.ClearTarget  = function() {};

    this.iResourceType = iResourceType;
    this.iQuantity = iQuantity;

    var iShape = -1;
    var strColor;
    var iHealth = 10; // maybe change this
    switch (this.iResourceType)
    {
      case CONST.RESOURCE_TREE:
      {
        iShape = GEO.TRIANGLE;
        strColor = "#227733";
        break;
      }
      case CONST.RESOURCE_STONE:
      {
        iShape = GEO.SQUARE;
        strColor = "#AAAABB";
        break;
      }
      default: break;
    } // end switch
    // needs to be done after overloaded methods
    this.entity = new ENTITY(this, cNode, iHealth, iShape, strColor);

    this.GetNode = function(cNode) { return this.entity.GetNode(); };
    this.SetNode = function(cNode) { this.entity.SetNode(cNode); };

    this.GetPassable = function() { return this.entity.GetPassable(); };

    this.MarkAsTarget = function() { this.entity.MarkAsTarget(); };
    this.ClearTarget  = function() { this.entity.ClearTarget(); };

    // ----------------
    // this.Harvest
    //     Harvests resources
    // ----------------
    this.Harvest = function(iDamage)
    {
      this.iQuantity -= iDamage;
      if (this.iQuantity < 1)
      {
        this.ClearTarget();
        this.GetNode().RemoveEntity(this);
      }

      return Math.min(iDamage, iDamage + this.iQuantity);
    };

    // ----------------
    // this.Draw
    //     Draws the pawn
    // ----------------
    this.Draw = function(ctx)
    {
      this.entity.Draw(ctx);
    };
  };

  return resource;
}());
