class Dialog extends Panel
{
    static CLOSE_BUTTON_X = CONST.DIALOG_X + 4;
    static CLOSE_BUTTON_Y = CONST.DIALOG_Y + 4;
    constructor()
    {
        super(CONST.DIALOG_X, CONST.DIALOG_Y, CONST.DIALOG_WIDTH, CONST.DIALOG_HEIGHT);
        this.m_iDialogID = 0;

        this.AddChildToPanel(new CloseButton(Dialog.CLOSE_BUTTON_X, Dialog.CLOSE_BUTTON_Y, g_DM));
    }

    GetDialogID()   { return this.m_iDialogID; }
    SetDialogID(id) { this.m_iDialogID; }
}