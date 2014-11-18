require 'rubygems'
require 'pushmeup'
GCM.host = 'https://android.googleapis.com/gcm/send'
GCM.format = :json
GCM.key = "AIzaSyCZL1dvqOyyRrULR_hjACsWQKQlZrdqO4s"
destination = ["APA91bFeozxm32ZgOmv5JhLDxLjRS-pD5-nYpRQqsfAOBoetXHzBrX0rX7REFw4ltm6R5Aj8S8Tu24vzhP9rfiEAFuPdMLPjkRUCv5yunFlxV9xfyAZJwfd5zZxrzjAfbPqFtDBLwpTl-2UaGYrmwulvSGFnAQCJ0A"]
data = {:message => "PhoneGap Builds rocks!", :msgcnt => "1", :soundname => "beep.wav"}

GCM.send_notification( destination, data)
