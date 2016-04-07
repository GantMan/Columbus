import React, { View, Text, Navigator, StatusBar, NavigationExperimental } from 'react-native'
import {Router, Routes, NavigationBar} from './Navigation/'
import configureStore from './Store/Store'
import { Provider } from 'react-redux'
import Actions from './Actions/Creators'
import Drawer from 'react-native-drawer'

import LoginScreen from './Containers/LoginScreen'

// Styles
import styles from './Containers/Styles/RootStyle'

import NavigationContainer from 'NavigationContainer'

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
  children: [{key: 'Taco Route'}]
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
        {props.scene.navigationState.key}
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
                    <LoginScreen
                      onNavigate={onNavigate}
                    />
                  }
                  onNavigate={(action) => {
                    // called from only some navigation items
                    if (action && action.type === 'BackAction') {
                      onNavigate({
                        type: 'pop'
                      })
                    }
                  }}
                  renderOverlay={this._renderHeader}
                  navigationState={navState}
                />
              }
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
