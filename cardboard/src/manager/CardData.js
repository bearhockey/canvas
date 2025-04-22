class CardData
{
    constructor()
    {
        self.m_arrCards = [];
        self.m_mapCards = {};

        var idx;
        for (var [key, value] of Object.entries(CARD_DEF.CID))
        {
            idx = self.m_arrCards.length;
            value.idx = idx;
            value.id = key;
            self.m_arrCards.push(value);
            self.m_mapCards[key] = idx;
        }
    }

    // --------------------------------
    // GetCardByName
    // --------------------------------
    GetCardByName(strKey)
    {
        var idx = self.m_mapCards[strKey];
        return this.GetCardByIdx(idx);
    }

    // --------------------------------
    // GetCardByIdx
    // --------------------------------
    GetCardByIdx(idx) { return (idx != null && idx < self.m_arrCards.length) ? self.m_arrCards[idx] : null; }
}