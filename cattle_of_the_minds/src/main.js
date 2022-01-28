// consts
const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 960;
const MAP_WIDTH = 15; // in tiles

function LoadMap()
{
  DUNGEON.m_arrFloors.push(D_FLOOR.TownOne());
  HERO.QuickHero();

  var cFloor = DUNGEON.GetFloor();
  var cStartTile = (cFloor.GetEntranceIdx() >= 0) ? cFloor.GetTile(cFloor.GetEntranceIdx()) : cFloor.GetEmptyTile();

  cStartTile.PlaceEntity(HERO.Get());
  STATE.SetState(STATE.STATE_CHARACTER);
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
// GetCanvasWidth
//     Returns how wide ( and thus how tall ) the canvas is in pixels
// ----------------
function GetCanvasWidth() { return CANVAS_WIDTH; };

// ----------------
// Update
//     Updates the main game loop
// ----------------
function Update(iTimeIncrease=0)
{
  CLOCK.IncrementTime(iTimeIncrease);
  DUNGEON.UpdateNPCs();
  IBOX.UpdateInfo();

  var cHero = HERO.Get();
  if (cHero != null)
  {
    if (cHero.IsDead() && STATE.GetState() != STATE.STATE_DIALOG)
    {
      DIALOG.OpenDialog("./res/screen/death_screen.png", 800, 600, "#FFFFFF");
    }
    else
    {
      // update the vision range for the hero
      var iCamPosition = cHero.GetTile().GetIdx();
      var cFloor = DUNGEON.GetFloor();
      var arrVisionRange = cFloor.GetVisualTiles(iCamPosition, HERO.GetSightRange());
      var idx;
      var iTiles = arrVisionRange.length;
      var cTile;
      for (idx = 0; idx < iTiles; ++idx)
      {
        cTile = arrVisionRange[idx];
        if (cTile != null) { cTile.bIsDiscovered = true; }
      } // end for loop
      var arrTiles = cFloor.GetTileArea(iCamPosition, MAP_WIDTH);
      RENDERER.SetVisibleTiles(arrTiles, arrVisionRange);
    }
  }

  myGameArea.clear();
  STATE.Update();
};

// ----------------
// StartGame
//     Starts the game
// ----------------
function StartGame()
{
  var cStartButton = new BUTTON(0, 860, 200, 50, "Start", LoadMap);
  // var cLoadButton = new BUTTON(0, 860, 200, 50, "Load");
  // Init components
  CHARACTER.Init();
  INVENTORY.Init();

  // start game
  myGameArea.start();
  DIALOG.OpenDialog("./res/screen/title.png", 410, 330, "#000000", [cStartButton]);
}

// end of main
