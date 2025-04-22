class RecipeUtils
{
    constructor() {}

    // --------------------------------
    // CheckRecipes
    // --------------------------------
    static CheckRecipes(objParent, objChildren, bAddWork=false)
    {
        var arrPack = [];
        if (objParent != null && objChildren != null)
        {
            var arrRecipes = RECIPE_DEF.SOURCE[objParent];
            var objIngredients;
            var objRecipe;
            var idx;
            var iRecipes = (arrRecipes != null) ? arrRecipes.length : 0;

            var arrOutputEntries;
            var arrRollTable;
            var iRollIdx;
            var iRollWeight;
            var iOutputCount;
            var iOutputIdx;
            var objOutputEntry;
            var iOutCount;

            var bValidRecipe;
            var iTurns;
            var iProgression;
            var iWorkValue;

            for (idx = 0; idx < iRecipes; ++idx)
            {
                bValidRecipe = true;
                objRecipe = arrRecipes[idx];
                if (objRecipe != null && objRecipe.input != null)
                {
                    objIngredients = objRecipe.input;
                    for (var [strType, iCount] of Object.entries(objIngredients))
                    {
                        if (objChildren[strType] == null || objChildren[strType] < iCount)
                        {
                            bValidRecipe = false;
                            break;
                        }
                    } // end of ingredient for loop

                    if (bValidRecipe == true)
                    {
                        arrOutputEntries = objRecipe.output;
                        // build the roll table
                        arrRollTable = [];
                        iOutputCount = (arrOutputEntries != null) ? arrOutputEntries.length : 0;
                        for (iOutputIdx = 0; iOutputIdx < iOutputCount; ++iOutputIdx)
                        {
                            objOutputEntry = arrOutputEntries[iOutputIdx];
                            if (objOutputEntry != null && objOutputEntry.id != null)
                            {
                                iOutCount = (objOutputEntry.count != null) ? objOutputEntry.count : 1;
                                iRollWeight = (objOutputEntry.weight != null) ? objOutputEntry.weight : 1;
                                for (iRollIdx = 0; iRollIdx < iRollWeight; ++iRollIdx);
                                {
                                    arrRollTable.push( { id:objOutputEntry.id, count:iOutCount } );
                                }
                            }
                        } // end recipe for loop

                        // pick the output
                        objIngredients = arrRollTable[Math.floor(Math.random() * arrRollTable.length)];
                        iTurns = (objRecipe.turns != null) ? objRecipe.turns : 1;
                        iProgression = (objParent.GetProgression != null) ? objParent.GetProgression(objIngredients.id) : 0;

                        iWorkValue = (bAddWork== true) ? 1 : 0; // TODO : Bonuses?
                        if (iProgression + iWorkValue >= iTurns)
                        {
                            if (objParent.SetProgressionPoints != null) { objParent.SetProgressionPoints(objIngredients.id, 0, iTurns); }
                            iOutputCount = (objIngredients != null && objIngredients.count != null) ? objIngredients.count : 1;
                            for (iOutputIdx = 0; iOutputIdx < iOutputCount; ++iOutputIdx)
                            {
                                arrPack.push(objIngredients.id);
                            }
                        }
                        else if (objParent.SetProgressionPoints != null)
                        {
                            objParent.SetProgressionPoints(objIngredients.id, iProgression + iWorkValue, iTurns);
                        }
                    }
                }
            } // end of recipe for loop

            // check if parent expires
            if (bAddWork == true && objParent.CanExpire != null && objParent.CanExpire() == true)
            {
                var iUsesLeft = (objParent.GetUsesLeft != null) ? objParent.GetUsesLeft() : 0;
                if (iUsesLeft < 1 && objParent.DiesOnExpire != null && objParent.DiesOnExpire() == true)
                {
                    var arrChildren = (objParent.GetSlots != null) ? objParent.GetSlots() : [];
                    var iChildren = arrChildren.length;
                    for (idx = 0; idx < iChildren; ++idx)
                    {
                        g_Inventory.AddItem(arrChildren[idx]);
                    } // end for loop

                    g_OM.PopObjectFromStage(objParent);
                }
                else if (objParent.Use != null)
                {
                    objParent.Use();
                }
            }
        }

        return (bAddWork == true) ? arrPack : []; // safety valve - don't return anything if no work
    }
}