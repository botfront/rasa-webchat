## 0.5.3
- Added the parameter hideWhenNotConnected to not display the widget when the server is not connected (defaults to true)
- Fixed issue where the 'connected' property was being loaded from previous session instead of being triggered on actual connection

## 0.5.2
- Added support for custom images for open and close buttons of chatWidget interface
- Fixed size of chatWidget when closed preventing to take more space than the open button so that we can click around the open button with no problem

## 0.5.0
- Added session persistence with Rasa Core

## 0.4.3
- Implemented session persistence for chat widget.
- Chat messages and widget state params are stored in storage of the browser.
- Sessions are synchronized with server by a session_id.
- The param `storage` is exposed which allows the user to specify where the session is stored.
- In the case of `session`, session storage of the browser is used, and the session persists as long as the browser is open, and is erased after it is closed.
- In the case of `local`, local storage of the browser is used and the session persists even after the browser is closed. The session is erased when the browser's cookies are cleared.
- Implemented connecting notifier and disabled input field before session_confirm is received from the server and the session is generated and synchronized.
- Separate connecting to server and sending initPayload. Server is connected when the component mounts, while initPayload is sent when the chat is toggled open and the server is connected.

## 0.4.2
- Added a image size property to widget initialization, in order to crop-scale images returned by bot.
- Images are crop-scaled to the defined size by the CSS property {object-fit: cover}. The content is sized to maintain its aspect ratio while filling the element’s entire content box. If the object's aspect ratio does not match the aspect ratio of its box then the object will be clipped to fit. The clipping will be taken from the center.
- `WebChat.toggle()`, `WebChat.open()`, and `WebChat.close` can be used to change the state of the chat box to open or closed.
- `WebChat.show()` and `WebChat.hide()` can be used to show or hide the entire chat widget.
- `WebChat.isOpen()` and `WebChat.isVisible()` can be used to get the open state of the chat box and the visibility state of the entire widget.

## 0.4.1
- Removed Linkify, added markdown support for response messages (urls still are detected automatically but not emails, to ensure a link appears use markdown syntax)
- Fixed fullScreenMode prop: now dispatches the initPayload when the component mounts, removed border-radius
