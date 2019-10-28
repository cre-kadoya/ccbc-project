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
                  お知らせ
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
            <Text style={{ fontSize: 22 }}>2019.03.15</Text>
          </View>
          <View>
            <Text style={{ fontSize: 18 }}>
              HARVESTに関するプレスリリースしました。{'\n'}
              {'\n'}
              アプリケーション・ソフトウェア開発を行う株式会社クリエイティブ・コンサルタント（本社：北海道札幌市、代表取締役：斉藤雅之）は3月22日、ブロックチェーン技術を活用した企業向け社内仮想通貨（以下、企業コイン）サービス「HARVEST」と「ComComCoin」を発表しました。
              {'\n'}
              {'\n'}
              ▼お問い合わせ先
              {'\n'}株式会社クリエイティブ・コンサルタント
              {'\n'}
              〒060-0031　札幌市中央区北１条東２丁目５番地３　塚本ビル北１館２階
              {'\n'}TEL 011-210-7130　
              {'\n'}E-メール：press@hokkaido-ima.co.jp（担当者：坂本 義和）
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
