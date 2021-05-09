var ENTITY = (function () {
  // privates
  // main
  var entity = function(cParent, cNode, iHealth=10, iShape=0, strColor="#EEEEEE", bIsPassable=true)
  {
    // overloaded methods - must be predefined
    this.GetNode      = function() {};
    this.SetNode      = function() {};
    this.GetPassable  = function() {};
    this.SetPassable  = function() {};
    this.MarkAsTarget = function() {};
    this.ClearTarget  = function() {};
    this.GetHealth    = function() {};
    this.ModifyHealth = function() {};

    this.cParent = cParent;
    this.iHealth = iHealth;
    this.cNode = cNode;
    this.iShape = iShape;
    this.strColor = strColor;
    this.bIsPassable = bIsPassable;
    this.bIsTarget = false;
    this.cTracker = null; // if this is target, something is tracking it

    if (this.cNode)
    {
      this.cNode.PlaceEntity((this.cParent != null) ? this.cParent : this);
    }

    this.GetNode = function(cNode) { return this.cNode; };
    this.SetNode = function(cNode) { this.cNode = cNode; };

    this.GetPassable = function(cNode)       { return this.bIsPassable; };
    this.SetPassable = function(bIsPassable) { this.bIsPassable = bIsPassable; };

    this.MarkAsTarget = function(cTracker = null)
    {
      this.bIsTarget = true;
      this.cTracker = cTracker;
    };
    this.ClearTarget  = function()
    {
      this.bIsTarget = false;
      this.cTracker = null;
    };
    this.GetTracker = function() { return this.cTracker; };

    this.GetHealth = function() { return this.iHealth; };
    this.ModifyHealth = function(iDelta)
    {
      this.iHealth -= iDelta;
      return this.iHealth;
    };

    // ----------------
    // this.Draw
    //     Draws the pawn
    // ----------------
    this.Draw = function(ctx)
    {
      if (this.cNode)
      {
        var arrPosition = this.cNode.GetPosition();
        var strColor = (DEBUG_ON && this.bIsTarget) ? "#FF3399" : this.strColor;
        var iRadius = FIELD.GetNodeSize()/4;
        GEO.DrawShape(this.iShape, ctx, arrPosition[0], arrPosition[1], iRadius, strColor);
      }
    };
  };

  return entity;
}());
