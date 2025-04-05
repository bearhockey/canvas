class Colony
{
    static BUTTON_NEXT_TURN = 1;
    constructor()
    {
        this.m_iCurrentTurn = 0;

        this.m_iFoodStores = 0;
    }

    // getters and setters
    GetTurn() { return this.m_iCurrentTurn; }

    // --------------------------------
    // AdvanceTurn
    //     Advances the number of turns - defaults to just one turn
    // --------------------------------
    AdvanceTurn(iTurns = 1)
    {
        g_OM.CalculateChildren(true);
        this.m_iCurrentTurn += iTurns;
    }

    // --------------------------------
    // OnButtonClick
    //     Listener for buttons to click
    // --------------------------------
    OnButtonClick(iButtonAction)
    {
        if (iButtonAction == Colony.BUTTON_NEXT_TURN)
        {
            this.AdvanceTurn();
            Update();
        }
    }
}