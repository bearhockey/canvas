class Dialog extends Panel
{
    static CLOSE_BUTTON_PADDING = 4;
    constructor(width=CONST.DIALOG_WIDTH, height=CONST.DIALOG_HEIGHT)
    {
        var x = CONST.CANVAS_PLAY_WIDTH/2 - width/2;
        var y = CONST.CANVAS_PLAY_HEIGHT/2 - height/2 + CONST.TOP_PANEL_HEIGHT;
        super(x, y, width, height);
        this.m_iDialogID = 0;

        this.AddChildToPanel(new CloseButton(this.x + Dialog.CLOSE_BUTTON_PADDING, this.y + Dialog.CLOSE_BUTTON_PADDING, Main.GetDialogManager()));
    }

    GetDialogID()   { return this.m_iDialogID; }
    SetDialogID(id) { this.m_iDialogID; }
}