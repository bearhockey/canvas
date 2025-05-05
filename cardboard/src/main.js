// managers
let Data = new DataManager();
let Main = new Cardboard();

// temp globals - put these in better places when you can
var cRightPanel = new RightPanel();
var cTopPanel   = new TopPanel(CONST.CANVAS_WIDTH - cRightPanel.GetWidth(), CONST.TOP_PANEL_HEIGHT);
var iBackgroundID;

var cNextTurnButton;
var cInventoryButton;
var cStoreButton;
var cSellButton = new Button(cRightPanel.x - cRightPanel.width/3, cRightPanel.y + cRightPanel.height - 100, 128, 64, "SELL", Main.GetColony(), Colony.BUTTON_SELL_CARD);

var cInventory = new Dialog();
var cInventoryGrid = new Grid(Main.GetInventory().GetInventory(),
                              cInventory.GetPosition()[0] + Inventory.GRID_HORIZONTAL_PADDING,
                              cInventory.GetPosition()[1] + Inventory.GRID_VERTICAL_PADDING,
                              Inventory.GRID_COLUMNS, Inventory.GRID_ROWS, Inventory.GRID_SPACING);
var cStore = new Dialog(CONST.DIALOG_WIDTH, Store.WINDOW_HEIGHT);
var cStoreGrid = new Grid(Main.GetStore().GetInventory(),
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
        this.canvas.addEventListener('mousemove', Main.GetMouse().Move);
        this.canvas.addEventListener('click', Main.GetMouse().LeftClick);
        // this.canvas.addEventListener('contextmenu', Main.GetMouse().RightClick);
    },
    clear : function() { this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); }
};

// --------------------------------
// DebugAddItems
// --------------------------------
function DebugAddItems()
{
    // Main.GetInventory().AddItem(new Card(CARD_DEF.CID.COLONIST));
    // Main.GetInventory().AddItem(new Card(CARD_DEF.CID.WORKSHOP));
};

// --------------------------------
// SetImage
//     Global callback to the ImageRenderer to set an image as loaded
// --------------------------------
function SetImage() { Main.GetImageRenderer().SetImageLoaded(this.id); }

function GetCanvas() { return myGameArea.context; };

function Init()
{
    var ctx = GetCanvas();
    iBackgroundID = Main.GetImageRenderer().LoadImage(CONST.PLAY_AREA_BACKGROUND);
    Main.GetImageRenderer().LoadImages();

    // build dialogs
    cInventory.AddChildToPanel(cInventoryGrid);
    var iInventory = Main.GetDialogManager().AddDialog(cInventory);
    cInventoryButton = new TextButton(ctx, 0, 0, "Inventory", Main.GetDialogManager(), iInventory);

    cStore.AddChildToPanel(cStoreGrid);
    var iStore = Main.GetDialogManager().AddDialog(cStore);
    cStoreButton = new TextButton(ctx, 0, 0, "Store", Main.GetDialogManager(), iStore);

    cSellButton.SetEnabled(false);
    Main.GetObjectManager().AddCardButton(cSellButton);

    // have to init buttons here because ctx needs to be defined
    cNextTurnButton = new TextButton(ctx, 0, 0, "Next Turn", Main.GetColony(), Colony.BUTTON_NEXT_TURN);

    cTopPanel.AddButtonToPanel(cNextTurnButton);
    cTopPanel.AddButtonToPanel(cInventoryButton);
    cTopPanel.AddButtonToPanel(cStoreButton);

    Main.GetStore().AddItem(new CardPack(Data.GetPackData().GetPackByName("STARTER")));
    Main.GetStore().AddItem(new CardPack(Data.GetPackData().GetPackByName("BUILDER")));

    Main.GetPanelManager().AddPanel(cTopPanel);
    Main.GetPanelManager().AddPanel(cRightPanel);

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
    Main.GetImageRenderer().DrawImage(ctx, iBackgroundID, -32, -32);
    Main.GetObjectManager().Draw(ctx);
    Main.GetPanelManager().Draw(ctx);

    if (Main.GetDialogManager().IsDialogShowing())
    {
        Main.GetDialogManager().Draw(ctx);
    }
    else
    {
        Main.GetObjectManager().DrawGrabbedObject(ctx); // do not draw grabbed object if a dialog is up
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