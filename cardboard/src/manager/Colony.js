class Colony
{
    static BUTTON_NEXT_TURN = 1;
    static BUTTON_SELL_CARD = 2;
    constructor()
    {
        this.m_iCurrentTurn = 0;

        this.m_iFoodStores = 0;
        this.m_iCurrency = 5;
    }

    // getters and setters
    GetTurn()              { return this.m_iCurrentTurn; }
    GetCurrency()          { return this.m_iCurrency; }
    SpendCurrency(iAmount) { this.m_iCurrency -= iAmount; }

    // --------------------------------
    // AdvanceTurn
    //     Advances the number of turns - defaults to just one turn
    // --------------------------------
    AdvanceTurn(iTurns = 1)
    {
        Main.GetObjectManager().CalculateChildren(true);
        this.m_iCurrentTurn += iTurns;
    }

    // --------------------------------
    // SellCard
    // --------------------------------
    SellCard()
    {
        var cCard = Main.GetObjectManager().SellGrabbedObject();
        if (cCard != null && cCard.GetValue != null)
        {
            this.m_iCurrency += cCard.GetValue();
        }
    }

    // --------------------------------
    // OnButtonClick
    //     Listener for buttons to click
    // --------------------------------
    OnButtonClick(iButtonAction)
    {
        switch (iButtonAction)
        {
            case Colony.BUTTON_NEXT_TURN: { this.AdvanceTurn(); break; }
            case Colony.BUTTON_SELL_CARD: { this.SellCard();    break; }
            default: break;
        } // end of switch

        Update();
    }
}