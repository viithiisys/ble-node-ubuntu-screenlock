var app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    bleno = require('bleno');
    exec = require('child_process').exec;

// Start advertising iBeacon
var uuid = '38a48d7e-05ab-11e7-93ae-92361f002671';
var major = 10; // 0x0000 - 0xffff
var minor = 5; // 0x0000 - 0xffff
var measuredPower = -59 // -128 - 127

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);
  if (state === 'poweredOn') {
    bleno.startAdvertisingIBeacon(uuid, major, minor, measuredPower);
  } else {
    bleno.stopAdvertising();
  }
});

// Create websocket
io.on('connection', (socket) => {
  console.log('user connected');
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('status', (data) => {
    console.log(data); 
    if (data == "lock" || data == "unlock") {
      // Executing bash file for lock and unlock
      exec(__dirname + '/unlock.sh ' + data, function(error, stdout, stderr) {
        var out = error ? stderr : stdout;
        socket.emit('result', data)
        console.log(out);
      });
    } else {
      console.log("Please pass correct input ", data);
    } 
  });
  
});

http.listen(5000, () => {
  console.log('started on port 5000');
});
