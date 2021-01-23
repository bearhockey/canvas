
function startGame()
{
  myGameArea.start();
  grid();
  myPlayer = new player(4, 3, "red");
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
  clear : function(bShowGrid = true)
  {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (bShowGrid) { grid(); }
  }
};

function grid()
{
  var idx;
  var x;
  ctx = myGameArea.context;
  ctx.beginPath();

  x = GRID.iPadding;
  for (idx = 0; idx <= GRID.iWidth; ++idx)
  {
    ctx.moveTo(x, GRID.iPadding);
    ctx.lineTo(x, GRID.iHeight*GRID.iSize + GRID.iPadding);
    x += GRID.iSize;
  }

  x = GRID.iPadding;
  for (idx = 0; idx <= GRID.iHeight; ++idx)
  {
    ctx.moveTo(GRID.iPadding, x);
    ctx.lineTo(GRID.iWidth*GRID.iSize + GRID.iPadding, x);
    x += GRID.iSize;
  }

  ctx.strokeStyle = "#EEEEEE";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function player(x, y, color)
{
  this.x = x;
  this.y = y;
  this.update = function()
  {
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(GRID.Normalize(this.x), GRID.Normalize(this.y),  32, 32);
  }
}
