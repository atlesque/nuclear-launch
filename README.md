# Nuclear Launch Button
1. Connect RP2040 to your computer via USB.
1. Flash the code in the `arduino` directory to the RP2040.
1. Quit the Arduino IDE if it is open, as it may interfere with the serial port.
1. Install npm dependencies: 
   ```bash
   npm install
   ```
1. Start the script:
   ```bash
    npm start
    ```
1. Turn the ignition key (D0) to the ON position.
1. Press the button (D1) to launch the nuclear missile (or your new feature).

## Schematic

### Device

Seeed Studio XIAO RP2040 - Raspberry Pi Pico RP2040 clone

Can be adapted for other devices if you change the pins.

### Inputs

* Switch 1 (D0 trigger)
   * Type: Key ignition switch
   * One side → GPIO pin D0
   * Other side → GND
* Switch 2 (D1 trigger)
   * Type: Emergency stop button
   * One side → GPIO pin D1
   * Other side → GND

