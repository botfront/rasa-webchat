## 0.4.1

- Removed Linkify, added markdown support for response messages
(urls still are detected automatically but not emails, to ensure
a link appears use markdown syntax)
- Fixed fullScreenMode prop: now dispatches the initPayload 
when the component mounts, removed border-radius

## 0.4.2

- Added a image size property to widget initialization, in order
to crop-scale images returned by bot.
- Images are crop-scaled to the defined size by the CSS property
{object-fit: cover}. The content is sized to maintain its aspect 
ratio while filling the element’s entire content box. If the 
object's aspect ratio does not match the aspect ratio of its box
then the object will be clipped to fit. The clipping will be taken
from the center.
