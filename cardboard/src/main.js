// managers
var g_OM = new ObjectManager();
var m_Mouse = new MouseManager();
// temp globals - put these in better places when you can

var cCard = new Card(50, 80, "./img/card_square.png");
var cCard2 = new Card(200, 80, "./img/card_circle.png");
var cCard3 = new Card(350, 80, "./img/card_triangle.png");

var cRightPanel = new RightPanel();
var cRightClose = new Button(cRightPanel.GetPosition()[0], 4, 80, 30, "SHOW", cRightPanel, CONST.BUTTON_ACTION_OPEN_CLOSE);

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
    // this.canvas.addEventListener('dbclick', m_Mouse.DoubleClick);
    // this.canvas.addEventListener('mousedown', m_Mouse.MouseDown);
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
  g_OM.AddPanel(cRightPanel);
  g_OM.AddObjectToStage(cCard);
  g_OM.AddObjectToStage(cCard2);
  g_OM.AddObjectToStage(cCard3);

  Update();
};

function Update(iTimeStamp)
{
  DrawScreen();
};

function DrawScreen()
{
  myGameArea.clear();
  var ctx = GetCanvas();
  g_OM.Draw(ctx);
};

// --------------------------------
// StartGame
// --------------------------------
function StartGame()
{
  console.log("StartGame()");
  // start game
  myGameArea.start();
  Init();
}
