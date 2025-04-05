var RECIPE_DEF = (function () {
    var c = {};

    c.SOURCE = [];

    c.SOURCE[CARD_DEF.TYPE.HOUSE] =
    [
        {
            "input"         : { [CARD_DEF.TYPE.COLONIST]:2 },
            "output"        : { id:CARD_DEF.TYPE.COLONIST, count:1 },
            "turns"         : 3
        }
    ];

    c.SOURCE[CARD_DEF.TYPE.GARDEN] =
    [
        {
            "input"     : { [CARD_DEF.TYPE.POTATO]:1 },
            "output"    : { id:CARD_DEF.TYPE.POTATO, count:1 }
        }
    ];

    return c;
}());