class Inventory
{
    static GRID_HORIZONTAL_PADDING = 64;
    static GRID_VERTICAL_PADDING = 32;
    static GRID_SPACING = 16;
    static GRID_ROWS = 5;
    static GRID_COLUMNS = 9;

    constructor()
    {
        this.m_arrItems = [];
    }

    AddItem(obj)        { this.m_arrItems.push(obj); }
    AddPack(arrPackDef)
    {
        if (arrPackDef != null)
        {
            var cCard
            var idx;
            var iCards = arrPackDef.length;
            for (idx = 0; idx < iCards; ++idx)
            {
                cCard = new Card(arrPackDef[idx]);
                this.AddItem(cCard);
            }
        }
    }

    GetInventory()      { return this.m_arrItems; }
    TakeFromInventory(obj)
    {
        var idx = this.m_arrItems.indexOf(obj);
        if (idx >= 0) { this.m_arrItems.splice(idx, 1); }
    }
}