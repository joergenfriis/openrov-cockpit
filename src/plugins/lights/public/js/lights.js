(function(window) {
  'use strict';
  var plugins = namespace('plugins');
  plugins.Lights = function(cockpit) {
    var self = this;
    self.cockpit = cockpit;

  };

  plugins.Lights.prototype.getTelemetryDefintions = function getTelemetryDefintions() {
    return([{name: 'LIGP', description: 'Internal lights percent of power'}]);
  }

  plugins.Lights.prototype.inputDefaults = function inputDefaults() {
    return [
      // lights increment
      {
        name: 'plugin.lights.adjust_increment',
        description: 'Makes the ROV lights brighter.',
        defaults: { keyboard: 'p', gamepad: 'DPAD_UP' },
        down: function () {
          cockpit.rov.emit('plugin.lights.adjust', 0.1);
        }
      },

      // lights decrement
      {
        name: 'plugin.lights.adjust_increment',
        description: 'Makes the ROV lights dimmer.',
        defaults: { keyboard: 'o', gamepad: 'DPAD_DOWN' },

        down: function () {
          cockpit.rov.emit('plugin.lights.adjust', -0.1);
        }
      },

      // lights toggle
      {
        name: 'plugin.lights.toggle',
        description: 'Toggles the ROV lights on/off.',
        defaults: { keyboard: 'i' },
        down: function () {
          cockpit.rov.emit('plugin.lights.toggle');
        }
      }
    ]

  };

  //This pattern will hook events in the cockpit and pull them all back
  //so that the reference to this instance is available for further processing
  plugins.Lights.prototype.listen = function listen() {
    var self = this;

    self.cockpit.rov.withHistory.on('plugin.lights.state', function(state) {
      self.cockpit.emit('plugin.lights.state',state);
    });

    self.cockpit.on('plugin.lights.set',function(value){
        cockpit.rov.emit('plugin.lights.set',value);
    });

  };

  window.Cockpit.plugins.push(plugins.Lights);

})(window);
