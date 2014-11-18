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
const int MAX_BEAN_SLEEP = 4200000000; //maximal time of sleep

void setup() {
  // initialize Serial connection
  Serial.begin(57600);     
  // initialize the pushbutton pin as an input:
  pinMode(buttonPin, INPUT);     
}

void loop()
{
  // run writescratch when input change on buttonPin
  Bean.attachChangeInterrupt(buttonPin,writeScratch);
 
  Bean.sleep(MAX_BEAN_SLEEP);
}
 
// ISR needs to return void and accept no arguments
// writeScratch send BLE message
void writeScratch()
{
    
   buttonState = digitalRead(buttonPin);

  //check if the pushbutton is pressed (buttonState is HIGH):
  
  if (buttonState == HIGH){
    
    uint8_t buffer[2];
    uint16_t an0 = analogRead(8);
  
    buffer[0] = an0 & 0xFF;
    buffer[1] = an0 >> 8;
  
    Bean.setScratchData(1, buffer, 2); 
  }
   
}
