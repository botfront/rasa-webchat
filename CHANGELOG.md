# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.7.17](https://https///compare/v0.7.16...v0.7.17) (2020-02-03)


### Bug Fixes

* fixed socket update on props update ([ccfbb40](https://https///commit/ccfbb408e898ca9a940ec234aaa0dcbf643765b0))

### [0.7.16](https://https///compare/v0.7.15...v0.7.16) (2020-01-30)


### Features

* initial support for pageEventCallbacks ([caf129b](https://https///commit/caf129b3b1d07c829732dde9c9d29d5d9c8311ce))


### Bug Fixes

* webchat stuck on typing after refresh ([6d6d2f2](https://https///commit/6d6d2f2c08b571c028bda225eb8443b5b4aeb3dc))

### [0.7.15](https://https///compare/v0.7.14...v0.7.15) (2020-01-29)

### [0.7.14](https://https///compare/v0.7.13...v0.7.14) (2020-01-29)

### [0.7.13](https://https///compare/v0.7.12...v0.7.13) (2020-01-27)

### [0.7.12](https://https///compare/v0.7.11...v0.7.12) (2020-01-22)


### Bug Fixes

* reverted to opening links in new tab ([50b4b63](https://https///commit/50b4b63))

### [0.7.11](https://https///compare/v0.7.10...v0.7.11) (2020-01-22)


### Bug Fixes

* wrong parameters in initStore ([75fec82](https://https///commit/75fec82))

### [0.7.10](https://https///compare/v0.7.9...v0.7.10) (2020-01-17)


### Bug Fixes

* typo in onWidgetEvent ([c6d8588](https://https///commit/c6d8588))

### [0.7.9](https://https///compare/v0.7.8...v0.7.9) (2020-01-15)


### Features

* add widget even callback ([904cdf1](https://https///commit/904cdf1))
* allows the use of ref ([c8f7688](https://https///commit/c8f7688))
* domHightlight metadata support ([6a9a8d2](https://https///commit/6a9a8d2))
* forceOpen metadata support ([9034e62](https://https///commit/9034e62))
* new launcher icon ([4d3675b](https://https///commit/4d3675b))

### [0.7.8](https://https///compare/v0.7.4...v0.7.8) (2019-12-27)

### [0.7.4](https://https///compare/v0.7.3...v0.7.4) (2019-12-19)


### Features

* add a send function ([#150](https://https//undefined/issues/150)) ([4221e84](https://https///commit/4221e84))

### [0.7.3](https://https///compare/v0.7.2...v0.7.3) (2019-12-10)


### Bug Fixes

* detect text and qr messages when incoming metadata present ([8dcba98](https://https///commit/8dcba98))
* use message.content -- limitation from stompjs ([32b1e0b](https://https///commit/32b1e0b))

### [0.7.2](https://https///compare/v0.7.1...v0.7.2) (2019-12-04)


### Features

* add disconnect reason in socketjs LEAVE ([290e356](https://https///commit/290e356))

### [0.7.1](https://https///compare/v0.7.0...v0.7.1) (2019-11-27)

## [0.7.0](https://https///compare/v0.6.6...v0.7.0) (2019-11-21)


### Bug Fixes

* init payload is now sent only when opened ([efebacb](https://https///commit/efebacb))


### Features

* added a prop tooltipDelay ([8c8cd95](https://https///commit/8c8cd95))
* smart typing delay and typing indication ([8738c63](https://https///commit/8738c63))
* tooltip popup ([04e1279](https://https///commit/04e1279))

### [0.6.6](https://https///compare/v0.6.5...v0.6.6) (2019-10-30)


### Bug Fixes

* margin 0 is prefered to margin 0px ([2c0ca86](https://https///commit/2c0ca86))
* no margin on last child only applies to <p> ([4fe3e9b](https://https///commit/4fe3e9b))


### Features

* add margin to <p> to display newline ([c7df04b](https://https///commit/c7df04b))

### [0.6.5](https://https///compare/v0.6.4...v0.6.5) (2019-10-25)


### Bug Fixes

* duplicate registration of connect and disconnect event ([263b847](https://https///commit/263b847))
* duplicate user connection and small refactoring ([58e8925](https://https///commit/58e8925))
* function binding ([0a035c0](https://https///commit/0a035c0))
* invalid date if timestamp not present ([4c7be48](https://https///commit/4c7be48))
* link and add container-class to quickreplies ([67f7fcf](https://https///commit/67f7fcf))
* lost of path in sockjs implementation ([46adcab](https://https///commit/46adcab))
* message's date CSS and removed seconds from date ([e0fe602](https://https///commit/e0fe602))
* sockjs duplicate connection ([991cc6a](https://https///commit/991cc6a))


### Features

* display message's date on chat ([3fef7c8](https://https///commit/3fef7c8))

### [0.6.4](https://https///compare/v0.6.3...v0.6.4) (2019-10-18)


### Features

* added props connectOn and onSocketEvent ([667c745](https://https///commit/667c745))

### [0.6.3](https://https///compare/v0.6.2...v0.6.3) (2019-10-11)


### Bug Fixes

* displayUnreadCount in index ([9d915ad](https://https///commit/9d915ad))
* displayUnreadCount props ([21ef8c2](https://https///commit/21ef8c2))
* revert inputTextFieldHint ([cb94a5e](https://https///commit/cb94a5e))


### Features

* add unread count pastille on openLauncherMessage ([ee37f19](https://https///commit/ee37f19)), closes [#73](https://https///issues/73)
* regroup messages in conversation by "sender" ([e837844](https://https///commit/e837844))

### [0.6.2](https://https///compare/v0.6.1...v0.6.2) (2019-10-11)

### [0.6.1](https://https///compare/v0.6.0...v0.6.1) (2019-10-11)


### Bug Fixes

* cast messages text into string to prevent crashes ([4778ad8](https://https///commit/4778ad8))


### Features

* experimental sockjs support ([b1f7c9d](https://https///commit/b1f7c9d))

## [0.6.0](https://https///compare/v0.5.9...v0.6.0) (2019-10-03)

### 0.5.10 (2019-10-02)


### Bug Fixes

* links should open in a new tab ([e238af3](https://https///commit/e238af3))
* update node-sass version to support node12 ([dd3eee9](https://https///commit/dd3eee9))


### Features

* add commitlint and husky ([a040aeb](https://https///commit/a040aeb))
* add standard version ([573b856](https://https///commit/573b856))
* add test for quick replies linking ([f95e8f3](https://https///commit/f95e8f3))
* support web url in quick replies ([ac4b6f1](https://https///commit/ac4b6f1))

### [0.5.10](https://https///compare/v0.5.9...v0.5.10) (2019-10-02)


### Bug Fixes

* links should open in a new tab ([e238af3](https://https///commit/e238af3))
* update node-sass version to support node12 ([dd3eee9](https://https///commit/dd3eee9))


### Features

* add commitlint and husky ([a040aeb](https://https///commit/a040aeb))
* add standard version ([573b856](https://https///commit/573b856))
* add test for quick replies linking ([f95e8f3](https://https///commit/f95e8f3))
* support web url in quick replies ([ac4b6f1](https://https///commit/ac4b6f1))

### [0.5.9](https://https///compare/v2.1.1...v0.5.9) (2019-06-06)



### 0.5.8 (2019-05-07)


### Bug Fixes

* css scope ([6c4f7d3](https://https///commit/6c4f7d3))



### 0.5.7 (2019-04-29)



### 0.5.6 (2019-03-06)



### 0.5.5 (2019-02-27)



### 0.5.4 (2019-01-16)



### 0.5.3 (2018-12-21)



### 0.5.2 (2018-12-17)


### Bug Fixes

* it was impossible to click behind the empty space of widget button ([8e63321](https://https///commit/8e63321))



### 0.5.1 (2018-12-03)



## 0.5.0 (2018-11-28)



### 0.4.2 (2018-11-14)


### Features

* 🎸 Add max-width to images and expose image params ([2d3482b](https://https///commit/2d3482b))


### BREAKING CHANGES

* \



### 0.4.1 (2018-10-29)



## 0.4.0 (2018-10-19)



### 0.3.4 (2018-10-12)



### 0.3.3 (2018-10-06)



### 0.3.2 (2018-10-06)


### Bug Fixes

* testing suite completing appropriately ([e89087e](https://https///commit/e89087e))



### 0.3.1 (2018-07-11)



## 0.3.0 (2018-07-06)



### 0.1.1 (2018-04-29)



## 0.1.0 (2018-04-11)



## 0.5.8
- Namespaced all css declarations so that they don't affect styles outside of the widget.

## 0.5.7
- Fixed a bug where the connection would not close down when the component unmounted and continued polling indefinitely in the background.

## 0.5.6
- Fixed a bug where named links would not render in a received message

## 0.5.5
- New prop, `docViewer`, if this props is true, this will treat every link in received messages as a document and will open it in a popup using docs.google.com/viewer (note: this is an experimental feature and should be used with caution)

## 0.5.4
- When reconnecting to an existing chat session, the bot will send a message contained in the localStorage key specified by the `NEXT_MESSAGE` constant. The message should be stringified JSON with a `message` property describing the message and an `expiry` property set to a UNIX timestamp in milliseconds after which this message should not be sent.

## 0.5.3
- Added the parameter hideWhenNotConnected to not display the widget when the server is not connected (defaults to true)
- Fixed issue where the 'connected' property was being loaded from previous session instead of being triggered on actual connection
- Reduced the size of the widget container on mobile and in fullscreen mode (blocking clicks)

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
