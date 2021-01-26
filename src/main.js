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

  // start game
  myGameArea.start();
  GRID.Init(myGameArea.canvas.width);
  SCENE.Init(myGameArea.canvas.width, myGameArea.canvas.height)
  LEVEL.Generate(PLAY_AREA*PLAY_AREA);
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
  myPlayer.Update();
  CAMERA.CenterOn(myPlayer.idx);
  var objCurrentTile = LEVEL.GetTile(myPlayer.idx);
  document.getElementById('txtLocation').innerHTML = objCurrentTile.label;
}

function DrawScreen()
{
  var ctx = myGameArea.context;
  // SCENE.Render(ctx); // this isn't working properly
  LEVEL.Draw(ctx);
  myPlayer.Draw(ctx);
  GRID.Draw(ctx);
}

function UpdateRoomImage(strImage)
{
  if (strImage != null)
  {
    document.getElementById('room_preview').src = strImage;
  }
}
