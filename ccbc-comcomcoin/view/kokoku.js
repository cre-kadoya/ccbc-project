import React, { Component } from 'react'
import { StyleSheet, View, Image, AsyncStorage, ScrollView } from 'react-native'
import {
  Header,
  Button,
  Icon,
  Avatar,
  Card,
  Text,
  ListItem
} from 'react-native-elements'

const users = [
  {
    name: '安倍　大翔',
    avatar: require('./../images/man1.jpg'),
    cnt: 1
  },
  {
    name: '伊藤　俊介',
    avatar: require('./../images/man2.jpg'),
    cnt: 9
  },
  {
    name: '牛込　達也',
    avatar: require('./../images/man3.jpg'),
    cnt: 0
  },
  {
    name: '江藤　蓮',
    avatar: require('./../images/man4.jpg'),
    cnt: 3
  },
  {
    name: '織田　結月',
    avatar: require('./../images/woman1.jpg'),
    cnt: 2
  },
  {
    name: '小川　結愛',
    avatar: require('./../images/woman2.jpg'),
    cnt: 2
  },
  {
    name: '佐藤　結菜',
    avatar: require('./../images/woman3.jpg'),
    cnt: 6
  },
  {
    name: '島崎　杏',
    avatar: require('./../images/woman4.jpg'),
    cnt: 2
  },
  {
    name: '須藤　陽翔',
    avatar: require('./../images/man5.jpg'),
    cnt: 0
  },
  {
    name: '瀬川　大和',
    avatar: require('./../images/man6.jpg'),
    cnt: 0
  },
  {
    name: '曽我　湊',
    avatar: require('./../images/man7.jpg'),
    cnt: 1
  },
  {
    name: '西村　新',
    avatar: require('./../images/man8.jpg'),
    cnt: 0
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
                  広告
                </Text>
              </View>
            </View>
          }
          backgroundColor="#ff5622"
          // style={styles.header}
        />
        <ScrollView>
          <View
            style={{
              //flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Image
              // style={{
              //   height: 185,
              //   width: 350
              // }}
              resizeMode="contain"
              flexDirection="row"
              alignItems="center"
              source={require('./../images/CONSADOLE.png')}
            />
          </View>
          <View>
            <Text style={{ fontSize: 18 }}>
              {'\n'}サッカーＪ１　コンサドーレ札幌の観戦案内です。
              {'\n'}■8月10日（土）14:00キックオフ　vs 浦和レッズ
              {'\n'}■8月24日（土）13:00キックオフ　vs FC東京
              {'\n'}場所はいずれも札幌ドーム。
              {'\n'}チケットは「浦和レッズ戦　7枚」「FC東京戦　7枚」です。{'\n'}
              {'\n'}観戦を希望される方は、三上まで連絡ください。
              {'\n'}※締め切りは、6月19日（水）17時。
              {'\n'}
              ※締め切りは上記の通りですが、チケットの数に限りがあることと、観戦当日までの段取りの調整を鑑み、早めの連絡をお願いいたします。
              {'\n'}
              {'\n'}
              ご存知の通り、今年度から弊社はコンサドーレ札幌のサポートシップ・パートナーとなりました。
              {'\n'}
              5月4日のヴィッセル神戸戦を観戦したメンバーから好評をいただき、サッカーを知らない人でも楽しめたようです。
              {'\n'}
              {'\n'}
              みなさん、北海道のプロスポーツを応援し、北海道を元気にしましょう！
            </Text>
          </View>
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
