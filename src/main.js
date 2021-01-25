function loadGame()
{
  XML.Load(startGame);
}

function startGame()
{
  // load files
 // XML.LoadRooms();
 LEVEL.LoadRoomXML();

  // start game
  myGameArea.start();
  GRID.Init(myGameArea.canvas.width);
  LEVEL.Generate(20*20);
  LEVEL.Update();
  myPlayer = new PLAYER(4*20 + 4, "red");
  myGameArea.Update();
}

var myGameArea =
{
  canvas : document.createElement("canvas"),
  start  : function()
  {
    this.canvas.width = 640;
    this.canvas.height = 640;
    this.context = this.canvas.getContext("2d");
    document.getElementById('divCanvas').appendChild(this.canvas);
  },
  clear : function()
  {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  Draw : function(bClear = true)
  {
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
  LEVEL.Draw(ctx);
  myPlayer.Draw(ctx);
  GRID.Draw(ctx);
}

function player(x, y, color)
{
  this.x = x;
  this.y = y;
  this.Update = function()
  {
    LEVEL.Update(LEVEL.GetTileIndex(this.x, this.y));
  };
  this.Draw = function()
  {

    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(GRID.Normalize(this.x, 16), GRID.Normalize(this.y, 16),  32, 32);
  }
}
