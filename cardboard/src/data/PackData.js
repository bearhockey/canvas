class PackData
{
    static PACK =
    {
        BLANK   : { idx:0, strImage:"" },
        STARTER : { idx:1, iCost:5, strImage:"./img/pack_starter.png", pack:["COLONIST", "TREE", "ROCK", "BUSH"] },
        BUILDER : { idx:2, iCost:5, strImage:"./img/pack_builder.png", pack:["WORKSHOP"] }
    };

    // --------------------------------
    // Constructor
    // --------------------------------
    constructor() {}

    // --------------------------------
    // GetPackByName
    // --------------------------------
    GetPackByName(strKey)
    {
        return PackData.PACK[strKey];
    }
}