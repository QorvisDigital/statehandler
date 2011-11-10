/**
 * @file
 * Defines an example plugin for the statehandler.
 */

(function ($) {
  Drupal.behaviors.exampleStateHandlerPlugin = {
    attach: function (context, settings) {

      // add the plugin to the stateHandler js object, aliasing it to "plugin" for simplicity here...
      var plugin = settings.stateHandler.plugins['exampleStateHandlerPlugin'] = new StateHandlerPlugin();

      /* Add // at the beginning of this line to enable a second plugin example
      var plugin2 = settings.stateHandler.plugins['two'] = new StateHandlerPlugin();
      plugin2.weight =-99; // Set the weight... lower is executed first
      plugin2.buildState = function(State){var State = State || {}; State.lol = 1; return State};
      plugin2.buildTitle = function(State){return "| Plugin 2: lol"};
      //*/

      /**
       * plugin.processState will be the guts of your plugin.
       * This will define what to do with the state data that is sent to it.
       * This will be invoked on back + forward and direct access/refresh.
       *  @param State: a fully built state object for your application to use 
       *    (automatically populated by History.js).
       */
      plugin.processState = function(State) {
        // Initial page loads will not contain data, so dont do anything.
        if(JSON.stringify(State) == "{}") {
          return;
        }

        /**
         * You'll probably want to do some ajax stuff in here, and render it in 
         * a specific/classy manner, but we'll just stringify it for now and 
         * display it in main content as an example.
         */ 
        $('#block-system-main .content').fadeOut(function() {
          $(this).html("<p>" +JSON.stringify(State) + "<p>").fadeIn();
        });
      };

      /**
       * plugin.buildState will build a state object from a URL. Other plugins 
       * may (will) access State before it is passed to History. Order of
       * operations is dictated by plugin weight.
       *  @param url: a url to derive a State object from.
       *  @param state: A State object that has been extended by other plugins.
       *  @return State: a modified State object with the data you need.
       */
      plugin.buildState = function(State, url) {
        var State = State || {};
        // Tack on what you need to, and return the State when you're done.

        State.exampleData = url;
        State.randomData = Math.ceil( Math.random() * 1000 );

        // Pass off the extended/modified state object to other plugins for processing.
        return State;
      }
      
      /**
       * plugin.buildTitle builds (optionally overrides) a title from a state.
       * This will be used to update the page title in the browser.
       * For our example we return the randomData we set in buildState.
       * Order of operations is dictated by plugin weight.
       * Return null if your plugin shouldn't modify the title, alternatively,
       * use the default implementation of the Class by deleting this method assignment.
       *  @param State: a State object
       *  @return Title: a string to be appended to the title for the state
       */
      plugin.buildTitle = function(State) {
        return "| Example Plugin: " + State.randomData.toString();
      }
      
      
      /**
       * BEGIN jQuery EVENTS
       * Application State Triggers:
       * Set up your click handlers here... you may be interested in .live().
       * For our example, we will trigger state changes by links in the header
       */
 
      $("#header a").click(function() {
        /*
         * this implementation creates a random URL for demonstration purposes
         */
        var url = $(this).attr('href') + Math.ceil(Math.random() * 100),
        title = $(this).attr('title');
        /**
         * Important: all click handlers must call settings.stateHandler.pushState,
         * and return false if the matched element is a link (it should be).
         * uncomment the next line to see how it really SHOULD be used.
         */
        // url = $(this).attr('href'));
        settings.stateHandler.pushState(url, title);
        return false;
      });

      /**
       * END jQuery EVENTS
       */
    }
  };
}(jQuery));
