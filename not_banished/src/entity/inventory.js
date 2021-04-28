var INVENTORY = (function () {
  // privates
  const DEFAULT_PAWN_COLOR = "#EEEEEE";
  const SHOW_CURRENT_PATH = DEBUG_ON;
  const SEARCH_RADIUS = 5;
  // main
  var inventory = function()
  {
    this.objInventory = {};

    // ----------------
    // this.AddToInventory
    //     Adds stuff into this inventory
    // ----------------
    this.AddToInventory = function(iResType, iQuantity)
    {
      if (this.objInventory[iResType] == null)
      {
        this.objInventory[iResType] = iQuantity;
      }
      else
      {
        this.objInventory[iResType] += iQuantity;
      }

      console.debug("Inventory updated:");
      console.debug(this.objInventory);
    };

    // ----------------
    // this.UseInventory
    //     Uses stuff in the inventory
    // ----------------
    this.UseInventory = function(iResType, iQuantity)
    {
      if (this.objInventory[iResType] == null)
      {
        this.objInventory[iResType] = -iQuantity;
      }
      else
      {
        this.objInventory[iResType] -= iQuantity;
      }

      return (this.objInventory[iResType] >= 0);
    };

    // ----------------
    // this.CanAffordTaskCost
    //     Checks if the inventory can afford the price
    // ----------------
    this.CanAffordTaskCost = function(cTask)
    {
      var arrPrices = cTask.GetTaskCost();
      if (arrPrices == null) { return true; }

      var bCanAfford = true;
      var iCostType;
      var iCostValue;
      var idx;
      var iCostLength = arrPrices.length;
      for (idx = 0; idx < iCostLength; ++idx)
      {
        iCostType = arrPrices[idx].iCostType;
        iCostValue = arrPrices[idx].iCostValue;
        if (iCostType != null && iCostValue != null)
        {
          if (this.objInventory[iCostType] != null)
          {
            if (this.objInventory[iCostType] < iCostValue)
            {
              bCanAfford = false;
            }
          }
          else
          {
            bCanAfford = false;
          }
        }
      } // end for loop

      return bCanAfford;
    };

    // ----------------
    // this.PayTaskCost
    //     Pays the task cost from the inventory
    // ----------------
    this.PayTaskCost = function(cTask)
    {
      var arrPrices = cTask.GetTaskCost();
      if (arrPrices == null) { return; }

      var idx;
      var iCostsLength = arrPrices.length;
      for (idx = 0; idx < iCostsLength; ++idx)
      {
        this.UseInventory(arrPrices[idx].iCostType, arrPrices[idx].iCostValue);
      }
    };
  }; // end of class

  return inventory;
}());
