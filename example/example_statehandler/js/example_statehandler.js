/**
 * @file
 * Defines an example plugin for the statehandler.
 */
(function ($) {
  Drupal.behaviors.exampleStateHandlerPlugin = {
    attach: function (context, settings) {

      // add the plugin to the stateHandler js object, aliasing it to "plugin" for simplicity here...
      var plugin = settings.stateHandler.plugins['exampleStateHandlerPlugin'] = new stateHandlerPlugin();

      /**
       * plugin.processState will be the guts of your plugin.
       * This will define what to do with the state data that is sent to it.
       * This will be invoked on back + forward and direct access/refresh.
       *  @param State: a fully built state object for your application to use 
       *    (automatically populated by History.js).
       */
      plugin.processState = function(State) {
        // Initial page loads will not contain data, so dont do anything.
        if(JSON.stringify(State) == "{}")
        {
          return;
        }
        /**
         * You'll probably want to do some ajax stuff in here, and render it to
         *  the screen, but we'll just stringify it for now and display it in 
         * main content as an example.
         */ 
        $('#block-system-main .content').fadeOut(function(){
          $(this).html("<p>" +JSON.stringify(State) + "<p>").fadeIn();
        });
      };

      /**
       * plugin.buildState will build a state object from a URL. Other plugins 
       * may (will) access State before it is passed to History.
       *  @param url: a url to build a FULL state object from.
       *  @param state: A State object
       *  @return State: a modified (extended) State Object witht he data you need
       */
      plugin.buildState = function(State, url) {
        var State = State || {};
        // Tack on what you need to, and return the state when you're done.

        State.exampleData = url;
        State.randomData = Math.ceil( Math.random() * 1000 );

        // Pass off the extended/modified state object to other plugins for processing.
        return State;
      }
      
      /**
       * plugin.buildTitle builds a title from a state object.
       * This will update the page title in the browser.
       * for our example we return the randomData we set in buildState.
       *  @param State: a State object
       *  @return Title: a string to be sent to the title
       */
      plugin.buildTitle = function(State) {
        return "Random: " + State.randomData.toString();
      }
      
      
      /**
       * BEGIN TRIGGERS
       * Application State Triggers:
       * Set up your click handlers here... you may be interested in .live().
       * For our example, we will trigger state changes by links in the header
       */
 
      $("#header a").click(function(){
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
       * END TRIGGERS
       */
    }
  };
}(jQuery));