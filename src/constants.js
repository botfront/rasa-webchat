import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

export const SESSION_NAME = 'chat_session';

export const MESSAGE_SENDER = {
  CLIENT: 'client',
  RESPONSE: 'response'
};

export const MESSAGES_TYPES = {
  TEXT: 'text',
  CAROUSEL: 'carousel',
  VIDREPLY: {
    VIDEO: 'vidreply'
  },
  IMGREPLY: {
    IMAGE: 'imgreply'
  },
  BUTTONS: 'buttons',
  CUSTOM_COMPONENT: 'component'
};

const replybuttons = PropTypes.shape({
  title: PropTypes.string,
  url: PropTypes.string,
  payload: PropTypes.string,
  type: PropTypes.string
});

const senderType = PropTypes.oneOf([
  MESSAGE_SENDER.CLIENT,
  MESSAGE_SENDER.RESPONSE
]);

export const NEXT_MESSAGE = 'mrbot_next_message';

export const PROP_TYPES = {

  MESSAGE: ImmutablePropTypes.contains({
    type: PropTypes.oneOf([
      MESSAGES_TYPES.TEXT,
      MESSAGES_TYPES.BUTTONS,
      MESSAGES_TYPES.CAROUSEL,
      MESSAGES_TYPES.IMGREPLY.IMAGE,
      MESSAGES_TYPES.VIDREPLY.VIDEO
    ]),
    id: PropTypes.number,
    text: PropTypes.string,
    sender: senderType
  }),

  CAROUSEL: ImmutablePropTypes.contains({
    id: PropTypes.number,
    elements: ImmutablePropTypes.listOf(
      ImmutablePropTypes.mapContains({
        title: PropTypes.string,
        subtitle: PropTypes.string,
        imageUrl: PropTypes.string,
        buttons: ImmutablePropTypes.listOf(replybuttons),
        defaultActions: replybuttons
      })),
    sender: senderType
  }),

  VIDREPLY: ImmutablePropTypes.contains({
    type: PropTypes.oneOf([
      MESSAGES_TYPES.TEXT,
      MESSAGES_TYPES.VIDREPLY.VIDEO
    ]),
    id: PropTypes.number,
    title: PropTypes.string,
    src: PropTypes.string,
    sender: senderType
  }),

  IMGREPLY: ImmutablePropTypes.contains({
    type: PropTypes.oneOf([
      MESSAGES_TYPES.TEXT,
      MESSAGES_TYPES.IMGREPLY.IMAGE
    ]),
    id: PropTypes.number,
    title: PropTypes.string,
    src: PropTypes.string,
    sender: senderType
  }),

  BUTTONS: ImmutablePropTypes.contains({
    type: PropTypes.oneOf([
      MESSAGES_TYPES.BUTTONS
    ]),
    id: PropTypes.number,
    text: PropTypes.string,
    hint: PropTypes.string,
    quick_replies: ImmutablePropTypes.listOf(replybuttons),
    buttons: ImmutablePropTypes.listOf(replybuttons),
    sender: senderType,
    chooseReply: PropTypes.func,
    getChosenReply: PropTypes.func,
    toggleInputDisabled: PropTypes.func,
    inputState: PropTypes.bool,
    chosenReply: PropTypes.string
  })

};
