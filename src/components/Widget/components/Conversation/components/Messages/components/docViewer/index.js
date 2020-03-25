import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Portal from 'utils/portal';
import './style.scss';

class DocViewer extends Component {
  constructor() {
    super();
    this.iframeLoaded = this.iframeLoaded.bind(this);
    this.updateIframeSrc = this.updateIframeSrc.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.state = {
      openedModal: false,
      iFrameLoading: true
    };
  }

  getIframeLink() {
    return `https://docs.google.com/viewer?url=${this.props.src}&embedded=true`;
  }

  iframeLoaded() {
    clearInterval(this.iframeTimeoutId);
    this.setState({ iFrameLoading: false });
  }

  bindActions() {
    this.iframeLoaded = this.iframeLoaded.bind(this);
  }

  updateIframeSrc() {
    if (this.iframe) this.iframe.src = this.getIframeLink();
    else clearInterval(this.iframeTimeoutId);
  }

  handleOpenModal() {
    this.setState({ openedModal: true });
    this.iframeTimeoutId = setInterval(this.updateIframeSrc, 1000 * 4);
  }

  handleCloseModal() {
    this.setState({ openedModal: false, iFrameLoading: true });
  }

  render() {
    const iframeSrc = this.getIframeLink();

    return (
      <span>
        <button onClick={this.handleOpenModal} className="rw-doc-viewer-open-modal-link">
          {this.props.children}
        </button>
        {this.state.openedModal && (
          <Portal>
            <div className="rw-doc-viewer-modal-fade" aria-hidden="true" onClick={this.handleCloseModal} />
            <div className="rw-doc-viewer-modal">
              <div className="rw-doc-viewer-modal-body">
                {this.state.iFrameLoading && <div className="rw-doc-viewer-spinner" />}
                <iframe
                  src={iframeSrc}
                  title="viewer"
                  className="rw-doc-viewer-modal-iframe"
                  onLoad={this.iframeLoaded}
                  onError={this.updateIframeSrc}
                  ref={(iframe) => {
                    this.iframe = iframe;
                  }}
                />
              </div>
              <div className="rw-doc-viewer-modal-footer">
                <button type="button" className="rw-doc-viewer-close-modal" onClick={this.handleCloseModal}>
                  X
                </button>
              </div>
            </div>
          </Portal>
        )}
      </span>
    );
  }
}

DocViewer.propTypes = {
  src: PropTypes.string.isRequired
};

export default DocViewer;
