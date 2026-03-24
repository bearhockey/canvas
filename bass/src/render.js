var RENDER = (function () {
    // consts
    const FADE_DELTA = 0.05;
    const BORDER_WIDTH = 4;
    const BORDER_GRADIENT_TOP = "#EEEEEE";
    const BORDER_GRADIENT_BOTTOM = "#AAAAAA";
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
    // DrawRoundedBox
    //      Draws a rounded box with a border and gradiant background
    // --------------------------------
    r.DrawRoundedBox = function(arr_bounds, box_gradient, line_width=BORDER_WIDTH, border_radius=8)
    {
        var ctx = GetCanvas();
        if (ctx != null && arr_bounds.length > 3)
        {
            ctx.fillStyle = box_gradient;
            ctx.fillRect(arr_bounds[0], arr_bounds[1], arr_bounds[2], arr_bounds[3]);

            const line_gradient = ctx.createLinearGradient(arr_bounds[0], arr_bounds[1], arr_bounds[0]+arr_bounds[2], arr_bounds[1]+arr_bounds[3]);
            line_gradient.addColorStop(0, BORDER_GRADIENT_TOP); // Start
            line_gradient.addColorStop(1, BORDER_GRADIENT_BOTTOM);  // End

            ctx.beginPath();
            ctx.lineWidth = line_width;
            ctx.strokeStyle = line_gradient;
            ctx.roundRect(arr_bounds[0], arr_bounds[1], arr_bounds[2], arr_bounds[3], border_radius);
            ctx.stroke();
        }
    };

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
        RENDER.ClearBackground();
        m_background = new Image();
        m_background.onload = function () { m_bBackgroundLoaded = true; RENDER.CheckPreview(); };
        m_background.src = strURL;
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
    // ClearBackground
    // --------------------------------
    r.ClearBackground = function()
    {
        m_bBackgroundLoaded = false;
        m_background = null;
    };

    // --------------------------------
    // ClearForeground
    // --------------------------------
    r.ClearForeground = function(bRedraw=true)
    {
        if (InEditMode())
        {
            m_bForegroundLoaded = false;
            m_foreground = null;
            if (bRedraw == true) { RENDER.Render(); }
        }
        else
        {
            m_fForegroundAlphaTarget = 0.0;
        }
    };

    // --------------------------------
    // ClearEffects
    // --------------------------------
    r.ClearEffects = function()
    {
        if (InEditMode())
        {
            m_bEffectsLoaded = false;
            m_effects = null;
        }
        else
        {
            m_fEffectsAlphaTarget = 0.0;
        }
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
            let bInEditMode = InEditMode();
            if (bInEditMode == true) { m_fForegroundAlpha = m_fForegroundAlphaTarget = 1.0; }
            else if (m_fForegroundAlpha < m_fForegroundAlphaTarget) { m_fForegroundAlpha += FADE_DELTA; }
            else if (m_fForegroundAlpha > m_fForegroundAlphaTarget) { m_fForegroundAlpha -= FADE_DELTA; }

            if (m_fForegroundAlpha <= 0.0 && m_foreground != null)
            {
                m_foreground = null;
                m_bForegroundLoaded = false;
            }
            else
            {
                let fAdjustedWidth = (bInEditMode) ? m_fForegroundWidth/2 : m_fForegroundWidth;
                let fAdjustedHeight = (bInEditMode) ? m_fForegroundHeight/2 : m_fForegroundHeight;
                let x_pos = GetCanvasWidth()/2 - fAdjustedWidth/2;
                let y_pos = GetCanvasHeight() - fAdjustedHeight;
                ctx.globalAlpha = m_fForegroundAlpha;
                ctx.drawImage(m_foreground, x_pos, y_pos, fAdjustedWidth, fAdjustedHeight);
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
