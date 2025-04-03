class DialogManager
{
    constructor()
    {
        this.m_cDialog = null;
        this.m_arrDialogs = [];
        this.m_bDialogShowing = false;
    }

    // Getters and Setters
    // --------------------------------
    GetCurrentDialog()          { return this.m_cDialog; }
    IsDialogShowing()           { return (this.m_bDialogShowing && this.m_cDialog != null); }
    ShowDialog(bShow)           { this.m_bDialogShowing = bShow; }

    // --------------------------------
    // AddDailog
    // --------------------------------
    AddDialog(cDialog)
    {
        this.m_arrDialogs.push(cDialog);
        return this.m_arrDialogs.length - 1;
    }

    SetDialog(idx = 0)
    {
        if (idx < this.m_arrDialogs.length)
        {
            this.m_cDialog = this.m_arrDialogs[idx];
        }
    }

    // --------------------------------
    // OnButtonClick
    // --------------------------------
    OnButtonClick(iButtonID)
    {
        if (iButtonID == CONST.BUTTON_ACTION_OPEN_CLOSE) { this.OnOpenClose(); }
    }

    // --------------------------------
    // OnOpenClose
    // --------------------------------
    OnOpenClose()
    {
        this.m_bDialogShowing = !this.m_bDialogShowing;
        Update();
    }

    // --------------------------------
    // Draw
    // --------------------------------
    Draw(ctx)
    {
        if (this.m_bDialogShowing == true && this.m_cDialog != null && this.m_cDialog.Draw != null)
        {
            // fade out background
            ctx.fillStyle = "#00000088";
            ctx.fillRect(0, 0, CONST.CANVAS_PLAY_WIDTH, CONST.CANVAS_HEIGHT);

            this.m_cDialog.Draw(ctx);
        }
    }

}