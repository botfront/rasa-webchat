import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { PROP_TYPES } from 'constants';
import { setButtons, toggleInputDisabled } from 'actions';
import ReactMarkdown from 'react-markdown';



import './styles.scss';
import ThemeContext from '../../../../../../ThemeContext';

const default_max_results = 5

class Results_Display extends PureComponent {

  constructor(props) {

    super(props);

    const {
      message,
    } = this.props;

    if (message.get('results') !== undefined && message.get("nb_max_results") !== undefined) {
      message.get('results').size, message.get('results')._capacity = message.get("nb_max_results")
    }
    else {
      message.get('results').size, message.get('results')._capacity = default_max_results
    }
  }

  handleClick(reply) {

    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
      if (coll[i].textContent === reply.get("title")) {

        coll[i].classList.toggle("active");
        var content = coll[i].nextElementSibling;
        if (content.style.maxHeight) {
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
        }

      }
    }
  }

  renderResultsDisplay(message, results) {

    const { userTextColor, userBackgroundColor } = this.context;
    const resultStyle = {
      color: userTextColor,
      backgroundColor: userBackgroundColor,
      borderColor: userBackgroundColor
    };

    return (
      <div>
        {results.map((reply, index) => {
          return (
            <div
              key={"collaps" + index}
            >
              <button
                type="button"
                className={'collapsible'}
                onClick={(e) => { e.stopPropagation(); this.handleClick(reply); }}
              >
                {reply.get('title')}
              </button>
              <div
                key={"cont" + index}
                className={"collapsible-content"}
              >
                <ReactMarkdown
                  className={'rw-markdown'}
                  source={reply.get('description')}
                  linkTarget={(url) => {
                    if (!url.startsWith('mailto') && !url.startsWith('javascript')) return '_blank';
                    return undefined;
                  }}
                  transformLinkUri={null}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  render() {

    const {
      message,
    } = this.props;

    if (message.get("results") !== undefined) {
      return this.renderResultsDisplay(message, message.get('results'))
    }

  }

}

Results_Display.contextType = ThemeContext;

const mapStateToProps = state => ({
  getChosenReply: id => state.messages.get(id).get('chosenReply'),
  linkTarget: state.metadata.get('linkTarget')
});

const mapDispatchToProps = dispatch => ({
  toggleInputDisabled: () => dispatch(toggleInputDisabled()),
  chooseReply: (payload, title, id) => {
    dispatch(setButtons(id, title));
  }
});

Results_Display.propTypes = {
  getChosenReply: PropTypes.func,
  chooseReply: PropTypes.func,
  id: PropTypes.number,
  isLast: PropTypes.bool,
  message: PROP_TYPES.RESULTS_DISPLAY,
  linkTarget: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(Results_Display);
