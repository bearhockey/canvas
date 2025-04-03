class Inventory
{
    constructor()
    {
        this.m_arrItems = [];
    }

    AddToInventory(obj) { this.m_arrItems.push(obj); }
    GetInventory() { return this.m_arrItems; }
    TakeFromInventory(obj)
    {
        var idx = this.m_arrItems.indexOf(obj);
        if (idx >= 0) { this.m_arrItems.splice(idx, 1); }
    }
}