function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import * as redux from 'redux';
var store;

var reducer = function reducer(stateName, defaultState) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
    var action = arguments.length > 1 ? arguments[1] : undefined;

    switch (action.type) {
      case stateName:
        return action.state;

      default:
        return state;
    }
  };
};

export var reducerBuilder = function reducerBuilder(obj) {
  var states = _objectSpread({}, obj);

  var reducers = {};

  for (var stateName in states) {
    var defaultStateValue = states[stateName];
    reducers[stateName] = reducer(stateName, defaultStateValue);
  }

  return redux.combineReducers(reducers);
};
export var createStore = function createStore() {
  var arg = arguments;
  arg[0] = reducerBuilder(arg[0]);
  store = redux.createStore.apply(redux, _toConsumableArray(arg));
  return store;
};
export var setStore = function setStore(param, value) {
  if (typeof param === 'string') {
    return store.dispatch({
      type: param,
      state: value
    });
  } else {
    var prms = [];

    for (var stateName in param) {
      var stateValue = param[stateName],
          dispatchResult = store.dispatch({
        type: stateName,
        state: stateValue
      });
      prms.push(dispatchResult);
    }

    return Promise.all(prms);
  }
};
export var getStore = function getStore(stateName) {
  var storeState = store.getState();
  return typeof stateName === 'undefined' ? storeState : storeState[stateName];
};
