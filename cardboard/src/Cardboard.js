class Cardboard
{
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
}