/*
  Tilt
 
Send log if button is pressed
 
 
 The circuit:
 * pushbutton attached to pin 5 from +3V
 * resistor attach to pin 5 from ground
 
 created 2014
 by Tom Baz
 
 */

const int buttonPin = 5;     // the number of the pushbutton pin

int buttonState = 1;// variable for reading the pushbutton status
long scratchState; //variable for reading the scratch write

const int MAX_BEAN_SLEEP = 4200000000; //maximal time of sleep

volatile int clicked = 0;

void setup() {
  // initialize Serial connection
  Serial.begin(57600);     
  // initialize the pushbutton pin as an input:
  pinMode(buttonPin, INPUT);   
  
  // run writescratch when input change on buttonPin
  Bean.attachChangeInterrupt(buttonPin,writeScratch);
  
}

void loop()
{

 if (clicked == 1) {
    uint8_t buffer[2];
    uint16_t an0 = analogRead(8);
  
    buffer[0] = an0 & 0xFF;
    buffer[1] = an0 >> 8;
    Bean.setScratchData(1, buffer, 2); 
    clicked = 2;
 }
 
 if (clicked == 2) {
   // Bean.setLed(0,255,0);
   // delay(500);
   scratchState = Bean.readScratchNumber(2);
   if (scratchState == 2) {
     Bean.setLed(55,100,255);
     scratchState = 0;
     Bean.setScratchNumber(2,5);
     clicked = 3;
   }
   if (scratchState == 3) {
     Bean.setLedGreen(255);
     scratchState = 0;
     Bean.setScratchNumber(2,5);
     clicked = 3;
   }
   if (scratchState == 1) {
     Bean.setLedBlue(255);
     scratchState = 0;
     Bean.setScratchNumber(2,5);
     clicked = 3;
   }
 }
 
 if (clicked == 3) {
   delay(1000);
   Bean.setLed(0,0,0);
   clicked = 0;
   Bean.sleep(MAX_BEAN_SLEEP);
 }
 
 
}
 
// ISR needs to return void and accept no arguments
// writeScratch send BLE message
void writeScratch()
{
    
   buttonState = digitalRead(buttonPin);
   
  //check if the pushbutton is pressed (buttonState is HIGH):
  if (buttonState == HIGH){
    clicked = 1;
  }
}
