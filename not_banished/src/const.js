var CONST = (function () {
  var c = {};

  // resources
  c.RESOURCE_WATER = 0;
  c.RESOURCE_TREE = 1;
  c.RESOURCE_STONE = 2;
  c.RESOURCE_FOOD = 3;
  // inangible resources
  c.RESOURCE_REST = 100;

  // tasks
  c.TASK_IDLE = 0;
  c.TASK_GOTO_ENTITY = 1;
  c.TASK_HARVEST_RESOURCE = 2;

  return c;
}());
