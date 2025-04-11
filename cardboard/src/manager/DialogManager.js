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
        var iDialogID = this.m_arrDialogs.length;
        this.m_arrDialogs.push(cDialog);
        cDialog.SetDialogID(iDialogID);
        return iDialogID;
    }

    // --------------------------------
    // SetDialog
    // --------------------------------
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
    OnButtonClick(iDialogID)
    {
        if (iDialogID == Button.OPEN_CLOSE) // actually passing in button ID and not dialog ID
        {
            this.OnOpenClose();
        }
        else if (this.m_bDialogShowing == true && this.m_cDialog != null && this.m_cDialog.GetDialogID() == iDialogID)
        {
            this.OnOpenClose(); // already a dialog open so close it
        }
        else
        {
            this.SetDialog(iDialogID);
            this.m_bDialogShowing = true;
            Update();
        }
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