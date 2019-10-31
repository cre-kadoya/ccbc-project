import React, { Component } from 'react'
import { createStackNavigator, createAppContainer } from 'react-navigation'

// テスト用メニュー画面
import MenuForm from './view/Menu'
// ログイン機能
import LoginGroupForm from './view/LoginGroup'
import LoginForm from './view/Login'
// ホーム機能
import HomeForm from './view/Home'
import KokokuForm from './view/kokoku'
import OshiraseForm from './view/oshirase'
import OshiraseShosaiForm from './view/oshirase2'
import SaishinKijiForm from './view/saishinKiji'
import NinkiKijiForm from './view/ninkiKiji'
// チャット機能
import ChatSelectForm from './view/chat_select'
import ChatMsgForm from './view/chat_msg'
import ChatCoinForm from './view/chat_coin'
// 記事機能
import ArticleForm from './view/Article'
// ショッピング機能
import ShoppingForm from './view/shopping'

/******* Navigator *******/

var HomeNavigator = createStackNavigator(
  {
    Menu: { screen: MenuForm },
    LoginGroup: { screen: LoginGroupForm },
    Login: { screen: LoginForm },
    Home: { screen: HomeForm },
    Kokoku: { screen: KokokuForm },
    Oshirase: { screen: OshiraseForm },
    OshiraseShosai: { screen: OshiraseShosaiForm },
    SaishinKiji: { screen: SaishinKijiForm },
    NinkiKiji: { screen: NinkiKijiForm },
    ChatSelect: { screen: ChatSelectForm },
    ChatMsg: { screen: ChatMsgForm },
    ChatCoin: { screen: ChatCoinForm },
    Article: { screen: ArticleForm },
    Shopping: { screen: ShoppingForm },
  },
  {
    initialRouteName: 'Menu',
    //initialRouteName: 'LoginGroup',
    defaultNavigationOptions: () => ({
      header: null
    })
  }
)

const AppContainer = createAppContainer(HomeNavigator)

/**************/

export default class App extends Component {
  state = {
    saveFlg: false
  }

  async componentWillMount() {
    var groupInfo = await this.getGroupInfo()
    if (groupInfo != null) {
      this.setState({ saveFlg: groupInfo['saveFlg'] })
    }
  }

  getGroupInfo = async () => {
    try {
      return JSON.parse(await AsyncStorage.getItem('groupInfo'))
    } catch (error) {
      return
    }
  }

  render() {
    return (
      <AppContainer
        ref={nav => {
          this.navigator = nav
        }}
      />
    )
  }
}
