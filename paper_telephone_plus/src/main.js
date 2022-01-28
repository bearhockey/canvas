// consts
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
// globals - don't use if you can

function StartGame()
{
  // start game
  myGameArea.start();
  myGameArea.clear();
  TOOL.UpdateLineWidth();
  STATE.ChangeState(STATE.STATE_NONE);
  DrawText("Press Start to load game");
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
    this.canvas.addEventListener('mousedown', MOUSE.MouseDown);
    this.canvas.addEventListener('mouseup', MOUSE.MouseUp);
    // this.canvas.addEventListener('click', MOUSE.LeftClick);
    // this.canvas.addEventListener('contextmenu', MOUSE.RightClick);
  },
  clear : function()
  {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

function GetCanvas() { return myGameArea.context; };

function StartRound()
{
  SERVER.ServerSend({ "start_round":true });
};

function DrawText(strText)
{
  var ctx = GetCanvas();
  ctx.fillStyle = "#33333388";
  ctx.fillRect(0, CANVAS_HEIGHT/3, CANVAS_WIDTH, CANVAS_HEIGHT/3);
  ctx.font = "48px serif";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(strText, 20, CANVAS_HEIGHT/2);
};

function Update()
{
};

function ClearScreen()
{
  myGameArea.clear();
};

function LoadImage(srcImage)
{
  var img = new Image();
  img.onload = DrawImage; // Draw when image has loaded
  img.src = srcImage;
};

function DrawImage()
{
  GetCanvas().drawImage(this, 0, 0);
}

function SubmitData()
{
  var objData = {"submit":true};
  var iCurrentState = STATE.GetState();
  if (iCurrentState == STATE.STATE_DRAW)
  {
    objData["srcImage"] = myGameArea.canvas.toDataURL();
  }
  else if (iCurrentState == STATE.STATE_TEXT)
  {
    objData["srcText"] = PROMPT.GetPromptText();
  }

  SERVER.ServerSend(objData);
}
