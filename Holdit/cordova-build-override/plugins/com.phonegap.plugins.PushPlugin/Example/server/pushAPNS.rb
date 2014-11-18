require 'rubygems'
require 'pushmeup'


APNS.host = 'gateway.sandbox.push.apple.com' 
APNS.port = 2195 
APNS.pem  = '/Users/mcoenca/Documents/Thnktwice/Code/Keys/ck.pem'
APNS.pass = 'cristohoger24'

device_token = '7d203af3d633addf9c86d678aac44d7dac2574ba6378e526830341049e521451'
# APNS.send_notification(device_token, 'Hello iPhone!' )
APNS.send_notification(device_token, :alert => 'PushPlugin works!!', :badge => 1, :sound => 'beep.wav')
