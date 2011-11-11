 
 /**
 * @file Defines the stateHandlerPlugin Class.
 * See method and example StateHandler plugin comments for explanation.
 */
function StateHandlerPlugin() {

  /**
   * plugin.weight will be used to execute plugin hooks in a specific order.
   */
  this.weight = 0;

  /**
   * plugin.buildState will build a state object from a URL. Other plugins 
   * may (will) access State before it is passed to History. This function
   * defines and extends the Application state data stored in history.
   *  @return State: a modified (extended) State Object witht he data you need
   *  @param url: a url to build a FULL state object from.
   */
  this.buildState = function(State, url) {
    return State;
  };

  /**
   * plugin.buildTitle builds a title from a state object.
   * This will update the page title in the browser.
   * for our example we assume title will not be changed.
   *  @param State: a State object
   *  @return Title: a string to be appended to the <title> of the page
   */
  this.buildTitle = function(State) {
    var Title = null;
    return Title;
  };

  /**
   * plugin.processState will be the guts of plugins.
   * This will define what an application does (reaction) with given state data
   * This will be invoked on back + forward and direct access/refresh. All 
   * animations and ajax calls should live here.
   *  @param State: a fully built state object for your application to use 
   *  @param url: the path of the current application state, useful for
   *    determining if your plugin should act on this state.
   *    (automatically populated by History.js).
   */
  this.processState = function(State, url) {
    // Do something special... probably ajaxy.
  };

};
