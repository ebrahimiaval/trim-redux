'use strict';

var _redux = require('redux');

var _redux2 = _interopRequireDefault(_redux);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// the store object holder
var store;

/**
 * copining an object
 * @type {((url: string) => void) | Function}
 * @private
 */
/**
 *  trim-redux @ not repeat code! Put your time on develop.
 *
 *  A tool to simplify work with the Redux in Reactjs
 *  * remove action and reducer from develop process
 *  * replace createStore()
 *  * provide setStore() method with behavior like React setState() for update state value.
 *  * provide getStore() for get direct store state
 *
 *  developer
 *  * Mohammad Ebrahimi Aval
 *  * m.ebrahimiaval@gmail.com
 *  * ebrahimiaval.ir
 *
 *  dependence
 *  * redux
 */
var extendObject = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
};

/**
 *  ## raducer builder
 *  build and return a raducer function
 *
 * @param stateName
 * @param defaultState
 * @returns {function(*=, *)}
 */
var reducer = function reducer(stateName, defaultState) {
    return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
        var action = arguments[1];

        switch (action.type) {
            case stateName:
                return action.state;
            default:
                return state;
        }
    };
};

/**
 * state Maker
 * work like combineReducers. get reducers and return combineded reducer object.
 *
 * @param obj: object, like component state
 * @returns {Reducer<any>} : redux combineReducers()
 */
var stateMaker = function stateMaker(obj) {
    //copy for fix conflict
    var raducers = extendObject({}, obj);

    // conver state object to reducers functions
    for (var key in raducers) {
        raducers[key] = reducer(key, raducers[key]);
    } // combine reducers
    return _redux2.default.combineReducers(raducers);
};

/**
 * # create redux store
 *
 * @param state : json object (REQUIRE). an object for first define state.
 * default value of state is value of this property value. like : { user: null, payCount: 0 }
 * @param [options] : the redux createStore() method options
 * @returns: redux store object (equal return of redux createStore() method)
 */
var createStore = function createStore() {
    // get arguments
    var arg = arguments;

    // convert state objeect to reducer
    arg[0] = stateMaker(arg[0]);

    // create redux store
    store = _redux2.default.createStore.apply(this, arg);

    // rewrite replaceReducer
    store.replaceReducer = function (state) {
        return store.replaceReducer(stateMaker(state));
    };

    return store;
};

/**
 * # dispatch Store state
 *  run redxu dispatch method for set new value of state and update all connected component
 *
 * @param [stateName] : string. name of state in store.
 * @param [stateData<any>]  value of defined state in first parameter
 */
var dispatchStore = function dispatchStore(stateName, stateData) {
    return store.dispatch({
        type: stateName,
        state: stateData
    });
};

/**
 *
 *  buid action and run store.dispatch to set value of Redux store states
 */
/**
 * ## set store state
 * set value of state in redux store WITH two way binding
 *
 * Have 2 way usage
 * 1) pass an object and work with it like React setState(). like: setStore({ age: 20 })
 * 2) set state value directly with pass name of state as string in first parameter
 * and value of it in second parameter. like: setStore('age',20)
 *
 * @param [stateName<any>] name of state in store.
 * @param [stateData<any>] value of defined state in first parameter
 */
var setStore = function setStore(stateName, stateData) {
    if (typeof stateName === 'string') {
        return dispatchStore(stateName, stateData);
    } else {
        // when stateName is object like { a: 'b' }
        // then run dispatch for all object property
        var stateObj = stateName;
        var prms = [];
        for (var key in stateObj) {
            prms.push(dispatchStore(key, stateObj[key]));
        }
        return Promise.all(prms);
    }
};

/**
 * ## get store state
 * get value of state in redux store WITH OUT two way binding
 *
 * Have 2 way usage
 * 1) get all state (store object) and access to state with chain. like: getStore().user.name
 * 2) get state directly by pass state name as string. like: getStore('user').name
 *
 * NOTICE:
 *  if use need to get value of state with out two way binding use getStore()
 *  else use connect()() method of react-redux with mapStateToProps.
 *
 * @param [stateName] name of state in state. like: 'user'
 */
var getStore = function getStore(stateName) {
    if (typeof stateName === 'undefined') return store.getState();else return store.getState()[stateName];
};

// export methods
module.exports = {
    getStore: getStore,
    setStore: setStore,
    createStore: createStore
};