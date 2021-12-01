// consts
const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 960;
const MAP_WIDTH = 15; // in tiles
// globals - don't use if you can
var cFirstFloor;
var cSecondFloor;
var iFloorWidth = 50;
var iNumberOfEnemies = 10;
var iPlaytime = 0; // playtime in seconds
var m_iState = CONST.STATE_STAGE;

var m_cHero;
var cSword;
var arrEnemies = [];

function StartGame()
{
  // Init components
  RENDERER.Init();
  INVENTORY.Init();
  cFirstFloor = new FLOOR(iFloorWidth);
  cFirstFloor.GenerateFloor();

  m_cHero = new PAWN(CONST.PAWN_HERO, "Hero", "./res/hero.gif");
  // just add the stats for now
  m_cHero.cBaseStats.SetStat(CONST.STAT_LEVEL, 1, true);
  m_cHero.cBaseStats.SetStat(CONST.STAT_HEALTH, 20, true);
  m_cHero.cBaseStats.SetStat(CONST.STAT_MANA, 10, true);
  m_cHero.cBaseStats.SetStat(CONST.STAT_ATTACK, 1, true);
  m_cHero.cBaseStats.SetStat(CONST.STAT_AGILITY, 3, true);

  var cStartTile = cFirstFloor.GetEmptyTile();
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
    cFirstFloor.GetEmptyTile().PlaceEntity(cEnemy);
    arrEnemies.push(cEnemy);
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

function GetCanvas() { return myGameArea.context; };

function Update()
{
  UpdateMenu();
  PopInfo();
  switch (m_iState)
  {
    case CONST.STATE_STAGE:
    {
      var iCamPosition = m_cHero.GetTile().GetIdx();
      var arrVisionRange = cFirstFloor.GetVisualTiles(iCamPosition, 3);
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
    case CONST.STATE_INVENTORY:
    {
      INVENTORY.Update();
      DrawInventory();
      break;
    }
    case CONST.STATE_CHARACTER:
    {
      CHARACTER.Update();
      DrawCharacter();
      break;
    }
    default: break;
  } // end of switch
};

function DrawStage(iFocusIdx, arrVisionRange)
{
  myGameArea.clear();
  var arrTiles = cFirstFloor.GetTileArea(iFocusIdx, MAP_WIDTH);
  RENDERER.SetVisibleTiles(arrTiles, arrVisionRange);
  RENDERER.Draw(GetCanvas(), MAP_WIDTH);
}

function DrawInventory()
{
  myGameArea.clear();
  INVENTORY.Draw(GetCanvas());
}

function DrawCharacter()
{
  myGameArea.clear();
  CHARACTER.Draw(GetCanvas());
}

// DEBUG STUFF ---- maybe move these to a better class
function GetState()       { return m_iState; };
function SetState(iState) { m_iState = iState; Update(); };
function GetHero() { return m_cHero; };
function IncrementTime(iValue=1) { iPlaytime+=iValue; };

function FightGuy(cPawn)
{
  COMBAT.AttackPawn(m_cHero, cPawn);
  if (!cPawn.IsDead())
  {
    COMBAT.AttackPawn(cPawn, m_cHero, false);
  }
}

function GoUp()
{ m_cHero.Move(CONST.NORTH, cFirstFloor); IncrementTime(); Update(); };
function GoDown()
{ m_cHero.Move(CONST.SOUTH, cFirstFloor); IncrementTime(); Update(); };
function GoLeft()
{ m_cHero.Move(CONST.WEST, cFirstFloor); IncrementTime(); Update(); };
function GoRight()
{ m_cHero.Move(CONST.EAST, cFirstFloor); IncrementTime(); Update(); };

function UpdateMenu()
{
  document.getElementById('butStage').disabled = (m_iState == CONST.STATE_STAGE);
  document.getElementById('butInventory').disabled = (m_iState == CONST.STATE_INVENTORY);
  document.getElementById('butCharacter').disabled = (m_iState == CONST.STATE_CHARACTER);
};

function PopInfo()
{
  document.getElementById('playerLevel').innerHTML = m_cHero.GetStat(CONST.STAT_LEVEL)[0].toString();
  var arrHealth = m_cHero.GetStat(CONST.STAT_HEALTH);
  document.getElementById('playerHealth').innerHTML = UTILS.StatPairToText(arrHealth);
  var arrMana = m_cHero.GetStat(CONST.STAT_MANA);
  document.getElementById('playerMana').innerHTML = UTILS.StatPairToText(arrMana);
  document.getElementById('playerTime').innerHTML = new Date(iPlaytime * 1000).toISOString().substr(11, 8);
};

function Pickup()
{
  var cCurrentTile = m_cHero.GetTile();
  var arrItems = cCurrentTile.GetEntities();
  var iLength = arrItems.length;
  var idx;
  var cItem;
  var strItems = "";
  for (idx = 0; idx < iLength; ++idx)
  {
    cItem = arrItems[idx];
    if (cItem != null && cItem.iPawnType == CONST.PAWN_ITEM)
    {
      if (cCurrentTile.RemoveEntity(cItem))
      {
        m_cHero.AddToInventory(cItem);
        var strSingleItem = (cItem.iQuantity > 0) ? cItem.iQuantity.toString() + " " + cItem.strName : cItem.strName;
        strItems += (strItems != "") ? (", " + strSingleItem) : strSingleItem;
      }
    }
  }

  if (strItems != "")
  {
    MBOX.AddInfo("Picked up " + strItems);
  }
  else
  {
    MBOX.AddInfo("Nothing to pick up");
  }

  IncrementTime();
  Update();
};
