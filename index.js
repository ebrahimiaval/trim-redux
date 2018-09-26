'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getStore = exports.setStore = exports.newCreateStore = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
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


var _redux = require('redux');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// the store object holder
var store;

/**
 * raducer builder
 * get an object and convert to raducer and at end combine with combineReducers
 *
 * @param obj<object>. list of state with default value. like: {stateOne: 'value one', stateTwo: 'value two'}
 * @returns {Reducer<any>} : redux combineReducers() result
 */
var raducerBuilder = function raducerBuilder(obj) {
    //copy for fix conflict
    var itmes = _extends({}, obj);

    // conver state object to reducer functions
    for (var key in itmes) {
        itmes[key] = function () {
            var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : itmes[key];
            var action = arguments[1];

            switch (action.type) {
                case stateName:
                    return action.state;
                default:
                    return state;
            }
            return action.type === key ? action.state : state;
        };
    } // combine reducers
    return (0, _redux.combineReducers)(itmes);
};

/**
 * # create redux store
 *
 * @param state : json object (REQUIRE). an object for first define state.
 * default value of state is value of this property value. like : { user: null, payCount: 0 }
 * @param [options] : the redux createStore() method options
 * @returns: redux store object (equal return of redux createStore() method)
 */
var newCreateStore = exports.newCreateStore = function newCreateStore() {
    // get arguments
    var arg = arguments;

    // convert state objeect to reducer
    arg[0] = raducerBuilder(arg[0]);

    // create redux store
    store = _redux.createStore.apply(undefined, _toConsumableArray(arg));

    // // rewrite replaceReducer
    // store.replaceReducer = function (state) {
    //     return store.replaceReducer(raducerBuilder(state));
    // }

    return store;
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
 * @param [param<any>] name of state in store.
 * @param [stateData<any>] value of defined state in first parameter
 */
var setStore = exports.setStore = function setStore(param, value) {
    if (typeof param === 'string') {
        // -- set one state --
        return store.dispatch({
            type: param,
            state: value
        });
    } else {
        // -- set multi state --
        // when stateName is object like { a: 'b' } then run dispatch for all object property
        var prms = [];
        for (var key in param) {
            prms.push(store.dispatch({
                type: key,
                state: param[key]
            }));
        } //
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
var getStore = exports.getStore = function getStore(stateName) {
    var storeState = store.getState();
    return typeof stateName === 'undefined' ? storeState : storeState[stateName];
};