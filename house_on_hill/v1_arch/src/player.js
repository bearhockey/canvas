var PLAYER = (function () {
  const PROFILE_DIR = "./res/player_profile/";
  const DEFAULT_PROFILE = "default_profile.png";

  const STAT_SPEED = 0;
  const STAT_MIGHT = 1;
  const STAT_SANITY = 2;
  const STAT_KNOWLEDGE = 3;
  const DEFAULT_STAT = 3;

  var player = function(idx, color = "black", strName = "Player", arrStats = [])
  {
    this.idx = idx;
    this.iFloor = 1;
    this.iMoves = 0;

    this.iSpeed = (arrStats && arrStats.length > STAT_SPEED) ? arrStats[STAT_SPEED] : DEFAULT_STAT;
    this.iMight = (arrStats && arrStats.length > STAT_MIGHT) ? arrStats[STAT_MIGHT] : DEFAULT_STAT;
    this.iSanity = (arrStats && arrStats.length > STAT_SANITY) ? arrStats[STAT_SANITY] : DEFAULT_STAT;
    this.iKnowledge = (arrStats && arrStats.length > STAT_KNOWLEDGE) ? arrStats[STAT_KNOWLEDGE] : DEFAULT_STAT;

    this.strName = strName;
    this.strProfile = DEFAULT_PROFILE;
    this.color = color;
    this.arrInventory = [];

    this.GetName      = function() { return this.strName; }
    this.GetProfile   = function() { return (PROFILE_DIR + this.strProfile); }
    this.GetInventory = function() { return this.arrInventory; }

    this.ResetMoves = function(iAddition = 0)
    {
      this.iMoves = this.iSpeed + iAddition;
    }

    this.Move = function(iDirection)
    {
      if (this.iMoves > 0)
      {
        var bMoved = false;
        var iTileIdx = LEVEL.GetDirection(this.idx, iDirection);
        var objTile;

        if (iTileIdx > -1)
        {
          objTile = LEVEL.GetTile(this.idx, this.iFloor);
          if (objTile.doors[iDirection])
          {
            this.idx = iTileIdx;
            bMoved = true;
          }
        } // iTileIdx check
      } // iMoves check

      if (bMoved)
      {
        this.iMoves--;
        myGameArea.Update();
      }
    };

    this.UseStairs = function()
    {
      if (this.iMoves > 0)
      {
        this.iMoves--;
        this.iFloor = LEVEL.UseStairs(this.idx);
        myGameArea.Update();
      }
    }

    this.AddItem = function(objItem)
    {
      this.arrInventory.push(objItem);
    }

    this.Update = function()
    {
      LEVEL.Update(this.idx);
    };

    this.Draw = function(ctx, iPosition = 0, bCurrentPlayer = false)
    {
      var cCords = LEVEL.GetTileCords(this.idx);
      var x = cCords.x - CAMERA.iPosX;
      var y = cCords.y - CAMERA.iPosY;
      ctx.fillStyle = this.color;
      var iSize = GRID.iSize / 3;
      var iOffsetX = (bCurrentPlayer) ? iSize : (iSize/2 + iSize*(iPosition%2));
      var iOffsetY = (bCurrentPlayer) ? iSize : (iSize/2 + iSize*Math.floor(iPosition/2));
      ctx.fillRect(GRID.Normalize(x, iOffsetX), GRID.Normalize(y, iOffsetY), iSize, iSize);
    };
  };

  return player;
}());
