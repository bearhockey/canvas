var CONST = (function () {
  var c = {};

  // directions
  c.NORTH = 0;
  c.EAST  = 1;
  c.SOUTH = 2;
  c.WEST  = 3;

  // pawn types
  c.PAWN_HERO = 0; // special type, hero
  c.PAWN_ITEM = 1;
  c.PAWN_ENEMY = 2;
  c.PAWN_TRAP = 3;
  c.PAWN_STAIRS = 4;
  c.PAWN_STORE = 5;

  // item types
  c.ITEM_NONE = -1; // not an item
  c.ITEM_ANY = 0;
  c.ITEM_MONEY = 1;
  c.ITEM_WEAPON = 2;
  c.ITEM_HELMET = 3;
  c.ITEM_ARMOR = 4;
  c.ITEM_SHIELD = 5;
  c.ITEM_BOOTS = 6;
  c.ITEM_CLOAK = 7;
  c.ITEM_ACCESSORY = 8;
  c.ITEM_BELT = 9;
  c.ITEM_ADD = 99; // special "item" that is really just an add symbol

  // door types
  c.DOOR_UPSTAIRS = 1;
  c.DOOR_DOWNSTAIRS = 2;

  // stats
  c.STAT_LEVEL     = 1;
  c.STAT_HEALTH    = 2;
  c.STAT_MANA      = 3;
  c.STAT_ATTACK    = 4;
  c.STAT_ACCURACY  = 5;
  c.STAT_BRAWN     = 6;
  c.STAT_AGILITY   = 7;
  c.STAT_INTELLECT = 8;
  c.STAT_WILLPOWER = 9;

  return c;
}());
