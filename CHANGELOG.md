## 4.0.1

- Removed Linkify, added markdown support for response messages
(urls still are detected automatically but not emails, to ensure
a link appears use markdown syntax)
- Fixed fullScreenMode prop: now dispatches the initPayload 
when the component mounts, removed border-radius