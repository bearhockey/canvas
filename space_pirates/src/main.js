// consts
const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 800;
// globals - don't use if you can

function InitCanvas()
{
  myGameArea.start();
  myGameArea.clear();
  SERVER.Connect(StartGame);
}

function StartGame()
{
  // start game
  STATE.ChangeState(STATE.STATE_NONE);
  DIALOG.Button("Click to start the game", DemoStart);
}

// --------
// DemoStart
//     Starts the demo of the game - for debugging
// --------
function DemoStart()
{
  STATE.ChangeState(STATE.STATE_DIALOG, [0]);
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
    // this.canvas.addEventListener('mousedown', MOUSE.MouseDown);
    // this.canvas.addEventListener('mouseup', MOUSE.MouseUp);
    this.canvas.addEventListener('click', MOUSE.LeftClick);
    // this.canvas.addEventListener('contextmenu', MOUSE.RightClick);
  },
  clear : function()
  {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

function GetCanvas() { return myGameArea.context; };
function GetCanvasSize() { return [myGameArea.canvas.width, myGameArea.canvas.height]; };

function Update()
{
  // DIALOG.GetDialog(0, DIALOG.Draw);
};

function ClearScreen()
{
  MOUSE.ClearHitBoxes();
  myGameArea.clear();
};

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
