var CARD_DEF = (function () {
    var c = {};

    c.TYPE = {};
    c.TYPE.BLANK = 0;
    c.TYPE.COLONIST = 1;
    c.TYPE.HOUSE = 2;
    c.TYPE.GARDEN = 3;
    c.TYPE.POTATO = 4;
    c.TYPE.TREE = 5;

    c.ID = [];
    c.ID.push({ id:0, strName:"" });
    c.ID.push({ id:1, strName:"Colonist", iSlots:0, strImage:"./img/card_colonist.png" });
    c.ID.push({ id:2, strName:"House",    iSlots:3, strImage:"./img/card_house.png"    });
    c.ID.push({ id:3, strName:"Garden",   iSlots:1, strImage:"./img/card_garden.png"   });
    c.ID.push({ id:4, strName:"Potato",   iSlots:0, strImage:"./img/card_potato.png"   });
    c.ID.push({ id:5, strName:"Tree",     iSlots:1, strImage:"./img/card_square.png"   });

    return c;
}());