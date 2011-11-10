/**
 * @file
 * contains the main behavior for interfacing with history.js through plugins
 */
 
 /**
 * Defines the stateHandlerPlugin Class.
 * See method and example stateHandler plugin comments for explanation.
 */
function stateHandlerPlugin() {

  /**
   * plugin.buildState will build a state object from a URL. Other plugins 
   * may (will) access State before it is passed to History. This function
   * defines and extends the Application state data stored in history.
   *  @param url: a url to build a FULL state object from.
   *  @param state: A State object
   *  @return State: a modified (extended) State Object witht he data you need
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
   *    (automatically populated by History.js).
   */
  this.processState = function(State) {
    // Do something special... probably ajaxy.
  };

  /**
   * plugin.weight will be used to execute plugin hooks in a specific order.
   */
  this.weight = 0;
};

/**
 * Attach the drupal stateHandler behavior.
 */
(function ($) {
  Drupal.behaviors.stateHandler = {
    attach: function (context, settings) {
      settings.stateHandler = settings.stateHandler || {plugins: [] };
      var plugins = settings.stateHandler.plugins || [],
      pluginsSorted = [];
      
      for(plugin in plugins) {
        pluginsSorted.push(plugins[plugin]);
      }

      // Sort the plugins for execution based on weight
      pluginsSorted.sort(function(a, b) {
        return (a.weight > b.weight) - (a.weight < b.weight);
      });
      
      // attach the history object to Drupal
      settings.stateHandler.History = window.History;

      // Trigger all the plugins! (Trigger all the things!)
      settings.stateHandler.triggerChange = function() {
          var State = settings.stateHandler.History.getState();
          
          // fire the state object to the plugins implementing a listener
          for (plugin in pluginsSorted ) {
            pluginsSorted[plugin].processState(State.data);
          }
      };
      
      /**
       * This function will invoke application state changes.
       * You should bind all interactions to trigger this function using
       * well-formed drupal paths.
       *  @param url: the url of the state
       *  @param title: the title to "start with"
       */
      settings.stateHandler.pushState = function(url, title) {
        var State = {};
        title = title || "";
        
        for(plugin in pluginsSorted)
        {
          // Extend the state object with data from all the plugins, then fire stateChange
          $.extend(State, pluginsSorted[plugin].buildState(State, url));
          
          // Tack on title info from each plugin, or not depending...
          var pluginTitle = pluginsSorted[plugin].buildTitle(State, url);
          title = pluginTitle == null? title : title + " " + pluginTitle;
        }
        // trigger the application stateChange after all plugins have been executed
        Drupal.settings.stateHandler.History.pushState(State, title, url);
      };

      // Depending on history_js module implementation, determine how to invoke triggers
      switch (settings.stateHandler.history_js_implementation) {
        case 'jquery':
          $(window).bind('statechange', settings.stateHandler.triggerChange);
          break;
      
        case 'native':
          settings.stateHandler.History.Adapter.bind(window, 'statechange', settings.stateHandler.triggerChange);
          break;
      }

      // Initialize the app through plugin calls
      $(window).trigger('statechange');

    }
  };
}(jQuery));
