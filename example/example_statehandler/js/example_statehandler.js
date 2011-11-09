/**
 * @file
 * Defines an example plugin for the statehandler.
 */
(function ($) {
  Drupal.behaviors.exampleStateHandlerPlugin = {
    attach: function (context, settings) {
      settings.stateHandler = settings.stateHandler || {plugins:{} };

      // add the plugin to the stateHandler js object
      var plugin = settings.stateHandler.plugins.examplePlugin = {};
      
      /**
       * plugin.processState will be the guts of your plugin.
       * This will define what to do with the state data that is sent to it.
       * This will be envoked on back + forward and direct access/refresh.
       *  @param State: a fully built state object for your application to use 
       *    (automatically populated by History.js).
       */
      plugin.processState = function(State) {
        // Initial page loads will not contain data, so dont do anything.
        if(JSON.stringify(State) == "{}")
        {
          return;
        }
        // You'll probably want to do some ajax stuff in here, and render it to the screen, but we'll just stringify it for now
        $('#block-system-main .content').fadeOut(function(){
          $(this).html("<p>" +JSON.stringify(State) + "<p>").fadeIn();
        });
      };

      /**
       * plugin.buildState will build a state object from a URL.
       *  @param url: a url to build a FULL state object from.
       */
      plugin.buildState = function(url) {
        var State = {};
        State.exampleData = url;
        State.randomData = Math.random() * 1000; 
        return State;
      }
      
      /**
       * plugin.buildTitle builds a title from a state object.
       * This will update the page title in the browser.
       * for our example we assume title will not be changed.
       *  @param State: a State object
       */
      plugin.buildTitle = function(State) {
        return null;
      }
      
      /**
       * This function will invoke application state changes.
       * You should bind all interactions to trigger this function using
       * well-formed drupal paths.
       *  @param url: the url of the state
       */
      plugin.pushState = function(url) {
        var State = plugin.buildState(url);
        var title = plugin.buildTitle(State);
        
        /**
         * Define these arguments above, and call pushState with them.
         * For this function, Do not modify past this line.
         * Invokes History.js pushState to save a state to history.
         */
        Drupal.settings.stateHandler.History.pushState(State, title, url);
      }
      
      /**
       * BEGIN TRIGGERS
       * Application State Triggers:
       * Set up your click handlers here... you may be interested in .live().
       * For our example, we will trigger state changes by links in the header
       */


      $("#header a").click(function(){
        // read in a property to push to the application... this should be based on a real URL
        
        var url = $(this).attr('href') + Math.ceil(Math.random() * 10);
        // uncomment the next line to see how it really SHOULD be used.
        // url = $(this).attr('href'));
        
        // Important: all click handlers must call plugin.pushState, and return false
        plugin.pushState(url);
        return false;
      });




      /**
       * END TRIGGERS
       */
    }
  };
}(jQuery));