var PACK_DEF = (function () {
    var c = {};

    c.TYPE = {};
    c.TYPE.BLANK        = 0;
    c.TYPE.STARTER_PACK = 1;
    c.TYPE.BUILDER_PACK = 2;

    c.ID = [];

    c.ID.push({ id:0, strImage:"" });
    c.ID.push({ id:1, iCost:5, strImage:"./img/pack_starter.png", pack:["COLONIST", "TREE", "ROCK", "BUSH"] });
    c.ID.push({ id:2, iCost:5, strImage:"./img/pack_builder.png", pack:["WORKSHOP"] });

    return c;
}());