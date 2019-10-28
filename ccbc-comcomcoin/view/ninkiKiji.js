import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Image,
  AsyncStorage,
  Text,
  ScrollView
} from 'react-native'
import {
  Header,
  Button,
  Icon,
  Avatar,
  Card,
  ListItem
} from 'react-native-elements'

const users = [
  {
    main: 'リーダーコンピテンシー開催案内',
    sub: '#研修, #案内',
    avatar: require('./../images/man3.jpg'),
    cnt: '11いいね!'
  },
  {
    main: '夏キャンプのお知らせ',
    sub: '#アウトドア, #案内',
    avatar: require('./../images/man7.jpg'),
    cnt: '9いいね!'
  },
  {
    main: '第三回マラソン大会開催案内',
    sub: '#スポーツ',
    avatar: require('./../images/man1.jpg'),
    cnt: '7いいね!'
  },
  {
    main: '7月の北海道の天気',
    sub: '#天気',
    avatar: require('./../images/woman2.jpg'),
    cnt: '6いいね!'
  },
  {
    main: '6月おすすめの本',
    sub: '#本',
    avatar: require('./../images/man5.jpg'),
    cnt: '5いいね!'
  },
  {
    main: '今日の献立',
    sub: '#料理',
    avatar: require('./../images/woman3.jpg'),
    cnt: '3いいね!'
  },
  {
    main: '今日のプログラミング講座',
    sub: '#プログラミング',
    avatar: require('./../images/man2.jpg'),
    cnt: '1いいね!'
  },
  {
    main: '6/16の天気',
    sub: '#天気',
    avatar: require('./../images/woman1.jpg'),
    cnt: '1いいね!'
  },
  {
    main: 'ブロックチェーン勉強会について',
    sub: '#研修',
    avatar: require('./../images/man6.jpg'),
    cnt: '1いいね!'
  },
  {
    main: '石垣の一言',
    sub: '#その他',
    avatar: require('./../images/man4.jpg'),
    cnt: '0いいね!'
  },
  {
    main: '今日のポエム from Nakayama',
    sub: '#その他',
    avatar: require('./../images/woman4.jpg'),
    cnt: '0いいね!'
  },
  {
    main: '江別の謎',
    sub: '#その他',
    avatar: require('./../images/man8.jpg'),
    cnt: '0いいね!'
  }
]

export default class ChatSelectForm extends Component {
  state = {
    open: false,
    open2: false,
    anchor: 'left',
    activeStep1: {},
    activeStep2: {},
    activeStep3: {},
    activeStep4: {},
    activeStep5: {},
    completed: {},
    comment: {},
    coin: 0,
    tohyoCoin: 0,
    headList: [],
    resultList: [],
    userid: null,
    password: null,
    tShainPk: 0,
    imageFileName: null,
    shimei: null,
    kengenCd: null,
    configCoin: 0
  }
  constructor(props) {
    super(props)
    this.state = {}
  }
  /** コンポーネントのマウント時処理 */
  async componentWillMount() {}

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftComponent={
            <Icon
              name={'chevron-left'}
              type={'font-awesome'}
              color="#fff"
              onPress={this.onPressMenuButton}
            />
          }
          centerComponent={
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 24,
                    color: '#FFFFFF',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  人気の記事
                </Text>
              </View>
            </View>
          }
          backgroundColor="#ff5622"
          // style={styles.header}
        />
        <ScrollView>
          <Card containerStyle={{ padding: 0 }}>
            {users.map((u, i) => {
              return (
                <ListItem
                  key={i}
                  roundAvatar
                  title={u.main}
                  titleStyle={{ fontSize: 20 }}
                  subtitle={u.sub}
                  avatar={u.avatar}
                  badge={{
                    value: u.cnt
                    // textStyle: { color: 'orange' }
                  }}
                />
              )
            })}
          </Card>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF'
  },
  header: {},
  menu_item: {
    flexDirection: 'row',
    marginTop: 30,
    marginLeft: 30,
    marginRight: 30
  },
  menu_icon: {
    width: 50,
    height: 50
  },
  menu_button: {},
  menu_icon_view: {},
  menu_button_view: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10
  }
})
