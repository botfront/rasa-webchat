/* eslint-disable no-mixed-operators */
/* eslint-disable prefer-rest-params */
/* eslint-disable class-methods-use-this */
import hash from 'object-hash';

import QuestionMark from './question-solid.svg';
import { onRemove } from './utils';

const LOCAL_STORAGE_ACCESS_STRING = 'rasaWebchatPro';
export const RULES_HANDLER_SINGLETON = 'rasaWebchatRulesHandler';

export default class RulesHandler {
  constructor(rules, sendMethod, triggerEventListenerUpdateRate = 500) {
    this.url = window.location.host + window.location.pathname;
    this.numberOfVisits = 0;
    this.rules = rules;
    this.sendMethod = sendMethod;
    this.timeoutIds = [];
    this.eventListeners = [];
    this.resetListenersTimeouts = [];
    this.protocol = window.location.protocol;
    this.triggerEventListenerUpdateRate = triggerEventListenerUpdateRate;
    this.lastLocationChange = Date.now();

    // Here we supersede those events to all redirect them to our custom event
    window.history.pushState = (f =>
      function pushState() {
        const ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
      })(window.history.pushState);

    window.history.replaceState = (f =>
      function replaceState() {
        const ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
      })(window.history.replaceState);

    this.popstateCallback = () => {
      window.dispatchEvent(new Event('locationchange'));
    };

    window.addEventListener('popstate', this.popstateCallback);

    this.locationChangeCallback = () => {
      if ((Date.now() - window[RULES_HANDLER_SINGLETON].lastLocationChange) < 150) {
        return;
      }
      window[RULES_HANDLER_SINGLETON].lastLocationChange = Date.now();
      // We use the window object that was set in the react component
      // So that we have an up to date version
      if (window[RULES_HANDLER_SINGLETON]) {
        window[RULES_HANDLER_SINGLETON].url =
                    window.location.host + window.location.pathname;
        // We clean up the timeouts so that we don't have race conditions and unwanted triggers
        window[RULES_HANDLER_SINGLETON].cleanUp();
        window[RULES_HANDLER_SINGLETON].initHandler();
      }
    };

    window.addEventListener('locationchange', this.locationChangeCallback);
  }

  static removeEventListeners(eventListeners) {
    eventListeners.forEach((eventListener) => {
      eventListener.elem.removeEventListener(
        eventListener.event,
        eventListener.conditionChecker
      );
    });
  }

  updateRules(newRules) {
    window[RULES_HANDLER_SINGLETON].cleanUp();
    window[RULES_HANDLER_SINGLETON].rules = newRules;
  }

  storeRuleHash(rule) {
    // We remove the payload and text so that they're not part of the rule when we
    // compute if it has already been ran or not.
    const rulesHash = hash(rule.trigger);

    // We store the hash on the rule object so that it can be used
    // further down the line.
    rule.hash = rulesHash;

    const ruleTriggered = this.history.rulesTriggered.find(
      ruleInStorage => ruleInStorage.hash === rulesHash
    );
    if (!(ruleTriggered && ruleTriggered.triggerLimit)) {
      this.history.rulesTriggered.push({
        hash: rulesHash,
        triggerLimit: rule.trigger.triggerLimit,
        triggered: 0
      });
      this.storeHistory();
    }
  }

  // verify conditions if no timeOnPage rule
  // or setATimeoutToCheck conditions if there is one.
  initHandler() {
    this.fetchHistory();
    const visitsOnThisPage = this.history.timePerPage[this.url];
    this.history.timePerPage[this.url] = visitsOnThisPage ? visitsOnThisPage + 1 : 1;
    this.storeHistory(this.url);
    this.rules.forEach((rules) => {
      const trigger = rules.trigger || {};

      if (trigger && (trigger.when === 'limited' || trigger.timeLimit)) {
        this.storeRuleHash(rules);
      }

      if (trigger.eventListeners) {
        if (trigger.timeOnPage) {
          this.timeoutIds.push(
            setTimeout(
              () => window[RULES_HANDLER_SINGLETON].initEventHandler(rules),
              trigger.timeOnPage * 1000
            )
          );
        } else {
          this.initEventHandler(rules);
        }
        // We don't want to continue and verify the conditions in that case
        return;
      }
      if (!trigger.timeOnPage) {
        this.verifyConditions(rules);
      } else {
        this.timeoutIds.push(
          setTimeout(
            () => window[RULES_HANDLER_SINGLETON].verifyConditions(rules),
            trigger.timeOnPage * 1000
          )
        );
      }
    });
  }

  initEventHandler(rules, withViz = true) {
    const trigger = rules.trigger || {};

    const eventListenersForThisTrigger = [];

    trigger.eventListeners.forEach((listener) => {
      if (!listener.selector || !listener.event) {
        // eslint-disable-next-line no-console
        console.log("you're missing a selector or an event on an event listener");
        return;
      }
      let elemList = null;
      try {
        elemList = document.querySelectorAll(listener.selector);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(`${listener.selector} is not a valid selector string`);
      }
      if (elemList.length > 0) {
        elemList.forEach((elem) => {
          // We create it empty, because it depends on what happens later in this method.
          // By the time this callback is called, it will be a different method.
          let removalMethod = () => {};
          const conditionChecker = () => {
            window[RULES_HANDLER_SINGLETON].verifyConditions(
              rules,
              false,
              listener.visualization ? listener.selector : undefined,
              removalMethod
            );
          };

          const eventListener = {
            elem,
            event: listener.event,
            conditionChecker,
            id: Math.random()
          };

          this.eventListeners.push(eventListener);
          eventListenersForThisTrigger.push(eventListener);

          elem.addEventListener(listener.event, conditionChecker);

          if (this.verifyConditions(rules, true) && listener.visualization !== 'none' && withViz) {
            removalMethod = this.addViz(listener, elem);
            onRemove(elem, removalMethod);
          }
        });
      }
    });

    const timeoutId = Math.random();

    this.resetListenersTimeouts.push({
      timeout: setTimeout(() => {
        // this removes the timeout that just triggered.
        window[RULES_HANDLER_SINGLETON].resetListenersTimeouts = window[RULES_HANDLER_SINGLETON]
          .resetListenersTimeouts.filter(timeout => timeout.id !== timeoutId);

        RulesHandler.removeEventListeners(eventListenersForThisTrigger);
        // this removes the event listners that we just removed from the list used by the cleanup.
        // No need to clean them up anymore.
        window[RULES_HANDLER_SINGLETON].eventListeners = window[RULES_HANDLER_SINGLETON]
          .eventListeners
          .filter(listener => !eventListenersForThisTrigger
            .some(eListener => eListener.id === listener.id)
          );

        // We recall this method without placing the vizs,
        // to replace the listeners on new elements that might have appeared.
        this.initEventHandler(rules, false);
      }, this.triggerEventListenerUpdateRate),
      id: timeoutId
    });
  }

  // returns a method to remove the element
  addViz(listener, elem) {
    if (listener.event && listener.event.includes && listener.event.includes('click')) {
      elem.classList.add('rw-cursor-pointer');
    }
    const vizRemoval = visualisationObject => () => {
      try {
        document.body.removeChild(visualisationObject);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    };
    if (listener.visualization === 'pulsating') {
      elem.classList.add('rw-pulsating');
      return () => elem.classList.remove('rw-pulsating');
    } else if (listener.visualization === 'questionMark') {
      const questionMark = document.createElement('img');
      questionMark.src = QuestionMark;
      document.body.appendChild(questionMark);
      questionMark.classList.add('rw-question-mark');
      this.placeQuestionMark(elem, questionMark);
      return vizRemoval(questionMark);
    } else if (listener.visualization === 'pulsatingDot') {
      const dot = document.createElement('div');
      document.body.appendChild(dot);
      dot.classList.add('rw-pulsating-dot');
      this.placeDot(elem, dot);
      return vizRemoval(dot);
    }
    return () => {};
  }

  placeDot(receptacle, dot) {
    const rect = receptacle.getBoundingClientRect();
    dot.setAttribute(
      'style',
      `top: ${rect.top + window.pageYOffset - 12}px; left: ${rect.right +
                window.pageXOffset -
                16}px`
    );
  }

  placeQuestionMark(receptacle, questionMark) {
    const rect = receptacle.getBoundingClientRect();
    questionMark.setAttribute(
      'style',
      `top: ${rect.top +
                (rect.bottom - rect.top) / 2 +
                window.pageYOffset -
                9}px; left: ${rect.right + window.pageXOffset + 5}px;`
    );
  }

  verifyMobile(trigger) {
    if (!trigger.device) return true;
    if (
      (/Mobi/.test(navigator.userAgent) && trigger.device === 'mobile') ||
            (!/Mobi/.test(navigator.userAgent) && trigger.device !== 'mobile')
    ) {
      return true;
    }
    return false;
  }

  // the times compared are in minute, Date gives milliseconds, so we do * 60 * 1000
  verifyTimeLimit(trigger, ruleTriggeredIndex) {
    if (!trigger.timeLimit) return true;
    if (
      !this.history.rulesTriggered[ruleTriggeredIndex].lastTimeTriggered ||
            (Date.now() -
                Date.parse(this.history.rulesTriggered[ruleTriggeredIndex].lastTimeTriggered)) /
                (60 * 1000) >
                trigger.timeLimit
    ) {
      return true;
    }
    return false;
  }

  verifyUrlSequence(trigger) {
    let sequenceMatched = true;
    // We first check that there is enough urls in the history to match the sequence to
    if (this.history.path.length >= trigger.url.length) {
      // we use that next line to start from the end of the history.
      let historyPosition = this.history.path.length - 1;
      trigger.url.forEach((triggerUrl, index) => {
        if (sequenceMatched === false || historyPosition < 0) return;
        const historyUrl = this.history.path[historyPosition];
        if (
          !RulesHandler.compareUrls(historyUrl, triggerUrl.path, triggerUrl.partialMatch)
        ) {
          // If the very first url in the history is wrong, no point in testing the rest.
          if (index === 0) {
            sequenceMatched = false;
            return;
          }
          let matchedTrigger = false;
          // we check that we only compare urls that are the same than the previous one.
          let matchedFirstAndLast = true;
          let tries = 0;
          while (matchedFirstAndLast && !matchedTrigger && historyPosition >= 0) {
            historyPosition -= 1;
            // we only check up to 8 urls before failing. This is 100% arbitrary.
            // We use that so that we don't compare every urls in a history
            // which could be very long.
            if (tries > 8) {
              sequenceMatched = false;
              break;
            }
            tries += 1;
            matchedTrigger = RulesHandler.compareUrls(
              this.history.path[historyPosition],
              triggerUrl.path,
              trigger.partialMatch
            );
            // We only check that one if the trigger url did not match.
            if (!matchedTrigger) {
              matchedFirstAndLast = RulesHandler.compareUrls(
                this.history.path[historyPosition],
                historyUrl
              );
            }
          }
          // we continue the process if we matched that url, if not,
          // the start of the forEach will stop the process.
          sequenceMatched = matchedTrigger;
        } else {
          // This means it matched first try, then we go down in the history
          historyPosition -= 1;
        }
      });
    } else {
      sequenceMatched = false;
    }
    return sequenceMatched;
  }

  // verifyUrl check that the url trigger is true
  // if its a string it checks if its the page we're currently on
  // if its an array, it checks that the user has been on every url mentionned in the array
  verifyUrl(trigger) {
    // rule is not defined
    if (!trigger.url) return true;

    let urlToUse = {};
    if (trigger.url && Array.isArray(trigger.url) && trigger.url.length === 1) {
      urlToUse = trigger.url[0];
    } else {
      urlToUse = trigger.url;
    }
    // one url
    if (typeof urlToUse === 'object' && typeof urlToUse.path === 'string') {
      return RulesHandler.compareUrls(this.url, urlToUse.path, urlToUse.partialMatch);
    }

    // multiple urls
    if (Array.isArray(urlToUse)) {
      if (trigger.urlIsSequence) {
        return this.verifyUrlSequence(trigger);
      }
      return urlToUse.every(url =>
        this.history.path.some(historyUrl =>
          RulesHandler.compareUrls(historyUrl, url.path, url.partialMatch)
        )
      );
    }

    return false;
  }

  static cleanURL(url) {
    const regexProtocolHostPort = /(https?:\/\/)?(([A-Za-z0-9-])+(\.?))+[a-z]+(:[0-9]+)?/;
    const regexLastTrailingSlash = /\/$|\/(?=\?)/;
    const regexQueryString = /\?.+$/;
    const cleanUrl = url
      .replace(regexProtocolHostPort, '')
      .replace(regexLastTrailingSlash, '')
      .replace(regexQueryString, '');
    return cleanUrl;
  }

  static compareUrls(urlWindow, urlCompare, partialMatch = false) {
    if (partialMatch) {
      return RulesHandler.cleanURL(urlWindow).includes(RulesHandler.cleanURL(urlCompare));
    }
    return RulesHandler.cleanURL(urlWindow) === RulesHandler.cleanURL(urlCompare);
  }

  // eslint-disable-next-line consistent-return
  verifyConditions(rules, boolMode, tooltipSelector = false, removeViz = () => {}) {
    const trigger = rules.trigger || {};
    const payload = {
      intent: rules.payload,
      text: rules.text,
      entities: []
    };

    let ruleTriggeredIndex = -1;

    if (trigger && (trigger.when === 'limited' || trigger.timeLimit)) {
      ruleTriggeredIndex = this.history.rulesTriggered.findIndex(
        rule => rule.hash === rules.hash
      );
    }

    const mobileCondition = this.verifyMobile(trigger);

    const urlCondition = this.verifyUrl(trigger);

    const triggerLimitCondition =
            !(trigger.triggerLimit && trigger.when === 'limited') ||
            this.history.rulesTriggered[ruleTriggeredIndex].triggered <
                this.history.rulesTriggered[ruleTriggeredIndex].triggerLimit;

    const timeLimitCondition = this.verifyTimeLimit(trigger, ruleTriggeredIndex);

    const numberOfPageVisitsCondition =
            !trigger.numberOfPageVisits ||
            (this.history.timePerPage[this.url] &&
                this.history.timePerPage[this.url] >= parseInt(trigger.numberOfPageVisits, 10));

    const queryString = window.location.search;
    const queryStringCondition =
            !trigger.queryString ||
            trigger.queryString.every(queryObject =>
              this.verifyQueryStringAndAddEntities(queryString, queryObject, payload)
            );

    if (
      urlCondition &&
            mobileCondition &&
            numberOfPageVisitsCondition &&
            triggerLimitCondition &&
            queryStringCondition &&
            timeLimitCondition &&
            (!trigger.numberOfVisits ||
                parseInt(trigger.numberOfVisits, 10) === parseInt(this.history.timesInDomain, 10))
    ) {
      if (boolMode) {
        return true;
      }
      this.sendMessage(payload, rules.trigger.when, tooltipSelector);
      if (ruleTriggeredIndex !== -1) {
        const triggered = this.history.rulesTriggered[ruleTriggeredIndex].triggered;
        this.history.rulesTriggered[ruleTriggeredIndex] = {
          ...this.history.rulesTriggered[ruleTriggeredIndex],
          triggered: triggered + 1,
          lastTimeTriggered: new Date()
        };
        if (triggered + 1 === trigger.triggerLimit) {
          removeViz();
        }
        this.storeHistory();
      }
    } else if (boolMode) {
      return false;
    }
  }

  // this checks that the query string is present, and adds it to the payload
  // that we're going to send if neccessary.
  verifyQueryStringAndAddEntities(encodedQueryString, queryObject, payload) {
    const queryStringJson = this.convertQueryStringToJson(encodedQueryString);
    const { param, value } = queryObject;
    if (!queryObject.sendAsEntity) {
      return queryStringJson[param] && queryStringJson[param] === value;
    }
    if (queryStringJson[param]) {
      payload.entities.push({
        entity: queryObject.param,
        value: queryStringJson[param]
      });
      return true;
    }
    return false;
  }

  convertQueryStringToJson(query = window.location.search) {
    return query
      .replace(/^\?/, '')
      .split('&')
      .reduce((json, item) => {
        if (item) {
          item = item.split('=').map(value => decodeURIComponent(value));
          json[item[0]] = item[1];
        }
        return json;
      }, {});
  }

  sendMessage(payload, when = 'always', tooltipSelector = false) {
    if (payload.intent) {
      let entities = '';
      payload.entities.forEach((entity, index) => {
        const ent = `"${entity.entity}":"${entity.value}"${
          index === payload.entities.length - 1 ? '' : ','
        }`;
        entities += ent;
      });
      const sentPayload = `${payload.intent}{${entities}}`;
      const whenToSend = when === 'limited' ? 'always' : when;
      if (payload.text) {
        this.sendMethod(sentPayload, payload.text, whenToSend, tooltipSelector);
      } else {
        this.sendMethod(sentPayload, undefined, whenToSend, tooltipSelector);
      }
    } else {
      // eslint-disable-next-line no-console
      console.log('You forgot to give a payload to your ruleset.');
    }
  }

  storeHistory(url) {
    if (this.history && this.history.lastTimeInDomain) {
      // https://stackoverflow.com/questions/12661293/save-and-load-date-localstorage
      // This is why we parse the date stored in localStorage
      const timeSinceLastSession = Date.now() - Date.parse(this.history.lastTimeInDomain);
      const minutesSinceLastSession = timeSinceLastSession / (60 * 1000);
      if (minutesSinceLastSession > 30) {
        this.history.timesInDomain =
                    this.history && this.history.timesInDomain ? this.history.timesInDomain + 1 : 1;
        this.history.path = [];
      }
    }
    if (url) this.history.path.push(url);
    localStorage.setItem(
      LOCAL_STORAGE_ACCESS_STRING,
      JSON.stringify({
        path: this.history.path,
        lastTimeInDomain: new Date(),
        timesInDomain: (this.history && this.history.timesInDomain) || 1,
        timePerPage: this.history.timePerPage,
        rulesTriggered: this.history.rulesTriggered
      })
    );
  }

  fetchHistory() {
    const storageHistory = localStorage.getItem(LOCAL_STORAGE_ACCESS_STRING);
    this.history = storageHistory ? JSON.parse(storageHistory) : {};
    if (!this.history.path) this.history.path = [];
    if (!this.history.timePerPage) this.history.timePerPage = {};
    if (!this.history.rulesTriggered) this.history.rulesTriggered = [];
  }

  // clean up the timeOnPage timeouts to prevent leaks
  cleanUp(alsoClearWindowEventListners = false) {
    RulesHandler.removeEventListeners(this.eventListeners);
    if (alsoClearWindowEventListners) {
      window.removeEventListener('popstate', this.popstateCallback);
      window.removeEventListener('locationchange', this.locationChangeCallback);
    }
    this.timeoutIds.forEach((id) => {
      clearTimeout(id);
    });
    this.resetListenersTimeouts.forEach(({ timeout }) => {
      clearTimeout(timeout);
    });
  }
}
