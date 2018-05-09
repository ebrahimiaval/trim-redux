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
var redux = require('redux');

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
const reducer = (stateName, defaultState) => {
    return (state = defaultState, action) => {
        switch (action.type) {
            case stateName:
                return action.state;
            default:
                return state;
        }
    }
}





/**
 * state Maker
 * work like combineReducers. get reducers and return combineded reducer object.
 *
 * @param obj: object, like component state
 * @returns {Reducer<any>} : redux combineReducers()
 */
const stateMaker = (obj) => {
    for (var key in obj) {
        obj[key] = reducer(key, obj[key]);
    }
    return redux.combineReducers(obj);
}





/**
 * # create redux store
 *
 * @param state : json object (REQUIRE). an object for first define state.
 * default value of state is value of this property value. like : { user: null, payCount: 0 }
 * @param [options] : the redux createStore() method options
 * @returns: redux store object (equal return of redux createStore() method)
 */
const createStore = (state, options) => {
    store = redux.createStore(stateMaker(state), options);
    return store;
};





/**
 * # dispatch Store state
 *  run redxu dispatch method for set new value of state and update all connected component
 *
 * @param [stateName] : string. name of state in store.
 * @param [stateData] : any type. value of defined state in first parameter
 */
const dispatchStore = (stateName, stateData) => {
    store.dispatch({
        type: stateName,
        state: stateData
    });
}





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
 * @param [stateName] : string. name of state in store.
 * @param [stateData] : any type. value of defined state in first parameter
 */
const setStore = (stateName, stateData) => {
    if (typeof stateName === 'string') {
        dispatchStore(stateName, stateData);
    } else {
        // when stateName is object like { a: 'b' }
        // then run dispatch for all object property
        const stateObj = stateName;
        for (var key in stateObj) {
            dispatchStore(key, stateObj[key]);
        }
    }
}





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
 * @param [stateName] : string, name of state in state. like: 'user'
 */
const getStore = (stateName) => {
    if (typeof stateName === 'undefined')
        return store.getState();
    else
        return store.getState()[stateName];
}





// export methods
module.exports = {
    getStore: getStore,
    setStore: setStore,
    createStore: createStore
};
