
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
      // Initialize the stateHandler settings object.
      settings.stateHandler = settings.stateHandler || {plugins: [] };
      settings.stateHandler.base = document.location.protocol + "//" + document.location.host;

      // Attach the history object to Drupal.
      settings.stateHandler.History = window.History;

      // Alias plugins for readability, and create a non-keyed array to sort.
      var plugins = settings.stateHandler.plugins || [],
      pluginsSorted = [];

      // Define pushState listener - Trigger all the plugins!
      settings.stateHandler.triggerChange = function() {
          var State = settings.stateHandler.History.getState(),
          url = State.url.replace(settings.stateHandler.base, "");

          // fire the state object to the plugins implementing a listener
          for (plugin in pluginsSorted ) {
            pluginsSorted[plugin].processState(State.data, url);
          }
      };

      /**
       * This function will invoke application state changes.
       * You should bind all interactions to trigger this function using
       * well-formed drupal paths for SEO and profit.
       *  @param url: the url of the state
       *  @param title: the title to "start with"
       */
      settings.stateHandler.pushState = function(url, title) {
        var State = {};
        title = title || "";
        pluginsSorted = [];

        // Resort the plugins in case weights have changed in realtime.
        for(plugin in plugins) {
          pluginsSorted.push(plugins[plugin]);
        }
  
        // Sort the plugins for execution based on weight
        pluginsSorted.sort(function(a, b) {
          return (a.weight > b.weight) - (a.weight < b.weight);
        });

        // Execute the plugins buildState and buildTite methods in order.
        for(plugin in pluginsSorted)
        {
          // Extend the state object with data from buildState.
          $.extend(State, pluginsSorted[plugin].buildState(State, url));

          // Tack on title info from each plugin from buildTitle.
          var pluginTitle = pluginsSorted[plugin].buildTitle(State, url);
          title = pluginTitle == null? title : title + " " + pluginTitle;
        }
        // Push the data to History for storage.
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
