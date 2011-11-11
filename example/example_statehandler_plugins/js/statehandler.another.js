/**
 * @file
 * Defines another plugin for the statehandler. Less commenty, more codey.
 */

(function ($) {
  Drupal.behaviors.anotherStateHandlerPlugin = {
    attach: function (context, settings) {

      // add the plugin to the stateHandler js object, aliasing it to "plugin" for simplicity here...
      var plugin = settings.stateHandler.plugins['another'] = new StateHandlerPlugin();
      
      // This plugin will execute before the example plugin.
      plugin.weight = -10;

      /**
       * plugin.buildState will extend State with .another
       *  @param url: a url to derive a State object from.
       *  @param state: A State object that has been extended by other plugins.
       *  @return State: a modified State object containing plugin-specific data
       */
      plugin.buildState = function(State, url) {
        // Important: initialize the state Object if one doesn't already exist
        var State = State || {};

        // Set up the namespace for this plugin
        State.another = {};
        
        var randomdata = [
          {something: 'yeah', monkey:'banana', foo:'bar'},
          {car:'saab', color:'silver', engine: '2.0T'}
        ];
        
        // Tack on what you need to, and return the State when you're done.
        State.another.number = Math.sin(Math.random() * 360) * 360;
        State.another.complexData = {
          random: Math.random(),
          moreData: randomdata[ Math.floor(Math.random() * randomdata.length)]
        };

        // Pass off the extended/modified state object to other plugins for processing.
        return State;
      }
      
      /**
       * plugin.buildTitle builds (optionally overrides) a title from a state.
       * This will be used to update the page title in the browser.
       *  @param State: a State object
       *  @return Title: a string to be appended to the title for the state
       * Let's pretend that this plugin doesn't mess with the title at all.
       */
      /*
      plugin.buildTitle = function(State) {
        return "| another Plugin: " + State.another.randomData.toString();
      }
      */
      
      /**
       * plugin.processState will be the guts of your plugin.
       * This will define what to do with the state data that is sent to it.
       * This will be invoked on back + forward and direct access/refresh.
       *  @param State: a fully built state object for your application to use 
       *    (automatically populated by Statehandler and History.js).
       */
      plugin.processState = function(State, url) {
        // Initial page loads will not contain State data, so dont do anything.
        if(JSON.stringify(State) == "{}") {
          return;
        }

        /**
         * You'll probably want to do some ajax stuff in here, and render it in 
         * a specific/classy manner, but we'll just stringify it for now and 
         * display it in region-sidebar as an another.
         */ 
        $('.region-sidebar-first').fadeOut(function() {
          $(this).html("<p>" +JSON.stringify(State.another) + "<p>").fadeIn();
        });
      };

      /**
       * BEGIN jQuery EVENTS
       */
      // this plugin doesn't need to define any clickhandlers - it will be invoked by others.
      /**
       * END jQuery EVENTS
       */
    }
  };
}(jQuery));
