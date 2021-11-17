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

var cHero;
var cTest;

function StartGame()
{
  // Init components
  RENDERER.Init();
  INVENTORY.Init();
  cFirstFloor = new FLOOR(iFloorWidth);

  cHero = new PAWN(CONST.PAWN_HERO, "Hero", "./res/hero.gif");
  cTest = new PAWN(CONST.PAWN_ITEM, "Gold", "./res/gold.gif");
  var cStartTile = cFirstFloor.GetTile(START_IDX);
  var cTestTile = cFirstFloor.GetTile(833);
  cStartTile.PlaceEntity(cHero);
  cTestTile.PlaceEntity(cTest);
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
    // this.canvas.addEventListener('click', MOUSE.LeftClick);
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
  var iCamPosition = cHero.GetTile().GetIdx();
  PopInfo();
  UpdateMenu();
  DrawScreen(iCamPosition);
};

function DrawScreen(iFocusIdx)
{
  myGameArea.clear();
  var ctx = GetCanvas();

  if (m_iState == CONST.STATE_STAGE)
  {
    var arrTiles = cFirstFloor.GetTileArea(iFocusIdx, MAP_WIDTH);
    RENDERER.SetVisibleTiles(arrTiles, 0);
    RENDERER.Draw(ctx, MAP_WIDTH);
  }
  else if (m_iState == CONST.STATE_INVENTORY)
  {
    INVENTORY.Draw(ctx);
  }
};

// DEBUG STUFF ---- maybe move these to a better class`
function SetState(iState) { m_iState = iState; Update(); };

function GoUp()
{ cHero.Move(CONST.NORTH, cFirstFloor); iPlaytime++; Update(); };
function GoDown()
{ cHero.Move(CONST.SOUTH, cFirstFloor); iPlaytime++; Update(); };
function GoLeft()
{ cHero.Move(CONST.WEST, cFirstFloor); iPlaytime++; Update(); };
function GoRight()
{ cHero.Move(CONST.EAST, cFirstFloor); iPlaytime++; Update(); };

function UpdateMenu()
{
  document.getElementById('butStage').disabled = (m_iState == CONST.STATE_STAGE);
  document.getElementById('butInventory').disabled = (m_iState == CONST.STATE_INVENTORY);
};

function PopInfo()
{
  document.getElementById('playerLevel').innerHTML = cHero.iLevel;
  document.getElementById('playerHealth').innerHTML = cHero.iHP;
  document.getElementById('playerMana').innerHTML = cHero.iMP;
  document.getElementById('playerTime').innerHTML = new Date(iPlaytime * 1000).toISOString().substr(11, 8);
};

function AddInfo(strLine)
{
  var strExisting = document.getElementById('divText').innerHTML;
  document.getElementById('divText').innerHTML = strLine + "<br>" + strExisting;
};

function Pickup()
{
  var cCurrentTile = cHero.GetTile();
  var arrItems = cCurrentTile.GetEntities();
  var iLength = arrItems.length;
  var idx;
  var cItem;
  var strItems = "";
  for (idx = 0; idx < iLength; ++idx)
  {
    cItem = arrItems[idx];
    if (cItem != null && cItem.iType == CONST.PAWN_ITEM)
    {
      if (cCurrentTile.RemoveEntity(cItem))
      {
        strItems += (strItems != "") ? (", " + cItem.strName) : cItem.strName;
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

  Update();
};
