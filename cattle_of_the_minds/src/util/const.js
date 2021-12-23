var CONST = (function () {
  var c = {};

  // directions
  c.NORTHWEST  = 1;
  c.NORTH      = 2;
  c.NORTHWEST  = 3;
  c.EAST       = 4;
  c.SOUTHEAST  = 5;
  c.SOUTH      = 6;
  c.SOUTHWEST  = 7;
  c.WEST       = 8;
  c.DIRECTIONS = [1, 2, 3, 4 , 5, 6, 7, 8];

  // tile shapes
  c.SHAPE_SQUARE = 0;
  c.SHAPE_TOPLEFT_CORNER = 1;
  c.SHAPE_TOPRIGHT_CORNER = 2;
  c.SHAPE_BOTTOMRIGHT_CORNER = 3;
  c.SHAPE_BOTTOMLEFT_CORNER = 4;

  // pawn types
  c.PAWN_HERO = 0; // special type, hero
  c.PAWN_ITEM = 1;
  c.PAWN_ENEMY = 2;
  c.PAWN_TRAP = 3;
  c.PAWN_STAIRS = 4;
  c.PAWN_STORE = 5;
  c.PAWN_DECOR = 6;

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
  c.STAT_ATTACK    = 11;
  c.STAT_ACCURACY  = 12;
  c.STAT_ARMOR     = 13;
  c.STAT_BRAWN     = 21;
  c.STAT_AGILITY   = 22;
  c.STAT_INTELLECT = 23;
  c.STAT_WILLPOWER = 24;

  return c;
}());
