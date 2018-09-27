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
import * as redux from 'redux';

// the store object holder
var store;




/**
 *  ## raducer builder
 *  build and return a raducer function
 *
 * @param stateName
 * @param defaultState
 * @returns {function(*=, *)}
 */
var reducer = function reducer(stateName, defaultState) {
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
 * raducer builder
 * get an object and convert to raducer and at end combine with combineReducers
 *
 * @param obj<object>. list of state with default value. like: {stateOne: 'value one', stateTwo: 'value two'}
 * @returns {Reducer<any>} : redux combineReducers() result
 */
export const raducerBuilder = function (obj) {
    //copy for fix conflict
    const states = {...obj};
    let raducers = {};

    // conver state object to reducer functions
    for (let stateName in states) {
        const defaultStateValue = states[stateName];
        raducers[stateName] = reducer(stateName, defaultStateValue);
    }

    // combine reducers
    return redux.combineReducers(raducers);
};





/**
 * # create redux store
 *
 * @param state : json object (REQUIRE). an object for first define state.
 * default value of state is value of this property value. like : { user: null, payCount: 0 }
 * @param [options] : the redux createStore() method options
 * @returns: redux store object (equal return of redux createStore() method)
 */
export const createStore = function () {
    // get arguments
    let arg = arguments;

    // convert state objeect to reducer
    arg[0] = raducerBuilder(arg[0]);

    // create redux store
    store = redux.createStore(...arg);

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
export const setStore = function setStore(param, value) {
    if (typeof param === 'string') {
        /** set one state value **/
        // param is stateName and value is stateValue
        return store.dispatch({type: param, state: value});
    }
    else {
        /** set multi state value **/
            // when stateName is object like { a: 'b' } then run dispatch for all object property
        var prms = [];
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
 *  if use need to get value of state with out two way binding use getStore()
 *  else use connect()() method of react-redux with mapStateToProps.
 *
 * @param [stateName] name of state in state. like: 'user'
 */
export const getStore = function getStore(stateName) {
    const storeState = store.getState();
    return (typeof stateName === 'undefined') ? storeState : storeState[stateName];
};

