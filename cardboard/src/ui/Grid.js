class Grid
{
    static DEFAULT_SPACING = 8;
    constructor(arrItems, iAnchorX, iAnchorY, iItemsWide=1, iItemsTall=1, iItemSpacing=Grid.DEFAULT_SPACING)
    {
        this.x = iAnchorX;
        this.y = iAnchorY;
        this.width = iItemsWide;
        this.height = iItemsTall;
        this.spacing = iItemSpacing;

        this.m_arrItems = arrItems;
    }

    GetChildren() { return this.m_arrItems; }

    // --------------------------------
    // PositionItems
    // --------------------------------
    PositionItems()
    {
        if (this.m_arrItems != null)
        {
            var obj;
            var idx = 0;
            var iLength = this.m_arrItems.length;
            var iRow;
            var iColumn;
            var x_pos;
            var y_pos = this.y;
            var iTallestItem;
            for (iRow = 0; iRow < this.height; ++iRow)
            {
                x_pos = this.x;
                iTallestItem = this.spacing;
                for (iColumn = 0; iColumn < this.width; ++iColumn)
                {
                    obj = (idx < iLength) ? this.m_arrItems[idx] : null;
                    if (obj != null && obj.Move != null)
                    {
                        obj.Move(x_pos, y_pos);
                        x_pos += obj.GetWidth() + this.spacing;
                        iTallestItem = Math.max(obj.GetHeight(), iTallestItem);
                    }

                    idx++;
                } // end column loop

                y_pos += iTallestItem + this.spacing;
            } // end row loop
        }
    }

    // --------------------------------
    // Draw
    // --------------------------------
    Draw(ctx)
    {
        if (this.m_arrItems != null)
        {
            var idx;
            var iLength = this.m_arrItems.length;
            var obj;
            for (idx = 0; idx < iLength; ++idx)
            {
                obj = this.m_arrItems[idx];
                if (obj != null && obj.Draw != null)
                {
                    obj.Draw(ctx);
                }
            }
        }
    }
}