var RENDER = (function () {
    // consts
    const FADE_DELTA = 0.05;
    // private vars
    var m_adhoc_image;

    var m_background;
    var m_bBackgroundLoaded = false;

    var m_foreground;
    var m_fForegroundAlpha = 1.0;
    var m_fForegroundAlphaTarget = 1.0;
    var m_bForegroundLoaded = false;
    var m_fForegroundWidth;
    var m_fForegroundHeight;

    var m_effects;
    var m_fEffectsAlpha = 1.0;
    var m_fEffectsAlphaTarget = 1.0;
    var m_bEffectsLoaded = false;

    var m_fFadeAlpha = 1.0;
    var m_fFadeTarget = 0.0;
    var m_bIsFadingIn = false;
    var m_bIsFadingOut = false;
    var m_bHoldFade = false;

    // main
    var r = {};

    // --------------------------------
    // EnableShadow
    // --------------------------------
    r.EnableShadow = function()
    {
        var ctx = GetCanvas();
        if (ctx != null)
        {
            ctx.shadowColor = "black"; // Shadow color
            ctx.shadowBlur = 1; // Blur level
            ctx.shadowOffsetX = 2; // Horizontal offset
            ctx.shadowOffsetY = 2; // Vertical offset
        }
    };

    // ----------------
    // DisableShadow
    // ----------------
    r.DisableShadow = function()
    {
        var ctx = GetCanvas();
        if (ctx != null)
        {
            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }
    };

    // ----------------
    // SetBackground
    // ----------------
    r.SetBackground = function(strURL)
    {
        m_bBackgroundLoaded = false;
        m_background = null;
        if (strURL != "clear")
        {
            m_background = new Image();
            m_background.onload = function () { m_bBackgroundLoaded = true; RENDER.CheckPreview(); };
            m_background.src = strURL;
        }
    };

    // --------------------------------
    // SetForeground
    // --------------------------------
    r.SetForeground = function(strURL)
    {
        m_bForegroundLoaded = false;
        m_foreground = null;
        m_fForegroundAlpha = 0.0;
        m_fForegroundAlphaTarget = 1.0;
        m_foreground = new Image();
        m_foreground.onload = function ()
        {
            m_fForegroundWidth = this.naturalWidth;
            m_fForegroundHeight = this.naturalHeight;
            m_bForegroundLoaded = true;
            RENDER.CheckPreview();
        };

        m_foreground.src = strURL;
    };

    // --------------------------------
    // SetEffects
    // --------------------------------
    r.SetEffects = function(strURL)
    {
        m_bEffectsLoaded = false;
        m_effects = null;
        m_fEffectsAlpha = 0.0;
        m_fEffectsAlphaTarget = 1.0;
        m_effects = new Image();
        m_effects.onload = function () { m_bEffectsLoaded = true; RENDER.CheckPreview(); };
        m_effects.src = strURL;
    };

    // --------------------------------
    // ClearForeground
    // --------------------------------
    r.ClearForeground = function()
    {
        m_fForegroundAlphaTarget = 0.0;
    };

    // --------------------------------
    // DrawEffects
    // --------------------------------
    r.DrawEffects = function()
    {
        var ctx = GetCanvas();
        if (ctx != null && m_bEffectsLoaded)
        {
            if (m_fEffectsAlpha < m_fEffectsAlphaTarget) { m_fEffectsAlpha += FADE_DELTA; }
            else if (m_fEffectsAlpha > m_fEffectsAlphaTarget) { m_fEffectsAlpha -= FADE_DELTA; }
            if (m_fEffectsAlpha <= 0.0 && m_effects != null)
            {
                m_effects = null;
                m_bEffectsLoaded = false;
            }
            else
            {
                ctx.globalAlpha = m_fEffectsAlpha;
                ctx.drawImage(m_effects, 0, 0);
                ctx.globalAlpha = 1.0; // reset alpha
            }
        }
    };

    // --------------------------------
    // DrawForeground
    // --------------------------------
    r.DrawForeground = function()
    {
        var ctx = GetCanvas();
        if (ctx != null && m_bForegroundLoaded)
        {
            if (m_fForegroundAlpha < m_fForegroundAlphaTarget) { m_fForegroundAlpha += FADE_DELTA; }
            else if (m_fForegroundAlpha > m_fForegroundAlphaTarget) { m_fForegroundAlpha -= FADE_DELTA; }
            if (m_fForegroundAlpha <= 0.0 && m_foreground != null)
            {
                m_foreground = null;
                m_bForegroundLoaded = false;
            }
            else
            {
                let x_pos = GetCanvasWidth()/2 - m_fForegroundWidth/2;
                let y_pos = GetCanvasHeight() - m_fForegroundHeight;
                ctx.globalAlpha = m_fForegroundAlpha;
                ctx.drawImage(m_foreground, x_pos, y_pos);
                ctx.globalAlpha = 1.0; // reset alpha
            }
        }
    };

    // ----------------
    // SetFade
    // ----------------
    r.SetFade = function(fTarget, bStayFaded=false)
    {
        m_fFadeTarget = fTarget;
        m_bHoldFade = bStayFaded;
        m_bIsFadingIn = (m_fFadeTarget < m_fFadeAlpha);
        m_bIsFadingOut = (m_fFadeTarget > m_fFadeAlpha);
    };

    // ----------------
    // DrawFade
    // ----------------
    r.DrawFade = function()
    {
        var ctx = GetCanvas();
        if (m_bIsFadingIn)
        {
            if (m_fFadeAlpha >= m_fFadeTarget) { m_fFadeAlpha -= FADE_DELTA; }
            else                               { m_bIsFadingIn = false;  }
        }
        else if (m_bIsFadingOut)
        {
            if (m_fFadeAlpha <= m_fFadeTarget) { m_fFadeAlpha += FADE_DELTA; }
            else                               { m_bIsFadingOut = false; }
        }

        if (m_bIsFadingIn || m_bIsFadingOut || m_bHoldFade)
        {
            ctx.fillStyle = "black";
            ctx.globalAlpha = m_fFadeAlpha;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.globalAlpha = 1.0;
        }
    };

    r.DrawBevel = function(ctx, rRect, objColor, iLineWidth=4)
    {
      ctx.fillStyle = objColor.color;
      ctx.fillRect(rRect.x, rRect.y, rRect.width, rRect.height);
      ctx.beginPath();
      ctx.lineWidth = iLineWidth;
      ctx.strokeStyle = objColor.highlight;
      ctx.moveTo(rRect.x, rRect.y + rRect.height);
      ctx.lineTo(rRect.x, rRect.y);
      ctx.lineTo(rRect.x + rRect.width, rRect.y);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.strokeStyle = objColor.shadow;
      ctx.moveTo(rRect.x, rRect.y + rRect.height);
      ctx.lineTo(rRect.x + rRect.width, rRect.y + rRect.height);
      ctx.lineTo(rRect.x + rRect.width, rRect.y);
      ctx.stroke();
      ctx.closePath();
    };

    r.CheckPreview = function()
    {
        if (InEditMode()) { RENDER.Render(); }
    };

    // --------------------------------
    // DrawImage
    //     Draws a single image outside of the render loop
    // --------------------------------
    r.DrawImage = function(strURL)
    {
        m_adhoc_image = new Image();
        m_adhoc_image.onload = function ()
        {
             var ctx = GetCanvas();
             if (ctx != null)
             {
                myGameArea.clear();
                ctx.drawImage(m_adhoc_image, 0, 0, GetCanvasWidth(), GetCanvasHeight());
             }
        };
        m_adhoc_image.src = strURL;
    };

    // --------------------------------
    // Render
    // --------------------------------
    r.Render = function()
    {
        var ctx = GetCanvas();
        if (ctx != null)
        {
            myGameArea.clear();
            if (m_bBackgroundLoaded) { ctx.drawImage(m_background, 0, 0, GetCanvasWidth(), GetCanvasHeight()); }
            RENDER.DrawForeground();
            RENDER.DrawEffects();
            DIALOG.DrawDialog();
            RENDER.DrawFade();
        }
    };

    return r;
  }());
