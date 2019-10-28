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
    title: '北海道新聞にHARVESTの記事が掲載されました。',
    sub: '2019.04.12'
  },
  {
    title: 'HARVESTに関するプレスリリースしました。',
    sub: '2019.03.15'
  },
  {
    title: '財界さっぽろ様の企業特集に掲載されました。',
    sub: '2018.09.15'
  },
  {
    title: '財界さっぽろ様の企業特集に掲載されました。',
    sub: '2018.09.15'
  },
  {
    title: '財界さっぽろ様の企業特集に掲載されました。',
    sub: '2018.09.15'
  },
  {
    title: '財界さっぽろ様の企業特集に掲載されました。',
    sub: '2018.09.15'
  },
  {
    title: '財界さっぽろ様の企業特集に掲載されました。',
    sub: '2018.09.15'
  },
  {
    title: '財界さっぽろ様の企業特集に掲載されました。',
    sub: '2018.09.15'
  },
  {
    title: '財界さっぽろ様の企業特集に掲載されました。',
    sub: '2018.09.15'
  },
  {
    title: '財界さっぽろ様の企業特集に掲載されました。',
    sub: '2018.09.15'
  },
  {
    title: '財界さっぽろ様の企業特集に掲載されました。',
    sub: '2018.09.15'
  },
  {
    title: '財界さっぽろ様の企業特集に掲載されました。',
    sub: '2018.09.15'
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
          <Card containerStyle={{ padding: 0 }}>
            {users.map((u, i) => {
              return (
                <ListItem
                  key={i}
                  title={u.title}
                  titleStyle={{ fontSize: 18 }}
                  subtitle={u.sub}
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
