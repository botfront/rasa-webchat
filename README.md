# webchat

A simple webchat widget to connect with a chatbot. Forked from [react-chat-widget](https://github.com/Wolox/react-chat-widget)
## Features

- Text Messages
- Quick Replies
- Images and Videos
- Snippet style for links (only as responses for now)
- Markdown support
- Easy to import in a script tag or as a React Component
- Persistent sessions

![demonstration](./assets/chat-demonstration.gif)

## Setup

### In a `<script>` tag

In your `<body/>`:
```javascript
<div id="webchat"/>
<script src="https://storage.googleapis.com/mrbot-cdn/webchat-0.5.6.js"></script>
<script>
  WebChat.default.init({
    selector: "#webchat",
    initPayload: "/get_started",
    interval: 1000, // 1000 ms between each message
    customData: {"userId": "123"}, // arbitrary custom data. Stay minimal as this will be added to the socket
    socketUrl: "http://localhost:5500",
    socketPath: "/socket.io/",
    title: "Title",
    subtitle: "Subtitle",
    inputTextFieldHint: "Type a message...",
    connectingText: "Waiting for server...",
    hideWhenNotConnected: true,
    fullScreenMode: false,
    profileAvatar: "http://to.avat.ar",
    openLauncherImage: 'myCustomOpenImage.png',
    closeLauncherImage: 'myCustomCloseImage.png',
    params: {
      images: {
        dims: {
          width: 300,
          height: 200,
        }
      },
      storage: "local"
    }
  })
</script>
```

About images: `width` and `height` define the size in pixels that images in messages are crop-scaled to. If not present, the image will scale to the maximum width of the container and the image.

It is recommended to use a particular version (i.e. "webchat-<version>.js") however the file "webchat-latest.js"
is also available and is updated continuously with the latest version.

### As a React component

Install the package from GitHub by running:
```bash
npm install mrbot-ai/rasa-webchat
```

Then once it is installed it can be implemented as follows.

```javascript
import { Widget } from 'rasa-webchat';

function CustomWidget = () => {
  return (
    <Widget
      interval={2000}
      initPayload={"/get_started"}
      socketUrl={"http://localhost:5500"}
      socketPath={"/socket.io/"}
      customData: {{"userId": "123"}}, // arbitrary custom data. Stay minimal as this will be added to the socket
      title={"Title"}
      inputTextFieldHint={"Type a message..."}
      connectingText={"Waiting for server..."}
      hideWhenNotConnected
      embedded={true}
      openLauncherImage="myCustomOpenImage.png"
      closeLauncherImage="myCustomCloseImage.png"
      params={{
        images: {
          dims: {
            width: 300,
            height: 200
          }
        },
        storage: "local"
      }}
    />
  )
}
```

- Make sure to have the prop `embedded`
set to `true` if you don't want to see the launcher.

### Backend

#### Rasa Core

Use the SocketIOInput channel: See [instructions in the Rasa Core documentation](https://rasa.com/docs/core/connectors/#socketio-connector)

If you want to process `customData` in Rasa Core you have to [create a new channel](https://rasa.com/docs/core/connectors/#custom-channels). Use channel `rasa_core.channels.socketio` as a template for your new channel. In such channel `customData` can be retrieved via `data['customData']`. Then you can  modify `sender_id`, save `customData` to the database, fill slots or whatever you need to with your additional data.

#### Others
Your backend must expose a socket with [socket.io](http://socket.io)

##### Receiving messages from the chat

```python
@socketio.on('user_uttered')
    def handle_message(message):
        # do something
```

##### Sending messages from the backend to the chat widget

###### sending plain text

```python
emit('bot_uttered', {"text": "hello"}, room=session_id)
```

###### sending quick replies

```python
message = {
  "text": "Happy?",
  "quick_replies":[
    {"title":"Yes", "payload":"/affirm"},
    {"title":"No", "payload":"/deny"}
  ]}
emit('bot_uttered', message, room=socket_id)
```

###### sending a link Snippet

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

###### sending a Video Message

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

###### sending an Image Message

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


## Usage

### Session Persistence

`storage` specifies the location where the the conversation and state of the WebChat is stored in the browser's storage.

`storage: "session"` defines the state to be stored in the session storage. The session storage persists on reload of the page, and is cleared after the browser or tab is closed, or when `sessionStorage.clear()`is called.

`storage: "local"` defines the state to be stored in the local stoage. The local storage persists after the the browser is closed, and is cleared when the cookies of the browser are cleared, or when `localStorage.clear()`is called.


### Sending a message on page load

When reconnecting to an existing chat session, the bot will send a message contained in the localStorage key specified by the `NEXT_MESSAGE` constant. The message should be stringified JSON with a `message` property describing the message and an `expiry` property set to a UNIX timestamp in milliseconds after which this message should not be sent. This is useful if you would like your bot to be able to offer your user to navigate around the site.

### docViewer

**Note :** this is an **experimental** feature  

If you add this prop to the component or to the init script, `docViewer=true` , this will treat links in received messages as links to a document ( `.pdf .doc .xlsx` etc. ) and will open them in a popup using `https://docs.google.com/viewer` service

## API

| Method                  |  Description                                                                                                       |
|-------------------------|--------------------------------------------------------------------------------------------------------------------|
| WebChat.toggle()        | Toggle the open/close state of the chat window, send initPayload if webchat is not initialized and is toggled open |
| WebChat.open()          | Open the chat window, send initPayload if webchat is not initialized                                               |
| WebChat.close()         | Close the chat window                                                                                              |
| WebChat.isOpen()     | Get the open/closed state of the widget                                                                               |
| WebChat.show()          | Show the chat widget, send initPayload if the chat is in open state and not initialized                            |
| WebChat.hide()          | Hide the chat widget                                                                                               |
| WebChat.isVisible()     | Get the shown/hidden state of the widget                                                                           |



## Styles

hierarchy:
```
.conversation-container
  |-- .header
        |-- .title
        |-- .close-function
        |-- .loading
  |-- .messages-container
        |-- .message
              |-- .client
              |-- .response
        |-- .replies
              |-- .reply
              |-- .response
        |-- .snippet
              |-- .snippet-title
              |-- .snippet-details
              |-- .link
        |-- .imageFrame
        |-- .videoFrame
  |-- .sender
        |-- .new-message
        |-- .send
```

| Class                   |  Description                                                        |
|-------------------------|---------------------------------------------------------------------|
| .widget-container       | The div containing the chatbox of the default version               |
| .widget-embedded        | div of the embedded chatbox (using embedded prop)                   |
| .full-screen            | div of the fullscreen chatbox (using fullScreenMode prop)           |
| .conversation-container | the parent div containing the header, message-container and sender  |
| .messages-container     | the central area where the messages appear                          |
| .sender                 | div of the bottom area which prompts user input                     |
| .new-message            | the text input element of sender                                    |
| .send                   | the send icon element of sender                                     |
| .header                 | div of the top area with the chatbox header                         |
| .title                  | the title element of the header                                     |
| .close-button           | the close icon of the header                                        |
| .loading                | the loading status element of the header                            |
| .message                | the boxes holding the messages of client and response               |
| .replies                | the area that gives quick reply options                             |
| .snippet                | a component for describing links                                    |
| .imageFrame             | a container for sending images                                      |
| .videoFrame             | a container for sending video                                       |

## Usage with Docker

Since you have to install the package from GitHub, npm will clone the repo to the global .npm directory before
building the module in your node_modules directory. For this reason docker will have trouble installing the package,
of course the global .npm directory doesn't exist in the container. To solve this simply add the following line
in your Dockerfile before the `RUN npm install` command

```docker
RUN mkdir -p /root/.npm
```


## Contributors
[@PHLF](https://github.com/phlf)
[@znat](https://github.com/znat)
[@TheoTomalty](https://github.com/TheoTomalty)
[@Hub4IT](https://github.com/Hub4IT)
[@dliuproduction](https://github.com/dliuproduction)
[@MatthieuJnon](https://github.com/MatthieuJnon)
