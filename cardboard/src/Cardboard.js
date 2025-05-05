class Cardboard
{
    static CANVAS_WIDTH = 1560;
    static CANVAS_HEIGHT = 820;
    static CANVAS_SAFE_ZONE = -32;
    static CANVAS_VIEW_AREA = { left:0, top:0, right:1560, bottom:820 };
    static CANVAS_PLAY_WIDTH = 1160;
    static CANVAS_PLAY_HEIGHT = 756; // 820-64
    static CANVAS_PLAY_AREA = { left:0, top:64, right:1160, bottom:756 };
    static PLAY_AREA_BACKGROUND = "./img/play_area.png";

    // --------------------------------
    // Constructor
    // --------------------------------
    constructor()
    {
        this.g_ImageRenderer = new ImageRenderer();
        this.g_ObjectManager = new ObjectManager();
        this.g_PanelManager  = new PanelManager();
        this.g_DialogManager = new DialogManager();

        this.g_MouseManager  = new MouseManager();

        this.g_Colony        = new Colony();
        this.g_Inventory     = new Inventory();
        this.g_Store         = new Store();

        this.cRightPanel     = new RightPanel();
        this.cTopPanel       = new TopPanel(Cardboard.CANVAS_WIDTH - this.cRightPanel.GetWidth(), TopPanel.TOP_PANEL_HEIGHT);
    }

    // Getters
    // --------------------------------
    GetImageRenderer() { return this.g_ImageRenderer; }
    GetObjectManager() { return this.g_ObjectManager; }
    GetPanelManager()  { return this.g_PanelManager;  }
    GetDialogManager() { return this.g_DialogManager; }

    GetMouse() { return this.g_MouseManager; }

    GetColony()    { return this.g_Colony;    }
    GetInventory() { return this.g_Inventory; }
    GetStore()     { return this.g_Store;     }

    GetRightPanel() { return this.cRightPanel; }
    GetTopPanel()   { return this.cTopPanel;   }

    GetCanvas()    { return this.canvas;      }
    GetContext()   { return this.context;     }
    ClearContext() { this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); }

    // --------------------------------
    // InitCanvas
    // --------------------------------
    InitCanvas()
    {
        this.canvas = document.createElement("canvas");
        this.canvas.width = Cardboard.CANVAS_WIDTH;
        this.canvas.height = Cardboard.CANVAS_HEIGHT;

        this.context = this.canvas.getContext("2d");
        document.getElementById('divCanvas').appendChild(this.canvas);

        this.canvas.addEventListener('mousemove', this.g_MouseManager.Move);
        this.canvas.addEventListener('click', this.g_MouseManager.LeftClick);
    }

    // --------------------------------
    // InitBackgroundImage
    // --------------------------------
    InitBackgroundImage()
    {
        this.m_iBackgroundID = this.g_ImageRenderer.LoadImage(Cardboard.PLAY_AREA_BACKGROUND);
    }

    // --------------------------------
    // DrawScreen
    //     Draws the main game screen
    // --------------------------------
    DrawScreen()
    {
        this.ClearContext()
        this.g_ImageRenderer.DrawImage(this.context, this.m_iBackgroundID, Cardboard.CANVAS_SAFE_ZONE, Cardboard.CANVAS_SAFE_ZONE);
        this.g_ObjectManager.Draw(this.context);
        this.g_PanelManager.Draw(this.context);

        if (this.g_DialogManager.IsDialogShowing())
        {
            this.g_DialogManager.Draw(this.context);
        }
        else
        {
            this.g_ObjectManager.DrawGrabbedObject(this.context); // do not draw grabbed object if a dialog is up
        }
    }

    // --------------------------------
    // DebugAddItems
    // --------------------------------
    DebugAddItems()
    {
        // this.g_Inventory.AddItem(new Card(CARD_DEF.CID.COLONIST));
        // this.g_Inventory.AddItem(new Card(CARD_DEF.CID.WORKSHOP));
    };
}