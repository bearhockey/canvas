class RecipeData
{
    static SOURCE =
    {
        HOUSE:
        [
            {
                input   : { ["COLONIST"]:2 },
                output  : [{ id:"COLONIST", count:1 }], // should be a BABY
                turns   : 3
            }
        ],
        GARDEN:
        [
            {
                input   : { ["POTATO"]:1 },
                output  : [{ id:"POTATO", count:1 }],
                turns   : 3
            },
            {
                input   : { ["BERRY"]:1 },
                output  : [ { id:"BUSH", count:1 }],
                turns   : 3
            }
        ],
        BUSH:
        [
            {
                input   : { ["COLONIST"]:1 },
                output  : [ { id:"BERRY", count:1, weight:9 },
                            { id:"BERRY", count:2, weight:1 } ]
            }
        ],
        TREE:
        [
            {
                input   : { ["COLONIST"]:1 },
                output  : [ { id:"WOOD", count:1, weight:1 },
                            { id:"WOOD", count:1, weight:1 } ]
            }
        ]
    };

    // --------------------------------
    // Constructor
    // --------------------------------
    constructor() {}

    // --------------------------------
    // GetRecipeByname
    // --------------------------------
    GetRecipeByname(strKey)
    {
        return RecipeData.SOURCE[strKey];
    }
}