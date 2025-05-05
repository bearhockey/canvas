// managers
let Data = new DataManager();
let Main = new Cardboard();

// temp globals - put these in better places when you can
var cRightPanel = new RightPanel();
var cTopPanel   = new TopPanel(CONST.CANVAS_WIDTH - cRightPanel.GetWidth(), CONST.TOP_PANEL_HEIGHT);

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

// --------------------------------
// SetImage
//     Global callback to the ImageRenderer to set an image as loaded
// --------------------------------
function SetImage() { Main.GetImageRenderer().SetImageLoaded(this.id); }

function Init()
{
    var ctx = Main.GetContext();
    Main.GetImageRenderer().LoadImages(); // should remove

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

    // DebugAddItems(); // used to start with specific items for testing

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
    Main.DrawScreen();
}

// --------------------------------
// StartGame
// --------------------------------
function StartGame()
{
    Main.InitCanvas();
    Init();
}