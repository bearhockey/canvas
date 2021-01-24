
function startGame()
{
  myGameArea.start();
  GRID.Init(myGameArea.canvas.width);
  LEVEL.Generate(20*20);
  LEVEL.Update();
  myPlayer = new player(4, 4, "red");
  DrawScreen();
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
  update : function()
  {
    this.clear();
    DrawScreen();
  }
};

function DrawScreen()
{
  var ctx = myGameArea.context;
  LEVEL.Draw(ctx);
  myPlayer.Draw();
  GRID.Draw(ctx);
}

function player(x, y, color)
{
  this.x = x;
  this.y = y;
  this.Draw = function()
  {
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(GRID.Normalize(this.x, 16), GRID.Normalize(this.y, 16),  32, 32);
  }
}
