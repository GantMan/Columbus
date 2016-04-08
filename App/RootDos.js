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
  Header: NavigationHeader,
  RootContainer: NavigationRootContainer
} = NavigationExperimental

const {store, rootReducer} = configureStore()
console.log(rootReducer)

export default class RNBase extends React.Component {

  componentWillMount () {
    const { dispatch } = store
    dispatch(Actions.startup())

    this._renderHeader = this._renderHeader.bind(this)
  }

  componentDidMount () {
    // this.navigator.drawer = this.drawer
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
        renderRightComponent={(props) => <Text>{new Date().getSeconds()}</Text>}
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
            barStyle='dark-content'
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
              reducer={rootReducer}
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
