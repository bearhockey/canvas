// consts
const CANVAS_WIDTH = 768;
const CANVAS_HEIGHT = 768;
// globals - don't use if you can

function StartGame()
{
  // Init components
  RENDERER.Init();
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
  RENDERER.Draw(ctx);
  // test
  ctx.beginPath();
  ctx.rect(20, 20, 150, 100);
  ctx.stroke();
};
