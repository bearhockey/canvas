// managers
var g_IR = new ImageRenderer();
var g_OM = new ObjectManager();
var g_DM = new DialogManager();
var m_Mouse = new MouseManager();
var g_Colony = new Colony();
var g_Inventory = new Inventory();
// temp globals - put these in better places when you can
var cRightPanel = new RightPanel();
var cTopPanel = new TopPanel(CONST.CANVAS_WIDTH - cRightPanel.GetWidth(), CONST.TOP_PANEL_HEIGHT);

var cNextTurnButton;
var cTestButton;
var cInventoryButton;

var cInventory = new Dialog();
var cInventoryGrid = new Grid(g_Inventory.GetInventory(), CONST.DIALOG_X + 64, CONST.DIALOG_Y + 32, 9, 5, 16);

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

  // build dialogs
  cInventory.AddChildToPanel(cInventoryGrid);
  var iInventory = g_DM.AddDialog(cInventory);
  cInventoryButton = new TextButton(ctx, 0, 0, "Inventory", g_DM, iInventory);

  // have to init buttons here because ctx needs to be defined
  cNextTurnButton = new TextButton(ctx, 0, 0, "Next Turn", g_Colony, Colony.BUTTON_NEXT_TURN);
  cTestButton = new TextButton(ctx, 0, 0, "TEST");

  cTopPanel.AddButtonToPanel(cNextTurnButton);
  cTopPanel.AddButtonToPanel(cTestButton);
  cTopPanel.AddButtonToPanel(cInventoryButton);

  g_Inventory.AddToInventory(new Card(CARD_DEF.TYPE.COLONIST));
  g_Inventory.AddToInventory(new Card(CARD_DEF.TYPE.COLONIST));
  g_Inventory.AddToInventory(new Card(CARD_DEF.TYPE.HOUSE));
  g_Inventory.AddToInventory(new Card(CARD_DEF.TYPE.GARDEN));
  g_Inventory.AddToInventory(new Card(CARD_DEF.TYPE.POTATO));

  g_OM.AddPanel(cTopPanel);
  g_OM.AddPanel(cRightPanel);

  Update();
};

// --------------------------------
// Update
//     Global update function for the game
// --------------------------------
function Update(iTimeStamp)
{
  cInventoryGrid.PositionItems(); // probably need to move this to a better place
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
  myGameArea.start();
  Init();
}
