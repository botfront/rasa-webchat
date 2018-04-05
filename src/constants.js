import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

export const MESSAGE_SENDER = {
  CLIENT: 'client',
  RESPONSE: 'response'
};

export const MESSAGES_TYPES = {
  TEXT: 'text',
  SNIPPET: {
    LINK: 'snippet'
  },
  QUICK_REPLY: 'quickreply',
  CUSTOM_COMPONENT: 'component'
};

export const PROP_TYPES = {
  MESSAGE: ImmutablePropTypes.contains({
    type: PropTypes.oneOf([
      MESSAGES_TYPES.TEXT,
      MESSAGES_TYPES.SNIPPET.LINK
    ]),
    id: PropTypes.number,
    text: PropTypes.string,
    sender: PropTypes.oneOf([
      MESSAGE_SENDER.CLIENT,
      MESSAGE_SENDER.RESPONSE
    ])
  }),

  SNIPPET: ImmutablePropTypes.contains({
    type: PropTypes.oneOf([
      MESSAGES_TYPES.TEXT,
      MESSAGES_TYPES.SNIPPET.LINK
    ]),
    id: PropTypes.number,
    title: PropTypes.string,
    link: PropTypes.string,
    content: PropTypes.string,
    target: PropTypes.target,
    sender: PropTypes.oneOf([
      MESSAGE_SENDER.CLIENT,
      MESSAGE_SENDER.RESPONSE
    ])
  }),

  QUICK_REPLY: ImmutablePropTypes.contains({
    type: PropTypes.oneOf([
      MESSAGES_TYPES.QUICK_REPLY
    ]),
    id: PropTypes.number,
    replies: ImmutablePropTypes.listOf(
        PropTypes.shape({
          title: PropTypes.string,
          payload: PropTypes.string
        })),
    sender: PropTypes.oneOf([
      MESSAGE_SENDER.CLIENT,
      MESSAGE_SENDER.RESPONSE
    ]),
    chooseReply: PropTypes.func,
    chosenReply: PropTypes.string
  })
};
