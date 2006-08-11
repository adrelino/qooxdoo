/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2006 by 1&1 Internet AG, Germany, http://www.1and1.org

   License:
     LGPL 2.1: http://www.gnu.org/licenses/lgpl.html

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)

************************************************************************ */

/* ************************************************************************

#require(qx.dom.DomEventRegistration)

************************************************************************ */

/*!
  This is the qooxdoo init process.
*/
qx.OO.defineClass("qx.core.Init", qx.core.Target,
function()
{
  qx.core.Target.call(this, false);

  // Object Wrapper to Events (Needed for DOM-Events)
  var o = this;
  this.__onload = function(e) { return o._onload(e); }
  this.__onbeforeunload = function(e) { return o._onbeforeunload(e); }
  this.__onunload = function(e) { return o._onunload(e); }

  // Attach events
  qx.dom.DomEventRegistration.addEventListener(window, "load", this.__onload);
  qx.dom.DomEventRegistration.addEventListener(window, "beforeunload", this.__onbeforeunload);
  qx.dom.DomEventRegistration.addEventListener(window, "unload", this.__onunload);
});



/*
---------------------------------------------------------------------------
  DEFAULT SETTINGS
---------------------------------------------------------------------------
*/

qx.Settings.setDefault("component", "qx.component.init.InterfaceInitComponent");






/*
---------------------------------------------------------------------------
  PROPERTIES
---------------------------------------------------------------------------
*/

qx.OO.addProperty({ name : "component", type : qx.constant.Type.OBJECT, instance : "qx.component.init.BasicInitComponent" });






/*
---------------------------------------------------------------------------
  COMPONENT MANAGMENT
---------------------------------------------------------------------------
*/

qx.Proto._createComponent = function()
{
  var vComponentName = this.getSetting("component");

  this.info("Init: " + vComponentName.substring(vComponentName.lastIndexOf(qx.constant.Core.DOT)+1));
  this.setComponent(new qx.OO.classes[vComponentName](this));
}





/*
---------------------------------------------------------------------------
  COMPONENT BINDING
---------------------------------------------------------------------------
*/

qx.Proto._initialize = null;
qx.Proto._main = null;
qx.Proto._finalize = null;
qx.Proto._close = null;
qx.Proto._terminate = null;

qx.Proto.defineInitialize = function(vFunc) {
  return this._initialize = vFunc || null;
}

qx.Proto.defineMain = function(vFunc) {
  return this._main = vFunc || null;
}

qx.Proto.defineFinalize = function(vFunc) {
  return this._finalize = vFunc || null;
}

qx.Proto.defineClose = function(vFunc) {
  return this._close = vFunc || null;
}

qx.Proto.defineTerminate = function(vFunc) {
  return this._terminate = vFunc || null;
}








/*
---------------------------------------------------------------------------
  MODIFIER
---------------------------------------------------------------------------
*/

qx.Proto._modifyComponent = function(propValue, propOldValue, propData)
{
  if (propOldValue)
  {
    propOldValue.defineInitialize(null);
    propOldValue.defineMain(null);
    propOldValue.defineFinalize(null);
    propOldValue.defineClose(null);
    propOldValue.defineTerminate(null);
  }

  if (propValue)
  {
    propValue.defineInitialize(this._initialize);
    propValue.defineMain(this._main);
    propValue.defineFinalize(this._finalize);
    propValue.defineClose(this._close);
    propValue.defineTerminate(this._terminate);
  }

  return true;
}







/*
---------------------------------------------------------------------------
  EVENT HANDLER
---------------------------------------------------------------------------
*/

qx.Proto._onload = function(e)
{
  // Print out class informations
  this.info("Loaded " + qx.lang.Object.getLength(qx.OO.classes) + " classes.");

  // Init component from settings
  this._createComponent();

  // Create singletons
  qx.manager.object.SingletonManager.flush();

  // Send onload
  return this.getComponent()._onload(e);
}

qx.Proto._onbeforeunload = function(e)
{
  // Send onbeforeunload event (can be cancelled)
  return this.getComponent()._onbeforeunload(e);
}

qx.Proto._onunload = function(e)
{
  // Send onunload event (last event)
  this.getComponent()._onunload(e);

  // Dispose all qooxdoo objects
  qx.core.Object.dispose();
}







/*
---------------------------------------------------------------------------
  DISPOSER
---------------------------------------------------------------------------
*/

qx.Proto.dispose = function()
{
  if (this.getDisposed()) {
    return;
  }

  // Detach Events
  qx.dom.DomEventRegistration.removeEventListener(window, "load", this.__onload);
  qx.dom.DomEventRegistration.removeEventListener(window, "beforeunload", this.__onbeforeunload);
  qx.dom.DomEventRegistration.removeEventListener(window, "unload", this.__onunload);

  // Reset inline functions
  this.__onload = this.__onbeforeunload = this.__onunload = null;

  // Dispose Component
  if (this._component)
  {
    this._component.dispose();
    this._component = null;
  }

  qx.core.Target.prototype.dispose.call(this);
}




/*
---------------------------------------------------------------------------
  DIRECT SINGLETON INSTANCE
---------------------------------------------------------------------------
*/

qx.core.Init = new qx.core.Init;
