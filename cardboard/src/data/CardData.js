class CardData
{
    static CID =
    {
        BLANK    : { strName:"" },

        COLONIST : { strName:"Colonist", iSlots:0, iValue:5,  iUses:0, strImage:"./img/card_colonist.png" },

        HOUSE    : { strName:"House",    iSlots:3, iValue:10, iUses:0, strImage:"./img/card_house.png"    },
        WORKSHOP : { strName:"Workshop", iSlots:5, iValue:10, iUses:0, strImage:"./img/card_house.png"    },
        GARDEN   : { strName:"Garden",   iSlots:1, iValue:6,  iUses:0, strImage:"./img/card_garden.png"   },

        POTATO   : { strName:"Potato",   iSlots:0, iValue:1,  iUses:0, strImage:"./img/card_potato.png"   },
        BERRY    : { strName:"Berry",    iSlots:0, iValue:1,  iUses:0, strImage:"./img/card_berry.png"    },

        TREE     : { strName:"Tree",     iSlots:1, iValue:0,  iUses:4, strImage:"./img/card_tree.png"     },
        ROCK     : { strName:"Rock",     iSlots:1, iValue:0,  iUses:5, strImage:"./img/card_rock.png"     },
        BUSH     : { strName:"Bush",     iSlots:1, iValue:0,  iUses:3, strImage:"./img/card_bush.png"     },
    
        WOOD     : { strName:"Wood",     iSlots:0, iValue:1,  iUses:0, strImage:"./img/card_back.png"     }
    };

    // --------------------------------
    // Constructor
    // --------------------------------
    constructor()
    {
        this.m_arrCards = [];
        this.m_mapCards = {};

        let idx;
        let strKey;
        let objValue;
        for ( [strKey, objValue] of Object.entries(CardData.CID))
        {
            idx = this.m_arrCards.length;
            objValue["idx"] = idx;
            objValue["id"] = strKey;
            this.m_arrCards.push(objValue);
            this.m_mapCards[strKey] = idx;
        }
    }

    // --------------------------------
    // GetCardByName
    // --------------------------------
    GetCardByName(strKey)
    {
        let idx = this.m_mapCards[strKey];
        return this.GetCardByIdx(idx);
    }

    // --------------------------------
    // GetCardByIdx
    // --------------------------------
    GetCardByIdx(idx) { return (idx != null && idx < this.m_arrCards.length) ? this.m_arrCards[idx] : {}; }
}