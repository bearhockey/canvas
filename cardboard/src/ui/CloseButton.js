class CloseButton extends Button
{
    constructor(x, y, objTarget = null)
    {
        super(x, y, CONST.CLOSE_BUTTON_SIZE, CONST.CLOSE_BUTTON_SIZE, " X", objTarget, Button.OPEN_CLOSE);
    }
}