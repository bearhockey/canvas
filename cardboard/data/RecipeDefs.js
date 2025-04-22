var RECIPE_DEF = (function () {
    var c = {};

    c.SOURCE = [];

    c.SOURCE["HOUSE"] =
    [
        {
            "input"  : { ["COLONIST"]:2 },
            "output" : [{ id:"COLONIST", count:1 }], // should be a BABY
            "turns"  : 3
        }
    ];

    c.SOURCE["GARDEN"] =
    [
        {
            "input"  : { ["POTATO"]:1 },
            "output" : [{ id:"POTATO", count:1 }],
            "turns"  : 3
        },
        {
            "input"  : { ["BERRY"]:1 },
            "output" : [ { id:"BUSH", count:1 }],
            "turns"  : 3
        }
    ];

    c.SOURCE["BUSH"] =
    [
        {
            "input" : { ["COLONIST"]:1 },
            "output": [ { id:"BERRY", count:1, weight:9 },
                        { id:"BERRY", count:2, weight:1 } ]
        }
    ];

    c.SOURCE["TREE"] =
    [
        {
            "input" : { ["COLONIST"]:1 },
            "output": [ { id:"WOOD", count:1, weight:1 },
                        { id:"WOOD", count:1, weight:1 } ]
        }
    ];

    return c;
}());