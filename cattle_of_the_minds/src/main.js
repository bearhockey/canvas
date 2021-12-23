// consts
const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 960;
const MAP_WIDTH = 15; // in tiles
const PLAYER_SIGHT_RANGE = 3;
// globals - don't use if you can
var cFirstFloor;
var cSecondFloor;
var iFloorWidth = 50;
var iPlaytime = 0; // playtime in seconds

var m_cHero;
var m_cCurrentFloor;
var m_arrFloors = [];

// ----------------
// StartGame
//     Starts the game
// ----------------
function StartGame()
{
  // Init components
  RENDERER.Init();
  INVENTORY.Init();
  cFirstFloor = D_FLOOR.TownOne();
  m_arrFloors.push(cFirstFloor);
  m_cCurrentFloor = cFirstFloor;

  m_cHero = new PAWN(CONST.PAWN_HERO, "Hero", "./res/hero.gif");
  // just add the stats for now
  m_cHero.cBaseStats.SetStat(CONST.STAT_LEVEL, 1, true);
  m_cHero.cBaseStats.SetStat(CONST.STAT_HEALTH, 20, true);
  m_cHero.cBaseStats.SetStat(CONST.STAT_MANA, 10, true);
  m_cHero.cBaseStats.SetStat(CONST.STAT_BRAWN, 10, true);
  m_cHero.cBaseStats.SetStat(CONST.STAT_AGILITY, 30, true);

  var cStartTile;
  if (m_cCurrentFloor.GetEntranceIdx() >= 0)
  {
    cStartTile = m_cCurrentFloor.GetTile(m_cCurrentFloor.GetEntranceIdx());
  }
  else
  {
    cStartTile = m_cCurrentFloor.GetEmptyTile();
  }

  cStartTile.PlaceEntity(m_cHero);
  m_cHero.AddToInventory(D_WEAPON.Sword(), true);

  // give the player some gold
  m_cHero.AddToInventory(PAWNUTILS.MakeGoldPile(90));

  // start game
  myGameArea.start();
  STATE.SetState(STATE.STATE_STAGE);
}

var myGameArea =
{
  canvas : document.createElement("canvas"),
  start  : function()
  {
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.context = this.canvas.getContext("2d");
    document.getElementById('divCanvas').appendChild(this.canvas);
    this.canvas.addEventListener('mousemove', MOUSE.Move);
    this.canvas.addEventListener('click', MOUSE.LeftClick);
    this.canvas.addEventListener('contextmenu', MOUSE.RightClick);
  },
  clear : function(strFill=null)
  {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (strFill != null)
    {
      this.context.fillStyle = strFill;
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
};

// ----------------
// GetCanvas
//     Returns the canvas object
// ----------------
function GetCanvas() { return myGameArea.context; };

// ----------------
// Update
//     Updates the game loop
// ----------------
function Update(iTimeIncrease=0)
{
  IncrementTime(iTimeIncrease);
  // update NPCs
  m_cCurrentFloor.UpdateNPCs();
  IBOX.UpdateInfo();

  if (m_cHero.IsDead())
  {
    STATE.SetState(STATE.STATE_DEATH, false);
  }

  var iState = STATE.GetState();
  switch (iState)
  {
    case STATE.STATE_STAGE:
    {
      var iCamPosition = m_cHero.GetTile().GetIdx();
      var arrVisionRange = m_cCurrentFloor.GetVisualTiles(iCamPosition, PLAYER_SIGHT_RANGE);
      var idx;
      var iTiles = arrVisionRange.length;
      var cTile;
      for (idx = 0; idx < iTiles; ++idx)
      {
        cTile = arrVisionRange[idx];
        if (cTile != null) { cTile.bIsDiscovered = true; }
      }
      DrawStage(iCamPosition, arrVisionRange);
      break;
    }
    case STATE.STATE_INVENTORY:
    {
      INVENTORY.Update();
      DrawInventory();
      break;
    }
    case STATE.STATE_CHARACTER:
    {
      CHARACTER.Update();
      DrawCharacter();
      break;
    }
    case STATE.STATE_DEATH:
    {
      DrawDeath();
      break;
    }
    default: break;
  } // end of switch
};

// ----------------
// DrawStage
//     Draws the stage state
// ----------------
function DrawStage(iFocusIdx, arrVisionRange)
{
  myGameArea.clear();
  var arrTiles = m_cCurrentFloor.GetTileArea(iFocusIdx, MAP_WIDTH);
  RENDERER.SetVisibleTiles(arrTiles, arrVisionRange);
  RENDERER.Draw(GetCanvas(), MAP_WIDTH);
}

// ----------------
// DrawInventory
//     Draws the inventory state
// ----------------
function DrawInventory()
{
  myGameArea.clear();
  INVENTORY.Draw(GetCanvas());
}

// ----------------
// DrawCharacater
//     Draws the character information state
// ----------------
function DrawCharacter()
{
  myGameArea.clear();
  CHARACTER.Draw(GetCanvas());
}

// ----------------
// DrawDeath
//     Draws the end of game scene
// ----------------
function DrawDeath()
{
  myGameArea.clear("#FFFFFF");

  var imgEntity = new Image();
  imgEntity.iX = 50;
  imgEntity.iY = 100;
  imgEntity.addEventListener('load', function()
  {
    GetCanvas().drawImage(this, this.iX, this.iY);
  }, false);
  imgEntity.src = "./res/death_screen.png";
}

// DEBUG STUFF ---- maybe move these to a better class
function GetFloor(idx=-1)
{
  var cFloor = (idx < 0) ? m_cCurrentFloor : null;
  if (idx >= 0 && idx < m_arrFloors.length)
  {
    cFloor = m_arrFloors[idx];
  }

  return cFloor;
};

function GetCurrentFloorIdx() { return m_arrFloors.indexOf(m_cCurrentFloor); };
function GoToFloor(idx, iDoorType, iDoor=-1)
{
  var cFloor = GetFloor(idx);
  if (cFloor == null)
  {
    cFloor = D_FLOOR.RandomFloor(iFloorWidth, m_cCurrentFloor.CountStairs(iDoorType));
    m_arrFloors.push(cFloor);
  }

  if (cFloor != null)
  {
    var cEntranceTile;
    if (iDoor >= 0)
    {
      var iDestinationStairsType = (iDoorType == CONST.DOOR_UPSTAIRS) ? CONST.DOOR_DOWNSTAIRS : CONST.DOOR_UPSTAIRS;
      var cStairs = cFloor.GetStairs(iDestinationStairsType, iDoor);
      cEntranceTile = (cStairs != null) ? cStairs.GetTile() : cFloor.GetEmptyTile();
    }
    else
    {
      cEntranceTile = cFloor.GetEmptyTile();
    }

    // spawn enemies -- TODO: make a timer to spawn them staggered
    var arrSpawnMap = [...cFloor.GetSpawnMap()]; // returns a shallow copy for altering the data
    var idx;
    var iSpawns = cFloor.GetNPCLimit() - cFloor.GetNPCs().length;
    var iEnemyID;
    var cEnemy;
    for (idx = 0; idx < iSpawns; ++idx)
    {
      iEnemyID = arrSpawnMap[Math.floor(Math.random() * arrSpawnMap.length)];
      cEnemy = D_ENEMY.MakeEnemy(iEnemyID);
      cFloor.GetEmptyTile().PlaceEntity(cEnemy);
      cFloor.AddNPC(cEnemy);
    } // end for loop


    cEntranceTile.PlaceEntity(m_cHero);
    m_cCurrentFloor = cFloor;
  }
};

function GetHero() { return m_cHero; };
function GetTime() { return iPlaytime; };
function IncrementTime(iValue=1) { iPlaytime+=iValue; };
