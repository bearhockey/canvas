// consts
const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 960;
const MAP_WIDTH = 15; // in tiles
// globals - don't use if you can
var cFirstFloor;
var cSecondFloor;
var iFloorWidth = 50;
var iNumberOfEnemies = 10;CONST
var iPlaytime = 0; // playtime in seconds

var m_cHero;
var cSword;
var m_arrEnemies = [];

// ----------------
// StartGame
//     Starts the game
// ----------------
function StartGame()
{
  // Init components
  RENDERER.Init();
  INVENTORY.Init();
  cFirstFloor = new FLOOR(iFloorWidth);
  cFirstFloor.GenerateFloor();
  m_cCurrentFloor = cFirstFloor;

  m_cHero = new PAWN(CONST.PAWN_HERO, "Hero", "./res/hero.gif");
  // just add the stats for now
  m_cHero.cBaseStats.SetStat(CONST.STAT_LEVEL, 1, true);
  m_cHero.cBaseStats.SetStat(CONST.STAT_HEALTH, 20, true);
  m_cHero.cBaseStats.SetStat(CONST.STAT_MANA, 10, true);
  m_cHero.cBaseStats.SetStat(CONST.STAT_ATTACK, 1, true);
  m_cHero.cBaseStats.SetStat(CONST.STAT_AGILITY, 3, true);

  var cStartTile = m_cCurrentFloor.GetEmptyTile();
  cStartTile.PlaceEntity(m_cHero);
  // give the hero a sword for now
  cSword = new PAWN(CONST.PAWN_ITEM, "Sword", "./res/sword.gif", CONST.ITEM_WEAPON);
  cSword.cBaseStats.SetStat(CONST.STAT_ATTACK, 2, true);
  cSword.cBaseStats.SetStat(CONST.STAT_ACCURACY, 1, true);
  m_cHero.AddToInventory(cSword);
  m_cHero.EquipItem(cSword);

  // add some enemies
  var idx;
  for (idx = 0; idx < iNumberOfEnemies; ++idx)
  {
    cEnemy = PAWNUTILS.MakeGoblin();
    m_cCurrentFloor.GetEmptyTile().PlaceEntity(cEnemy);
    m_arrEnemies.push(cEnemy);
  } // end of for loop
  // start game
  myGameArea.start();
  Update();
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
  clear : function()
  {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
  IBOX.UpdateInfo();
  // update enemies
  var cEnemy;
  var iEnemies = m_arrEnemies.length;
  var idx;
  for (idx = 0; idx < iEnemies; ++idx)
  {
    cEnemy = m_arrEnemies[idx];
    if (cEnemy != null) { cEnemy.Update(); }
  }
  
  var iState = STATE.GetState();
  switch (iState)
  {
    case STATE.STATE_STAGE:
    {
      var iCamPosition = m_cHero.GetTile().GetIdx();
      var arrVisionRange = m_cCurrentFloor.GetVisualTiles(iCamPosition, 3);
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

// DEBUG STUFF ---- maybe move these to a better class
function GetHero() { return m_cHero; };
function GetFloor() { return m_cCurrentFloor; };
function GetTime() { return iPlaytime; };
function IncrementTime(iValue=1) { iPlaytime+=iValue; };

function FightGuy(cPawn)
{
  COMBAT.AttackPawn(m_cHero, cPawn);
  if (!cPawn.IsDead())
  {
    COMBAT.AttackPawn(cPawn, m_cHero, false);
  }
};
