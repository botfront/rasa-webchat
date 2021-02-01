import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import Widget from '../index';

import RulesHandler, { RULES_HANDLER_SINGLETON } from './rules';
import { rasaWebchatProTypes, rasaWebchatProDefaultTypes } from '../../index';

const RasaWebchatPro = React.memo(
  forwardRef((props, ref) => {
    const widget = useRef(null);

    const updateRules = (newRules) => {
      if (newRules && widget && widget.current.sendMessage) {
        const handler =
                    (window[RULES_HANDLER_SINGLETON] &&
                        window[RULES_HANDLER_SINGLETON].updateRules(newRules)) ||
                    new RulesHandler(
                      newRules,
                      widget.current.sendMessage,
                      props.triggerEventListenerUpdateRate
                    );
        handler.initHandler();
        // putting it in the window object lets us do the singleton design pattern
        window[RULES_HANDLER_SINGLETON] = handler;
      }
    };

    useEffect(() => function cleanUp() {
      const handler = window[RULES_HANDLER_SINGLETON];
      if (handler && handler instanceof RulesHandler) {
        handler.cleanUp(true);
      }
    }, []);

    useImperativeHandle(ref, () => ({
      sendMessage: (...args) => {
        widget.current.sendMessage(...args);
      },
      updateRules: (rules) => {
        updateRules(rules);
      },
      getSessionId: widget.current.getSessionId
    }));

    return <Widget ref={widget} {...{ ...props }} />;
  })
);

RasaWebchatPro.propTypes = rasaWebchatProTypes;

RasaWebchatPro.defaultProps = rasaWebchatProDefaultTypes;

export default RasaWebchatPro;
