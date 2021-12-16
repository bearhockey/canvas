var NPC = (function () {
  // consts
  // main
  var npc = function(iSight = 4)
  {
    this.iSightRange = iSight;
    this.cChaseTarget = null;
    // ----------------
    // Wander
    //     Wanders around in a random direction
    // ----------------
    this.Wander = function(cPawn)
    {
      if (Math.random() > 0.5) // TODO make this better
      {
        var cFloor = GetFloor(); // assume we are always on the current floor
        var iDirection = UTILS.GetRandomDirection();
        cPawn.Move(iDirection, cFloor);
      }
    };

    // ----------------
    // Chase
    //     Chases down an enemy
    // ----------------
    this.Chase = function(cPawn)
    {
      var cFloor = GetFloor();
      var cThisTile = cPawn.GetTile();
      var cTargetTile = this.cChaseTarget.GetTile();
      var iFloorWidth = cFloor.GetFloorWidth();
      if (cThisTile != null && cTargetTile != null)
      {
        var idxSource = cThisTile.GetIdx();
        var idxTarget = cTargetTile.GetIdx();
        // TODO - make this into a utils function
        if (idxTarget > idxSource)
        {
          if (idxSource + iFloorWidth <= idxTarget)
          {
            cPawn.Move(CONST.SOUTH, cFloor);
          }
          else if (idxTarget % iFloorWidth < idxSource % iFloorWidth)
          {
            cPawn.Move(CONST.WEST, cFloor);
          }
          else
          {
            cPawn.Move(CONST.EAST, cFloor);
          }
        }
        else if (idxTarget < idxSource)
        {
          if (idxSource - iFloorWidth >= idxTarget)
          {
            cPawn.Move(CONST.NORTH, cFloor);
          }
          else if (idxTarget % iFloorWidth < idxSource % iFloorWidth)
          {
            cPawn.Move(CONST.WEST, cFloor);
          }
          else
          {
            cPawn.Move(CONST.EAST, cFloor);
          }
        }
      }
    };

    // ----------------
    // MeleeAttack
    //     Melee attacks the enemy
    // ----------------
    this.MeleeAttack = function(cPawn, cTarget)
    {
      COMBAT.AttackPawn(cPawn, cTarget, false);
    };

    // ----------------
    // Act
    //     Has the NPC do their actions
    // ----------------
    this.Act = function(cPawn)
    {
      var cHero = GetHero();
      var iPosition = cPawn.GetTile().GetIdx();
      var arrVisionRange = GetFloor().GetVisualTiles(iPosition, this.iSightRange);
      var iRangeLength = arrVisionRange.length;
      var idx;
      var cTile;
      var arrEntities;

      this.cChaseTarget = null; // clear out the chase target for now
      // later on we'll want to implement a chase range and cooldown period
      for (idx = 0; idx < iRangeLength; ++idx)
      {
        cTile = arrVisionRange[idx];
        if (cTile != null)
        {
          arrEntities = cTile.GetEntities();
          if (arrEntities != null && arrEntities.indexOf(cHero) >= 0)
          {
            this.cChaseTarget = cHero;
            break; // should be fine to break unless we ever want to have priority targets
          }
        }
      } // end of for loop

      if (this.cChaseTarget != null)
      {
        if ( cPawn.IsTileAdjacent(this.cChaseTarget.GetTile(), GetFloor()) )
        {
          this.MeleeAttack(cPawn, this.cChaseTarget);
        }
        else
        {
          this.Chase(cPawn);
        }
      }
      else
      {
        this.Wander(cPawn);
      }
    };
  }; // end of class

  return npc;
}());
