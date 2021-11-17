// consts
const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 960;
const MAP_WIDTH = 15; // in tiles
const START_IDX = 895;
// globals - don't use if you can
var cFirstFloor;
var iFloorWidth = 30;

var cHero;
var cTest;

function StartGame()
{
  // Init components
  RENDERER.Init();
  cFirstFloor = new FLOOR(iFloorWidth);

  cHero = new PAWN("Hero", "./res/hero.gif");
  //cTest = new PAWN("TEST", "./res/hero.gif");
  var cStartTile = cFirstFloor.GetTile(START_IDX);
  //var cTestTile = cFirstFloor.GetTile(833);
  cStartTile.PlaceEntity(cHero);
  //cTestTile.PlaceEntity(cTest);
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
  DrawScreen(iCamPosition);
};

function DrawScreen(iFocusIdx)
{
  myGameArea.clear();
  var ctx = GetCanvas();

  var arrTiles = cFirstFloor.GetTileArea(iFocusIdx, MAP_WIDTH);
  RENDERER.SetVisibleTiles(arrTiles, 0);
  RENDERER.Draw(ctx, MAP_WIDTH);
};

// DEBUG STUFF
function GoUp()
{ cHero.Move(CONST.NORTH, cFirstFloor); Update(); };
function GoDown()
{ cHero.Move(CONST.SOUTH, cFirstFloor); Update(); };
function GoLeft()
{ cHero.Move(CONST.WEST, cFirstFloor); Update(); };
function GoRight()
{ cHero.Move(CONST.EAST, cFirstFloor); Update(); };
