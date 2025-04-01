// managers
var g_IR = new ImageRenderer();
var g_OM = new ObjectManager();
var g_DM = new DialogManager();
var m_Mouse = new MouseManager();
var g_Colony = new Colony();
// temp globals - put these in better places when you can

var cCard = new Card(50, 123, 0, "./img/card_square.png");
var cCard2 = new Card(200, 123, 0, "./img/card_circle.png");
var cCard3 = new Card(350, 123, 1, "./img/card_triangle.png");

var cRightPanel = new RightPanel();
var cTopPanel = new TopPanel(CONST.CANVAS_WIDTH - cRightPanel.GetWidth(), CONST.TOP_PANEL_HEIGHT);

var cNextTurnButton;
var cTestButton;
var cInventoryButton;

var cInventory = new Dialog();

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

// --------------------------------
// SetImage
//     Global callback to the ImageRenderer to set an image as loaded
// --------------------------------
function SetImage() { g_IR.SetImageLoaded(this.id); }

function GetCanvas() { return myGameArea.context; };

function Init()
{
  var ctx = GetCanvas();
  g_IR.LoadImages();

  // have to init buttons here because ctx needs to be defined
  cNextTurnButton = new TextButton(ctx, 0, 0, "Next Turn", g_Colony, Colony.BUTTON_NEXT_TURN);
  cTestButton = new TextButton(ctx, 0, 0, "TEST");
  cInventoryButton = new TextButton(ctx, 0, 0, "Inventory", g_DM, CONST.BUTTON_ACTION_OPEN_CLOSE);

  cTopPanel.AddButtonToPanel(cNextTurnButton);
  cTopPanel.AddButtonToPanel(cTestButton);
  cTopPanel.AddButtonToPanel(cInventoryButton);

  // add a dialog for now
  cInventory.AddChildToPanel(new CloseButton(Dialog.CLOSE_BUTTON_X, Dialog.CLOSE_BUTTON_Y, g_DM));
  g_DM.SetCurrentDialog(cInventory);
  
  // TODO: make a function/class to load a single copy of all images instead of multiple copies
  g_OM.AddPanel(cTopPanel);
  g_OM.AddPanel(cRightPanel);
  g_OM.AddObjectToStage(cCard);
  g_OM.AddObjectToStage(cCard2);
  g_OM.AddObjectToStage(cCard3);

  Update();
};

// --------------------------------
// Update
//     Global update function for the game
// --------------------------------
function Update(iTimeStamp)
{
  DrawScreen();
};

// --------------------------------
// DrawScreen
//     Global function to draw the screen
// --------------------------------
function DrawScreen()
{
  myGameArea.clear();
  var ctx = GetCanvas();
  g_OM.Draw(ctx);

  if (g_DM.IsDialogShowing())
  {
    g_DM.Draw(ctx);
  }
};

// --------------------------------
// StartGame
// --------------------------------
function StartGame()
{
  // start game
  myGameArea.start();
  Init();
}
