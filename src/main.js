function loadGame()
{
  XML.Load(startGame);
}

function startGame()
{
  const PLAY_AREA = 20;
  // load files
  // XML.LoadRooms();
  LEVEL.LoadRoomXML();
  ITEM.LoadItemXML();

  // init UI
  INFO_PANEL.Init();
  // start game
  myGameArea.start();
  GRID.Init(myGameArea.canvas.width);
  SCENE.Init(myGameArea.canvas.width, myGameArea.canvas.height)
  LEVEL.Init(PLAY_AREA*PLAY_AREA);
  LEVEL.Update();
  myPlayer = new PLAYER(PLAY_AREA/2 * PLAY_AREA + PLAY_AREA/2, "red");
  myGameArea.Update();
}

var myGameArea =
{
  canvas : document.createElement("canvas"),
  start  : function()
  {
    this.canvas.width = 680;
    this.canvas.height = 680;
    this.context = this.canvas.getContext("2d");
    document.getElementById('divCanvas').appendChild(this.canvas);
  },
  clear : function()
  {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  Draw : function(bClear = true)
  {
    if (bClear) { this.clear(); }
    DrawScreen();
  },
  Update : function()
  {
    this.clear();
    Update();
    DrawScreen();
  }
};

function Update()
{
  var idx = myPlayer.idx;
  var iFloor = myPlayer.iFloor;
  myPlayer.Update();
  CAMERA.CenterOn(myPlayer.idx);
  INFO_PANEL.Update(idx, iFloor);
}

function DrawScreen()
{
  var ctx = myGameArea.context;
  // SCENE.Render(ctx); // this isn't working properly
  LEVEL.Draw(ctx);
  myPlayer.Draw(ctx);
  GRID.Draw(ctx);
  LEVEL.DrawCurrentFloorName(ctx);
}

function UpdateRoomImage(strImage)
{
  if (strImage != null)
  {
    document.getElementById('room_preview').src = strImage;
  }
}

function UpdateStairsButton(bUseStairs = false)
{
  document.getElementById('buttonStairs').disabled = !bUseStairs;
}
