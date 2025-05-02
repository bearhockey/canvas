// managers
let Data = new DataManager();

var g_IR        = new ImageRenderer();
var g_OM        = new ObjectManager();
var g_PM        = new PanelManager();
var g_DM        = new DialogManager();
var m_Mouse     = new MouseManager();
var g_Colony    = new Colony();
var g_Inventory = new Inventory();
var g_Store     = new Store();

// temp globals - put these in better places when you can
var cRightPanel = new RightPanel();
var cTopPanel   = new TopPanel(CONST.CANVAS_WIDTH - cRightPanel.GetWidth(), CONST.TOP_PANEL_HEIGHT);
var iBackgroundID;

var cNextTurnButton;
var cInventoryButton;
var cStoreButton;
var cSellButton = new Button(cRightPanel.x - cRightPanel.width/3, cRightPanel.y + cRightPanel.height - 100, 128, 64, "SELL", g_Colony, Colony.BUTTON_SELL_CARD);

var cInventory = new Dialog();
var cInventoryGrid = new Grid(g_Inventory.GetInventory(),
                              cInventory.GetPosition()[0] + Inventory.GRID_HORIZONTAL_PADDING,
                              cInventory.GetPosition()[1] + Inventory.GRID_VERTICAL_PADDING,
                              Inventory.GRID_COLUMNS, Inventory.GRID_ROWS, Inventory.GRID_SPACING);
var cStore = new Dialog(CONST.DIALOG_WIDTH, Store.WINDOW_HEIGHT);
var cStoreGrid = new Grid(g_Store.GetInventory(),
                          cStore.GetPosition()[0] + Store.GRID_HORIZONTAL_PADDING,
                          cStore.GetPosition()[1] + Store.GRID_VERTICAL_PADDING,
                          Store.GRID_COLUMNS, Store.GRID_ROWS, Store.GRID_SPACING);

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
        // this.canvas.addEventListener('contextmenu', m_Mouse.RightClick);
    },
    clear : function() { this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); }
};

// --------------------------------
// DebugAddItems
// --------------------------------
function DebugAddItems()
{
    // g_Inventory.AddItem(new Card(CARD_DEF.CID.COLONIST));
    // g_Inventory.AddItem(new Card(CARD_DEF.CID.WORKSHOP));
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
    iBackgroundID = g_IR.LoadImage(CONST.PLAY_AREA_BACKGROUND);
    g_IR.LoadImages();

    // build dialogs
    cInventory.AddChildToPanel(cInventoryGrid);
    var iInventory = g_DM.AddDialog(cInventory);
    cInventoryButton = new TextButton(ctx, 0, 0, "Inventory", g_DM, iInventory);

    cStore.AddChildToPanel(cStoreGrid);
    var iStore = g_DM.AddDialog(cStore);
    cStoreButton = new TextButton(ctx, 0, 0, "Store", g_DM, iStore);

    cSellButton.SetEnabled(false);
    g_OM.AddCardButton(cSellButton);

    // have to init buttons here because ctx needs to be defined
    cNextTurnButton = new TextButton(ctx, 0, 0, "Next Turn", g_Colony, Colony.BUTTON_NEXT_TURN);

    cTopPanel.AddButtonToPanel(cNextTurnButton);
    cTopPanel.AddButtonToPanel(cInventoryButton);
    cTopPanel.AddButtonToPanel(cStoreButton);

    g_Store.AddItem(new CardPack(Data.GetPackData().GetPackByName("STARTER")));
    g_Store.AddItem(new CardPack(Data.GetPackData().GetPackByName("BUILDER")));

    g_PM.AddPanel(cTopPanel);
    g_PM.AddPanel(cRightPanel);

    DebugAddItems(); // used to start with specific items for testing

    Update();
};

// --------------------------------
// Update
//     Global update function for the game
// --------------------------------
function Update(iTimeStamp)
{
    cInventoryGrid.PositionItems(); // probably need to move this to a better place
    cStoreGrid.PositionItems();
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
    g_IR.DrawImage(ctx, iBackgroundID, -32, -32);
    g_OM.Draw(ctx);
    g_PM.Draw(ctx);

    if (g_DM.IsDialogShowing())
    {
        g_DM.Draw(ctx);
    }
    else
    {
        g_OM.DrawGrabbedObject(ctx); // do not draw grabbed object if a dialog is up
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