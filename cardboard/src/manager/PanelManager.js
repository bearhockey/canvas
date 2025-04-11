class PanelManager
{
    constructor()
    {
        this.m_arrPanels = [];
    }

    // --------------------------------
    // AddPanel
    // --------------------------------
    AddPanel(cPanel)
    {
        if (this.m_arrPanels.indexOf(cPanel) < 0) { this.m_arrPanels.push(cPanel); }
    }

    // --------------------------------
    // CheckMouse
    // --------------------------------
    CheckMouse(arrMousePosition, bCheckForClick = false)
    {
        var bMouseInPanel = false;
        var cPanel;
        var idx;
        var iPanels = this.m_arrPanels.length;
        for (idx = 0; idx < iPanels; ++idx)
        {
            cPanel = this.m_arrPanels[idx];
            if (GEO.IsInRect(arrMousePosition, cPanel.GetBounds()))
            {
                if (bCheckForClick) { cPanel.OnClick(arrMousePosition); }
                else                { cPanel.CheckForHighlights(arrMousePosition); }
                bMouseInPanel = true;
                break;
            }
        } // end of for loop

        return bMouseInPanel;
    }

    // --------------------------------
    // Draw
    // --------------------------------
    Draw(ctx)
    {
        var cPanel;
        var idx;
        var iPanels = this.m_arrPanels.length;
        for (idx = 0; idx < iPanels; ++idx)
        {
            cPanel = this.m_arrPanels[idx];
            if (cPanel != null && cPanel.Draw != null) { cPanel.Draw(ctx); }
        }
    }
}