(function() {
  var DISABLED = 'DISABLED';

  var ROVPilotWire = function ROVPilotWire(deps) {
    console.log('The rovpilot plugin.');
    var self = this;
    self.SAMPLE_PERIOD = 1000 / deps.config.sample_freq;

    self.rov = deps.rov;
    self.state = {depth:{enabled:false, targetDepth:0},
                  heading: {enabled:false, targetHeading:0}}


    deps.cockpit.on('plugin.rovpilot.depthHold.set', function (value) {
      //TODO: Tunnel the off/on up through the arduino code
      if ('enabled' in value){
        if (value.enabled===true){
          deps.rov.send('holdDepth_on()');
        } else {
          deps.rov.send('holdDepth_off()');
        }
      }
      if ('targetDepth' in value){
        deps.rov.send('holdDepth('+value.targetDepth+')')
      }
    });

    deps.cockpit.on('plugin.rovpilot.headingHold.set', function (value) {
      //TODO: Tunnel the off/on up through the arduino code
      if ('enabled' in value){
        if (value.enabled===true){
          deps.rov.send('holdHeading_on()');
        } else {
          deps.rov.send('holdHeading_off()');
        }
      }
      if ('targetHeading' in value){
        deps.rov.send('holdHeading('+value.targetHeading+')')
      }
    });

    // Arduino
    deps.rov.on('status', function (status) {
      if ('targetDepth' in status) {
        self.state.depth.enabled = status.targetDepth != DISABLED;
        self.state.depth.targetDepth = Number(status.targetDepth)/100;
        deps.cockpit.emit('plugin.rovpilot.depthHold.state',self.state.depth);
      }
      if ('targetHeading' in status) {
        self.state.heading.enabled = status.targetHeading != DISABLED;
        self.state.heading.targetHeading = Number(status.targetHeading);
        deps.cockpit.emit('plugin.rovpilot.headingHold.state',self.state.heading);
      }
    });

    return this;
  };

  module.exports = function (name, deps) {
    return new ROVPilotWire(deps);
  };

})();
