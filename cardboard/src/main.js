// managers
var m_OM = new ObjectManager();
var m_Mouse = new MouseManager();
// temp globals - put these in better places when you can
var cHeldCard;

var cCard = new Card(50, 80);
var cSlot1 = new CardSlot(250, 80, true);
var cSlot2 = new CardSlot(450, 80);

var myGameArea =
{
  canvas : document.createElement("canvas"),
  start  : function()
  {
    this.canvas.width = CONST.CANVAS_WIDTH;
    this.canvas.height = CONST.CANVAS_HEIGHT;
    this.context = this.canvas.getContext("2d");
    document.getElementById('divCanvas').appendChild(this.canvas);
    this.canvas.addEventListener('mousemove', m_Mouse.Move);
    this.canvas.addEventListener('click', m_Mouse.LeftClick);
    this.canvas.addEventListener('contextmenu', m_Mouse.RightClick);
  },
  clear : function()
  {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

function GetCanvas() { return myGameArea.context; };

function Init()
{
  m_OM.AddObjectToStage(cCard);
  m_OM.AddObjectToStage(cSlot1);
  m_OM.AddObjectToStage(cSlot2);
};

function Update(iTimeStamp)
{
  DrawScreen();
};

function DrawScreen()
{
  myGameArea.clear();
  var ctx = GetCanvas();
  m_OM.Draw(ctx);
};

// --------------------------------
// StartGame
// --------------------------------
function StartGame()
{
  // start game
  myGameArea.start();
  Init();
  Update();
}
