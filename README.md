# webchat

A simple webchat widget to connect with a chatbot. Forked from [react-chat-widget](https://github.com/Wolox/react-chat-widget)
## Features

- Plain text message UI
- Snippet style for links (only as responses for now)
- Quick Replies
- Compatible with Messenger Platform API

![demonstration](./assets/chat-demonstration.gif)

## Usage

In your `<body/>`:
```javascript
<div id="webchat"/>
<script src="https://storage.googleapis.com/mrbot-cdn/webchat-latest.js"></script>
<script>
    WebChat.default.init({
        selector: "#webchat",
        initPayload: "/get_started",
        interval: 1000, // 1000 ms between each message
        customData: {"userId": "123"}, // arbitrary custom data. Stay minimal as this will be added to the socket
        socketUrl: "http://localhost:5500",
        title: "Title",
        subtitle: "Subtitle",
        profileAvatar: "http://to.avat.ar",
    })
</script>
```

To import Webchat as a react component:
```bash
npm install mrbot-ai/rasa-webchat
```

Then once it is installed it can be implemented as follows. Make sure to have the prop 'embedded'
set to true if you don't want to see the launcher
```javascript
import { Widget } from 'rasa-webchat';

function CustomWidget = () => {
  return (
    <Widget
      interval={2000}
      initPayload={"/get_started"}
      socketUrl={"http://localhost:5500"}
      title={"Title"}
      embedded={true}
    />
  )
}
```

## In your backend.

Your backend should expose a socket with [socket.io](http://socket.io)

### Receiving messages from the chat

```python
@socketio.on('user_uttered')
    def handle_message(message):
        # do something
```          

### Sending messages from the backend to the chat widget

#### sending plain text

```python
emit('bot_uttered', {"text": "hello"}, room=socket_id)
```

#### sending quick replies

```python
message = {
  "text": "Happy?",
  "quick_replies":[
    {"title":"Yes", "payload":"/affirm"},
    {"title":"No", "payload":"/deny"}
  ]}
emit('bot_uttered', message, room=socket_id)
```

#### sending a link Snippet

Admittedly a bit far fetched, thinking that Snippets would evolve to carousels
of generic templates :)

```python
message = {
  "attachment":{
    "type":"template",
    "payload":{
      "template_type":"generic",
      "elements":[
        {
          "title":"Title",
          "buttons":[ {
            "title":"Link name",
            "url": "http://link.url"
          }
        ]
      }
    ]
  }
}
}    
emit('bot_uttered', message, room=socket_id)
```

#### sending a Video Message

```python
message = {
  "attachment":{
    "type":"video",
    "payload":{
      "title":"Link name",
      "src": "https://www.youtube.com/watch?v=f3EbDbm8XqY"
    }
  }
}  
emit('bot_uttered', message, room=socket_id)
```

#### sending an Image Message

```python
message = {
      "attachment":{
        "type":"image",
        "payload":{
          "title":"Link name",
          "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_IX5FSDQLrwm9qvuXu_g7R9t_-3yBSycZ8OxpRXvMDaTAeBEW"
        }
      }
    }
emit('bot_uttered', message, room=socket_id)
```
#### Using with Rasa
The chat widget can communicate with any backend, but there is a [Rasa core channel
available here](https://github.com/mrbot-ai/rasa-addons/)


## Contributors
[@PHLF](https://github.com/phlf)
[@znat](https://github.com/znat)
[@TheoTomalty](https://github.com/TheoTomalty)
[@Hub4IT](https://github.com/Hub4IT)
