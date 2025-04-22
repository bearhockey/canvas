var CARD_DEF = (function () {
    var c = {};
    
    c.CID = { BLANK:{ idx:0, strName:"" } };
    c.CID.COLONIST = { strName:"Colonist", iSlots:0, iValue:5,  iUses:0, strImage:"./img/card_colonist.png" };

    c.CID.HOUSE    = { strName:"House",    iSlots:3, iValue:10, iUses:0, strImage:"./img/card_house.png"    };
    c.CID.WORKSHOP = { strName:"Workshop", iSlots:5, iValue:10, iUses:0, strImage:"./img/card_house.png"    };
    c.CID.GARDEN   = { strName:"Garden",   iSlots:1, iValue:6,  iUses:0, strImage:"./img/card_garden.png"   };

    c.CID.POTATO   = { strName:"Potato",   iSlots:0, iValue:1,  iUses:0, strImage:"./img/card_potato.png"   };
    c.CID.BERRY    = { strName:"Berry",    iSlots:0, iValue:1,  iUses:0, strImage:"./img/card_berry.png"    };

    c.CID.TREE     = { strName:"Tree",     iSlots:1, iValue:0,  iUses:4, strImage:"./img/card_tree.png"     };
    c.CID.ROCK     = { strName:"Rock",     iSlots:1, iValue:0,  iUses:5, strImage:"./img/card_rock.png"     };
    c.CID.BUSH     = { strName:"Bush",     iSlots:1, iValue:0,  iUses:3, strImage:"./img/card_bush.png"     };
    
    c.CID.WOOD     = { strName:"Wood",     iSlots:0, iValue:1,  iUses:0, strImage:"./img/card_back.png"     };
    

    return c;
}());