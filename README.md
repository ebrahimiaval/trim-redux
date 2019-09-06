# trim-redux
[Persian Documentary of Trim-Redux](http://vrgl.ir/TQItJ)

trim-redux is a tool for work simplify with the Redux in Reactjs. 
trim-redux removed reducer, combineReducer and action in redux usage process  
and let you work with redux like react component state!

use setStore() method for set new value of redux store state 
[ work with it like React setState() method ], and use getStore() for get value of redux store state.

## install 
``npm i trim-redux ``

## 1) methods

### 1-1) createStore( stateObject , [options] )
create a redux store like createStore() method in Redux but the difference is that, 
in redux createStore you must pass combineReducer result and in trim-redux you pass an
normal json object for set initial definition.
(Like the react state initial definition).
 
#### params
 
@firstParam state : json object (REQUIRE). an object for first define state.
default state value is the value of property. 

exp: { user: null, payCount: 0 }

@secondParam [options] : the redux createStore() method options

@returns: redux store object (equal return of Redux createStore() method)

```js
import {createStore} from 'trim-redux'

// . . . . in store.js file . . .

const state = {
    age : 0 // first value (default value)
}

export const store = createStore(state); 

```





### 1-2) setStore( [stateName] , [stateData] )
set value of state in redux store WITH two way binding

##### Have 2 way usage

1) pass an object and work with it like React setState(). exp: setStore({ age: 20 })
2) set state value directly with pass name of state as string in first parameter
and value of it in second parameter. exp: setStore('age',20)

##### params

@firstParam [stateName] : string. name of state in store.

@secondParam [stateData] : any type. value of defined state in first parameter

##### example

```js
import {setStore} from 'trim-redux'

// . . .  in react component  . . .  

componentDidMount(){
    setStore({
        age: 20
    })
}
```






### 1-3) getStore( [stateName])
get value of state in redux store WITH OUT two way binding

##### Have 2 way usag
 
1) get all state (store object) and access to state with chain. like: getStore().user.name
2) get state directly by pass state name as string. like: getStore('user').name

NOTICE:
 if you need to get value of state with out two way binding use getStore()
 else use connect()() method of react-redux with mapStateToProps.
 
 ##### params
 
 @firstParam [stateName] : string, name of state in state. like: 'user'
cls

@returns: state object || state vlaue. when pass param get the vlaue of passed state else get state object (contain all state value). 

```js
import {getStore} from 'trim-redux'

// . . .  in react component  . . .  
render(){
    const age = getStore().age;
    
    console.log(age);
}
```



## 2) FAQ

#### 2-1) where is reducer and action?

we change structrue and remove this meanings of redux for convenience of working with Redux in react.
when you pass an state object to createStore() method we build reducer with reducerBuilder and combine with
combineReducer() method and build store with redux combineReducer().

so you do not need write reducer and this mean you do not need write action and also dont need 
 write mapDispatchToProps!

#### 2-2) how to write common operation (function, action or method) for state?

 this is simple!
 
when an state change (setStore) in one place but use in multi place you do not need write 
 action. you should write action and setStore locally like work with react setState().

when an state change in multi place and use in one place (or multi place) you need write independent
action. for do this, you can create an action directory in /src directory and create an action.js ( or indepented for each actions ) and
write the action and import in components. (if the state change place is on a one component can write the action as a component method).

###### example:

in '~/src/action/action.js'
```js
import {setStore} from 'trim-redux';

export const setAge = (age) =>{
    
    if (age < 18)
        setStore("age", age);
    else
        alert("inserted age is not vaild!");
}

```

in React component like '~/src/app/app.js'
```js
import React, { Component } from 'react';
import {setAge} from '../action/action.js';


export default class App extends Component {
    
  componentDidMount() {
      setAge(this.props.age)
  }
    
    render() { return ".. some value ..";  }
}
```


## License

MIT