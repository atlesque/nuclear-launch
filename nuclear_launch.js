const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const player = require('play-sound')({});

const port = new SerialPort({ path: '/dev/cu.usbmodem1101', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

let d0Player = null;
let d1Player = null;
let celebrationPlayer = null;
let celebrationTimeout = null;

function cancelCelebration(reason) {
  if (celebrationTimeout) {
    clearTimeout(celebrationTimeout);
    celebrationTimeout = null;
    console.log(`Celebration timer canceled: ${reason}`);
  }

  if (celebrationPlayer) {
    celebrationPlayer.kill();
    celebrationPlayer = null;
    console.log('Celebration stopped');
  }
}

parser.on('data', (line) => {
  line = line.trim();
  console.log('Serial:', line);

  if (line.includes('D0: OPEN')) {
    if (!d0Player) {
      d0Player = player.play('./countdown.mp3', (err) => {
        if (err && !err.killed) console.error('D0 play error:', err);
        d0Player = null;
      });
    }

    // Check if D1 is already open and should trigger celebration timer
    if (d1Player && !celebrationTimeout && !celebrationPlayer) {
      console.log('Both playing. Starting celebration timer...');
      celebrationTimeout = setTimeout(() => {
        if (d0Player && d1Player) {
          console.log('Playing celebration.mp3');
          celebrationPlayer = player.play('./celebration.mp3', (err) => {
            if (err && !err.killed) console.error('Celebration play error:', err);
            celebrationPlayer = null;
          });
        }
        celebrationTimeout = null;
      }, 5000);
    }
  }

  if (line.includes('D0: CLOSED')) {
    if (d0Player) {
      d0Player.kill();
      d0Player = null;
    }
    cancelCelebration('D0 closed');

    // Also stop D1 if it was dependent on D0
    if (d1Player) {
      d1Player.kill();
      d1Player = null;
    }
  }

  if (line.includes('D1: OPEN')) {
    if (!d1Player && d0Player) {
      d1Player = player.play('./bomb.mp3', (err) => {
        if (err && !err.killed) console.error('D1 play error:', err);
        d1Player = null;
      });

      if (!celebrationTimeout && !celebrationPlayer) {
        console.log('Both playing. Starting celebration timer...');
        celebrationTimeout = setTimeout(() => {
          if (d0Player && d1Player) {
            console.log('Playing celebration.mp3');
            celebrationPlayer = player.play('./celebration.mp3', (err) => {
              if (err && !err.killed) console.error('Celebration play error:', err);
              celebrationPlayer = null;
            });
          }
          celebrationTimeout = null;
        }, 5000);
      }
    } else if (!d0Player) {
      console.log('D1 ignored because D0 is not open');
    }
  }

  if (line.includes('D1: CLOSED')) {
    if (d1Player) {
      d1Player.kill();
      d1Player = null;
    }
    cancelCelebration('D1 closed');
  }
});