#include <Keyboard.h>

const int pinD0 = D0;
const int pinD1 = D1;

bool enterSent = false;
bool prevD0 = HIGH;
bool prevD1 = HIGH;

void setup() {
  pinMode(pinD0, INPUT_PULLUP);
  pinMode(pinD1, INPUT_PULLUP);
  Serial.begin(9600);
  Keyboard.begin();
}

void loop() {
  bool currD0 = digitalRead(pinD0);
  bool currD1 = digitalRead(pinD1);

  if (currD0 != prevD0) {
    Serial.print("D0: ");
    Serial.println(currD0 == LOW ? "CLOSED" : "OPEN");
    prevD0 = currD0;
  }

  if (currD1 != prevD1) {
    Serial.print("D1: ");
    Serial.println(currD1 == LOW ? "CLOSED" : "OPEN");
    prevD1 = currD1;
  }

  // Condition: both D0 and D1 are OPEN (HIGH)
  if (currD0 == HIGH && currD1 == HIGH) {
    if (!enterSent) {
      Serial.println("Both switches open. Sending ENTER.");
      Keyboard.press(KEY_RETURN);
      delay(5);
      Keyboard.release(KEY_RETURN);
      enterSent = true;
    }
  } else {
    if (enterSent) {
      Serial.println("Switches changed. Ready for next press.");
    }
    enterSent = false;
  }

  delay(10);
}