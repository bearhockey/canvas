var JOB = (function () {
  // const
  const REST_THRESHOLD = 3;
  // main
  var job = function()
  {
    this.idx; // current job index

    // ----------------
    // this.GenerateTask
    //     Generates a task based on the pawn's inventory
    // ----------------
    this.GenerateTask = function(objInventory)
    {
      if (objInventory == null) { return null; }
      var cTask = null;
      if (objInventory[CONST.RESOURCE_REST] && objInventory[CONST.RESOURCE_REST] < REST_THRESHOLD)
      {
        // go home
      }
      else
      {
        cTask = new TASK(CONST.TASK_HARVEST_RESOURCE, CONST.RESOURCE_TREE);
      }

      return cTask;
    };
  };

  return job;
}());
