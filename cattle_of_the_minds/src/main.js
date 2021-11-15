// consts
const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 960;
// globals - don't use if you can
var cFirstFloor;
var iCamPosition = 895;
var iFloorWidth = 30;

function StartGame()
{
  // Init components
  RENDERER.Init();
  var iFloorSize = 900;
  console.log("Floor size :", iFloorSize);
  cFirstFloor = new FLOOR(iFloorWidth, iFloorSize);
  // start game
  myGameArea.start();
  DrawScreen();
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
  DrawScreen();
};

function DrawScreen()
{
  myGameArea.clear();
  var ctx = GetCanvas();

  var arrTiles = cFirstFloor.GetTileArea(iCamPosition, 15);
  RENDERER.SetVisibleTiles(arrTiles, 0);
  RENDERER.Draw(ctx, false, 15);
};

// DEBUG STUFF
function GoUp()
{
  iCamPosition -= iFloorWidth;
  Update();
};
