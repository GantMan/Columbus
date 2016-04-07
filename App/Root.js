import React, { View, Text, Navigator, StatusBar, NavigationExperimental } from 'react-native'
import {Router, Routes, NavigationBar} from './Navigation/'
import configureStore from './Store/Store'
import { Provider } from 'react-redux'
import Actions from './Actions/Creators'
import Drawer from 'react-native-drawer'

import LoginScreen from './Containers/LoginScreen'

// Styles
import styles from './Containers/Styles/RootStyle'

const {
  CardStack: NavigationCardStack,
  StateUtils: NavigationStateUtils,
  Header: NavigationHeader,
  RootContainer: NavigationRootContainer
} = NavigationExperimental

const store = configureStore()

function createReducer(initialState) {
  return (currentState, action) => {
    switch (action.type) {
      case 'RootContainerInitialAction':
        return initialState

      case 'push':
        return NavigationStateUtils.push(currentState, {key: action.key})

      case 'back':
      case 'pop':
        return currentState.index > 0 ?
          NavigationStateUtils.pop(currentState) :
          currentState

      default:
        return currentState
    }
  }
}

const ExampleReducer = createReducer({
  index: 0,
  key: 'exmaple',
  children: [{key: 'First Route'}],
})

export default class RNBase extends React.Component {

  componentWillMount () {
    const { dispatch } = store
    dispatch(Actions.startup())

    this._renderHeader = this._renderHeader.bind(this)
  }

  componentDidMount () {
    //this.navigator.drawer = this.drawer
  }

  renderDrawerContent () {
    return (
      <View style={{marginTop: 30, padding: 10}}>
        <Text>
          Drawer Content
        </Text>
      </View>
    )
  }

  _renderHeader (props) {
    console.log('HEY FUCKERS', props)
    return (
      <NavigationHeader
        navigationProps={props}
        renderTitleComponent={this._renderTitleComponent}
      />
    )
  }

  _renderTitleComponent (props) {
    return (
      <NavigationHeader.Title>
        TACO
      </NavigationHeader.Title>
    )
  }

  renderApp () {
    return (
      <Provider store={store}>
        <View style={styles.applicationView}>
          <StatusBar
            barStyle='light-content'
          />
          <Drawer
            ref={(ref) => { this.drawer = ref }}
            content={this.renderDrawerContent()}
            style={styles.drawer}
            openDrawerOffset={100}
            type='static'
            tapToClose
          >
            <NavigationRootContainer
              reducer={ExampleReducer}
              renderNavigation={(navState, onNavigate) =>
                <NavigationCardStack
                  renderScene={(props) =>
                    <LoginScreen/>
                  }
                  onNavigate={(action) => window.alert('onNavigate')}
                  renderOverlay={this._renderHeader}
                  navigationState={{
                    key: 'MyPetStack',
                    index: 2,
                    children: [
                      {key: 'Pluto', species: 'dog'},
                      {key: 'Snoopy', species: 'dog'},
                      {key: 'Garfield', species: 'cat'}
                    ]
                  }}
                />
              }
              style={styles.main}
            />
          </Drawer>
        </View>
      </Provider>
    )
  }

  render () {
    return this.renderApp.bind(this)()
  }
}
