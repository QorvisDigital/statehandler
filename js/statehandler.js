
/**
 * @file
 * contains the main behavior for interfacing with history.js through plugins
 */

/**
 * Attach the drupal stateHandler behavior.
 */
(function ($) {
  Drupal.behaviors.stateHandler = {
    attach: function (context, settings) {
      settings.stateHandler = settings.stateHandler || {plugins: [] };
      var plugins = settings.stateHandler.plugins || [],
      pluginsSorted = [];

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
        pluginsSorted = [];
        
        // Resort the plugins in case weights have changed.
        for(plugin in plugins) {
          pluginsSorted.push(plugins[plugin]);
        }
  
        // Sort the plugins for execution based on weight
        pluginsSorted.sort(function(a, b) {
          return (a.weight > b.weight) - (a.weight < b.weight);
        });

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
