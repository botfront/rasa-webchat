import React from 'react';
import ReactDOM from 'react-dom';

// This should be deleted when using React 16.x,
// Use ReactDOM.createPortal() instead
class Portal extends React.Component {
  constructor() {
    super();
    this.portalElement = null;
  }

  componentDidMount() {
    const p = document.createElement('div');
    document.body.appendChild(p);
    this.portalElement = p;
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    ReactDOM.render(<div>{this.props.children}</div>, this.portalElement);
  }

  componentWillUnmount() {
    document.body.removeChild(this.portalElement);
  }

  render() {
    return null;
  }
}

export default Portal;
