# webchat

A simple webchat widget to connect to a chatbot. Forked from [react-chat-widget](https://github.com/Wolox/react-chat-widget)
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
        socketUrl: "http://localhost:5500",
        title: "Title"
        subtitle: "Subtitle"
        profileAvatar: "http://to.avat.ar"
        showCloseButton: true
        fullScreenMode: false
</script>
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
message = {"message":{
            "attachment":{
              "type":"template",
              "payload":{
                "template_type":"generic",
                "elements":[
                  {
                    "title":"Title",
                    "buttons":[
                      "title":"Link name",
                      "url": "http://link.url"
                    ]
                  }
                ]
              }
            }
          })
emit('bot_uttered', message, room=socket_id)
```

#### Using with Rasa
The chat widget can communicate with any backend, but there is a [Rasa core channel
available here](https://github.com/mrbot-ai/rasa-addons/)

## Contributors
@PHLF
@znat
