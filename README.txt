The statehandler module acts as an interface between History.js and Drupal to
allow easy creation of ajax-enabled Drupal sites that support forward and back
buttons, refreshing and direct linking to application states.

By utilizing the history_js module: http://drupal.org/project/history_js, it
provides a common plugin standard which automatically takes into account options
set in the configuration of history_js.

Assuming you have a complete site built out ( urls,etc.), It provides an example 
plugin that you can easily modify to buils a progressively enhanced site.

To create your own plugin, copy example_statehandler from /example to your
modules directory. Rename the files, function names, and variable names 
accordingly to reflect the name of your submodule:
  all file names:         replace example_ with your_plugin_name_
  .module file contents:  replace example_ with your_plugin_name_
  .info file contents:    use common sense
  
Pay close attention to the comments.
