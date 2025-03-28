class ObjectUtils
{
    constructor() {}

    static CheckForHighlights(arrObjects, arrPosition, arrIgnoreList = [])
    {
        var obj;
        var objHighlighted = null;
        var idx;
        var iObjects = (arrObjects != null) ? arrObjects.length : 0;
        var bIsHit = false;
        var bStopHighlight = true;
        var bOldValue;
        for (idx = 0; idx < iObjects; ++idx)
        {
            obj = arrObjects[idx];
            if (obj != null && obj.GetBounds != null)
            {
                bOldValue = (obj.IsHighlighted != null) ? obj.IsHighlighted() : false;
                bIsHit = (GEO.IsInRect(arrPosition, obj.GetBounds()) && arrIgnoreList.indexOf(obj) < 0);
                if (bIsHit)
                {
                    bStopHighlight = false;
                    objHighlighted = obj;
                }

                if (obj.SetHighlight != null)
                {
                    obj.SetHighlight(bIsHit);
                }
            }
        } // end of for loop

        if (bStopHighlight) { objHighlighted = null; }

        return objHighlighted;
    }
}