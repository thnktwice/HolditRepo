/*
  ChillCount
 
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

volatile int clicked = 0; // variable to store the click event

long message = 3;

int message_timer_running = 0;
unsigned long message_timer; // variable for the timeout timer
unsigned long message_timeout = 3000UL; // timeout set to 3 seconds

int led_timer_running = 0; //variable to declare if the timer is running
unsigned long led_timer; //variable for the led timer
unsigned long led_timeout = 700UL;  //led timeout set to 07 sec

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

 if (clicked == 1) {//if change interrupt has been detected, send a scratch message
    //Write to scratch one
    Bean.setScratchNumber(1,message); 
    
    //Set timer
    message_timer = millis();
    message_timer_running = 1;

    //go to next step
    clicked = 2;
 }
 
 if (clicked == 2) {
   // Read scratch 2 until we detect a feedback or we timeOut
   scratchState = Bean.readScratchNumber(2);
   if(scratchState != 0) {//if a write event has been detected
     if(scratchState == 1) {//if writed 1 color in blue
       Bean.setLedBlue(255);
     }
     if(scratchState == 2) {//2 in white rose
       Bean.setLed(55,100,255);
     }
     if(scratchState == 3) {//3 in green
       Bean.setLedGreen(255);
     }
     if(scratchState == 4) {//4 in red
       Bean.setLedRed(255);
     }
     //Launch the timer
     led_timer = millis();
     led_timer_running = 1;
     //Reset the variables
     scratchState = 0;
     Bean.setScratchNumber(2,0);
     //Stop the first timer
     message_timer_running = 0;
     //go to next step
     clicked = 3;
   }
 }
 
 if ((int)(clicked + led_timer_running) == 4) {
   //little hack to simplify the if..
   //but in fact it is not needed 
   //and clicked == 3 only should be ok but it is more clear that way
   if ((long)(millis()-led_timer >= led_timeout)) {
     //After the led timeout, shut down the led
     Bean.setLed(0,0,0);
     //reset the vars
     clicked = 0;
     //clear the timer
     led_timer_running = 0;
     //Go to bed
     Bean.sleep(MAX_BEAN_SLEEP);
   }
 }
 
 if (message_timer_running == 1) {
   if ((long)(millis()-message_timer) >= message_timeout) {
     //The send message has gotten no feedback under 30 seconds
     //reset vars
     clicked = 0;
     message_timer_running = 0;
     
     //Blink led
     Bean.setLedRed(255);
     delay(50);
     Bean.setLed(0,0,0);
     delay(100);
     Bean.setLedRed(255);
     delay(50);
    //Reset Led
     Bean.setLed(0,0,0);
     //Go to bed
     Bean.sleep(MAX_BEAN_SLEEP);
   }
 }
}
 
// ISR needs to return void and accept no arguments
// writeScratch set to 1 the variable that will then send the ble message in the main loop
void writeScratch()
{
   //We read the digital pin value 
   buttonState = digitalRead(buttonPin);
   
  //check if the pushbutton is pressed (buttonState is HIGH):
  if (buttonState == HIGH){
    clicked = 1;
  }
}
