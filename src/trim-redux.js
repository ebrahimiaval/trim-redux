/**
 *  trim-redux
 *  not repeat code, Put your time on develop!
 *
 *  A tool to simplify work with the Redux in Reactjs
 *  * remove action and reducer from develop process
 *  * replace createStore()
 *  * provide setStore() method with behavior like React setState() for update state value.
 *  * provide getStore() for get direct store state
 *
 *  dependence
 *  * redux
 */
import * as redux from 'redux';
import {connect, Provider} from 'react-redux';

// the store object holder
var store;




/**
 *  ## reducer builder
 *  build and return a reducer function
 *
 * @param stateName
 * @param defaultState
 * @returns {function(*=, *)}
 */
const reducer = function reducer(stateName, defaultState) {
    return function (state = defaultState, action) {
        switch (action.type) {
            case stateName:
                return action.state;
            default:
                return state;
        }
    };
};




/**
 * reducer builder
 * get an object and convert to reducer and at end combine with combineReducers
 *
 * @param obj<object>. list of state with default value. like: {stateOne: 'value one', stateTwo: 'value two'}
 * @returns {Reducer<any>} : redux combineReducers() result
 */
const reducerBuilder = function (obj) {
    //copy for fix conflict
    const states = {...obj};
    let reducers = {};

    // conver state object to reducer functions
    for (let stateName in states) {
        const defaultStateValue = states[stateName];
        reducers[stateName] = reducer(stateName, defaultStateValue);
    }

    // combine reducers
    return redux.combineReducers(reducers);
};





/**
 * # create redux store
 *
 * @param state {object}(REQUIRE): an object for first define state.
 * default value of state is value of this property value. ( exp: { user: null, payCount: 0 } )
 * @param [options] : the redux createStore() method options
 * @returns: redux store object (equal return of redux createStore() method)
 */
const createStore = function () {
    // get arguments
    let arg = arguments;

    // convert state objeect to reducer
    arg[0] = reducerBuilder(arg[0]);

    // create redux store
    store = redux.createStore(...arg);

    return store;
};





/**
 * ## set store state value
 * set value of state in redux store
 *
 * Have 2 way usage
 * 1) pass an object and work with it like React setState().
 * 2) set state value directly with pass name of state as string in first parameter
 * and value of it in second parameter.
 *
 * @param param {string | object}:
 *          string: name of state and value is require. ( exp: setStore('age',20) )
 *          object: an object like React setState method parameter. ( exp: setStore({ age: 20 }) )
 * @param stateData {any}: value of 'param' state.
 * @returns {Promise}
 */
const setStore = function setStore(param, value) {
    if (typeof param === 'string') {
        /** set one state value **/
        // param is stateName and value is stateValue
        return store.dispatch({type: param, state: value});
    } else {
        /** set multi state value **/
            // when stateName is object like { a: 'b' } then run dispatch for all object property
        let prms = [];
        for (let stateName in param) {
            const
                // new vlaue of state with 'stateName' name.
                stateValue = param[stateName],
                // dispatching state
                dispatchResult = store.dispatch({type: stateName, state: stateValue});

            // push dispatch promise to promise list
            prms.push(dispatchResult);
        }
        //
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
 *  if you need to get value of state with out two way binding use getStore()
 *  else use connect()() method of react-redux with mapStateToProps.
 *
 * @param stateName {string | undefined}:
 *           string: name of redux state. ( exp: 'user' )
 *           undefined:
 * @returns {any}: value of an state or return an object of states value.
 */
const getStore = function getStore(stateName) {
    const storeState = store.getState();
    return (typeof stateName === 'undefined') ? storeState : storeState[stateName];
};



/**
 * export method
 */
export {getStore, setStore, createStore, reducerBuilder, connect, Provider};
