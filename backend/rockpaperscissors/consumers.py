from channels.consumer import SyncConsumer

class EchoConsumer(SyncConsumer):

    def websocket_connect(self, event):
        self.send({
            "type": "websocket.accept",
        })

    def websocket_receive(self, event):
        #print(event)
        event['text']='{"message":"this is a response from the server"}'
        #print(event)
        self.send({
            "type": "websocket.send",
            "text": event["text"],
        })
