/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2007 1&1 Internet AG, Germany, http://www.1and1.org

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)

************************************************************************ */

/* ************************************************************************

#module(html2)

************************************************************************ */

qx.Class.define("qx.html2.element.Opacity",
{
  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */
  
  statics :
  {
    /**
     * Sets opacity of given element. Accepts numbers between zero and one
     * where "0" means transparent, "1" means opaque.
     *
     * @type static
     * @param el {Element} DOM element to modify
     * @param opacity {Float} A float number between 0 and 1
     * @return {void}
     * @signature function(el, opacity)
     */
    setOpacity : qx.core.Variant.select("qx.client",
    {
      "mshtml" : function(el, opacity)
      {
        // Read in computed filter
        var filter = this.getStyle(el, "filter");

        // Remove opacity filter
        if (opacity >= 1)
        {
          el.style.filter = filter.replace(/alpha\([^\)]*\)/gi, "");
          return;
        }

        if (opacity < 0.00001) {
          opacity = 0;
        }

        // IE has trouble with opacity if it does not have layout (hasLayout)
        // Force it by setting the zoom level
        if (!el.currentStyle.hasLayout) {
          this.setStyle(el, "zoom", 1);
        }

        // Remove old alpha filter and add new one
        el.style.filter = filter.replace(/alpha\([^\)]*\)/gi, "") +
          "alpha(opacity=" + opacity * 100 + ")";;
      },

      "gecko" : function(el, opacity)
      {
        // Animations look better when not using 1.0 in gecko
        if (opacity == 1) {
          opacity = 0.999999;
        }

        if (qx.html2.client.Engine.VERSION < 1.7) {
          el.style.MozOpacity = opacity;
        } else {
          el.style.opacity = opacity;
        }
      },
      
      "default" : function(el, opacity)
      {
        if (opacity == 1) {
          opacity = "";
        }

        el.style.opacity = opacity;
      }
    }),


    /**
     * Gets opacity of given element. Accepts numbers between zero and one
     * where "0" means transparent, "1" means opaque.
     *
     * @type static
     * @param el {Element} DOM element to modify
     * @return {Float} A float number between 0 and 1
     * @signature function(el)
     */
    getOpacity : qx.core.Variant.select("qx.client",
    {
      "mshtml" : function(el)
      {
        var filter = this.getStyle(el, "filter");

        if (filter)
        {
          var opacity = filter.match(/alpha\(opacity=(.*)\)/);

          if (opacity && opacity[1]) {
            return parseFloat(opacity[1]) / 100;
          }
        }

        return 1.0;
      },

      "gecko" : function(el)
      {
        var opacity = this.getStyle(el, qx.html2.client.Engine.VERSION < 1.7 ? "MozOpacity" : "opacity");

        if (opacity == 0.999999) {
          opacity = 1.0;
        }

        if (opacity != null) {
          return parseFloat(opacity);
        }

        return 1.0;
      },

      "default" : function(el)
      {
        var opacity = this.getStyle(el, "opacity");

        if (opacity != null) {
          return parseFloat(opacity);
        }

        return 1.0;
      }
    })
  }
});
