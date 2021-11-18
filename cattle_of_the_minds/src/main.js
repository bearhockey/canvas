// consts
const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 960;
const MAP_WIDTH = 15; // in tiles
const START_IDX = 666;
// globals - don't use if you can
var cFirstFloor;
var iFloorWidth = 30;
var iPlaytime = 0; // playtime in seconds
var m_iState = CONST.STATE_STAGE;

var m_cHero;
var cGoldOne;
var cGoldTwo;
var cSword;
var cEnemy;

function StartGame()
{
  // Init components
  RENDERER.Init();
  INVENTORY.Init();
  cFirstFloor = new FLOOR(iFloorWidth);

  m_cHero = new PAWN(CONST.PAWN_HERO, "Hero", "./res/hero.gif");
  // just add the stats for now
  m_cHero.cStatBlock.SetStat(CONST.STAT_LEVEL, 1);
  m_cHero.cStatBlock.SetStat(CONST.STAT_HEALTH, 20);
  m_cHero.cStatBlock.SetStat(CONST.STAT_MANA, 10);
  cGoldOne = new PAWN(CONST.PAWN_ITEM, "Gold", "./res/gold.gif", CONST.ITEM_MONEY);
  cGoldOne.iQuantity = 50;
  var cStartTile = cFirstFloor.GetTile(START_IDX);
  var cTestTile = cFirstFloor.GetTile(728);
  cStartTile.PlaceEntity(m_cHero);
  cTestTile.PlaceEntity(cGoldOne);
  // give the hero a sword for now
  cSword = new PAWN(CONST.PAWN_ITEM, "Sword", "./res/sword.gif", CONST.ITEM_WEAPON);
  m_cHero.AddToInventory(cSword);
  m_cHero.EquipItem(cSword);
  // add a bad guy
  cEnemy = new PAWN(CONST.PAWN_ENEMY, "Goblin", "./res/goblin.gif");
  cEnemy.cStatBlock.SetStat(CONST.STAT_HEALTH, 6);
  cGoldTwo = new PAWN(CONST.PAWN_ITEM, "Gold", "./res/gold.gif", CONST.ITEM_MONEY);
  cGoldTwo.iQuantity = Math.floor(Math.random()*10)+5;
  cEnemy.AddToInventory(cGoldTwo);
  var cBadTile = cFirstFloor.GetTile(602);
  cBadTile.PlaceEntity(cEnemy);
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
    // this.canvas.addEventListener('mousemove', MOUSE.Move);
    // this.canvas.addEventListener('click', INVENTORY.MouseDownItem);
    // this.canvas.addEventListener('contextmenu', MOUSE.RightClick);
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
      DrawStage(iCamPosition);
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

function DrawStage(iFocusIdx)
{
  myGameArea.clear();
  var arrTiles = cFirstFloor.GetTileArea(iFocusIdx, MAP_WIDTH);
  RENDERER.SetVisibleTiles(arrTiles, 0);
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
function SetState(iState) { m_iState = iState; Update(); };
function GetHero() { return m_cHero; };
function IncrementTime(iValue=1) { iPlaytime+=iValue; };

function FightGuy(cPawn)
{
  var iEnemyHealth = cPawn.GetStat(CONST.STAT_HEALTH) - 1;
  if (iEnemyHealth > 0)
  {
    cPawn.cStatBlock.SetStat(CONST.STAT_HEALTH, iEnemyHealth);
    AddInfo("You dealt 1 damage to " + cPawn.strName + "! (" + cPawn.GetStat(CONST.STAT_HEALTH) + ")");
  }
  else
  {
    cPawn.Dead();
    AddInfo(cPawn.strName + " is the dead.");
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
  document.getElementById('playerLevel').innerHTML = m_cHero.GetStat(CONST.STAT_LEVEL);
  document.getElementById('playerHealth').innerHTML = m_cHero.GetStat(CONST.STAT_HEALTH);
  document.getElementById('playerMana').innerHTML = m_cHero.GetStat(CONST.STAT_MANA);
  document.getElementById('playerTime').innerHTML = new Date(iPlaytime * 1000).toISOString().substr(11, 8);
};

function AddInfo(strLine)
{
  var strExisting = document.getElementById('divText').innerHTML;
  document.getElementById('divText').innerHTML = strLine + "<br>" + strExisting;
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
    AddInfo("Picked up " + strItems);
  }
  else
  {
    AddInfo("Nothing to pick up");
  }

  IncrementTime();
  Update();
};
