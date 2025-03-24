// ----------------------------------------------------------------
// Card
// ----------------------------------------------------------------
class Card extends GameObject
{
    constructor(x=0, y=0, strCardImage=CONST.CARD_BACK_IMG, strCardHighlight=CONST.CARD_HIGHLIGHT_IMG)
    {
        super(x, y, CONST.CARD_WIDTH, CONST.CARD_HEIGHT, strCardImage, strCardHighlight);
        this.bCanGrab = true;
    }
} // end of class