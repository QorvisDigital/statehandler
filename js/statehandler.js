/**
 * @file
 * contains the main behavior for interfacing with history.js through plugins
 */
(function ($) {
  Drupal.behaviors.stateHandler = {
    attach: function (context, settings) {
      settings.stateHandler = settings.stateHandler || {plugins: {} };
      
      // attach the history object to Drupal
      settings.stateHandler.History = window.History;

      // Trigger all the plugins! (Trigger all the things!)
      settings.stateHandler.triggerChange = function() {
          var State = settings.stateHandler.History.getState();
          // fire the state object to the plugins implementing a listener
          for (plugin in settings.stateHandler.plugins ) {
            settings.stateHandler.plugins[plugin].processState(State.data);
          }
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