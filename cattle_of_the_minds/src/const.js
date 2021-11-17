var CONST = (function () {
  var c = {};

  // game states
  c.STATE_STAGE = 1;
  c.STATE_INVENTORY = 2;

  // directions
  c.NORTH = 0;
  c.EAST  = 1;
  c.SOUTH = 2;
  c.WEST  = 3;

  // pawn types
  c.PAWN_HERO = 0; // special type, hero
  c.PAWN_ITEM = 1;
  c.PAWN_ENEMY = 2;

  // item types
  c.ITEM_ANY = 0;
  c.ITEM_MONEY = 1;

  return c;
}());
