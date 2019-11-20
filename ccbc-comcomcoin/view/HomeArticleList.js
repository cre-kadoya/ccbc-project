import React, { Component } from 'react'
import { StyleSheet, View, Text, ScrollView } from 'react-native'
import { Card, ListItem } from 'react-native-elements'
import InAppHeader from './components/InAppHeader'

export default class HomeArticleList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      articleList: [],
      screenTitle: ""
    }
  }
  /** コンポーネントのマウント時処理 */
  componentWillMount = async () => {
    const mode = this.props.navigation.getParam("mode")
    const screenTitle = (mode === "new" ? "最新の記事" : "人気の記事")

    // TODO : テストデータ
    this.setState({
      screenTitle: screenTitle,
      articleList: [
        {
          t_kiji_pk: 1,
          title: 'リーダーコンピテンシー開催案内',
          hashtagStr: '#研修, #案内',
          avatar: require('./../images/man3.jpg'),
          cnt: 11
        },
        {
          t_kiji_pk: 1,
          title: '夏キャンプのお知らせ',
          hashtagStr: '#アウトドア, #案内',
          avatar: require('./../images/man7.jpg'),
          cnt: 9
        },
        {
          t_kiji_pk: 1,
          title: '第三回マラソン大会開催案内',
          hashtagStr: '#スポーツ',
          avatar: require('./../images/man1.jpg'),
          cnt: 7
        },
        {
          t_kiji_pk: 1,
          title: '7月の北海道の天気',
          hashtagStr: '#天気',
          avatar: require('./../images/woman2.jpg'),
          cnt: 6
        },
        {
          t_kiji_pk: 1,
          title: '6月おすすめの本',
          hashtagStr: '#本',
          avatar: require('./../images/man5.jpg'),
          cnt: 5
        },
        {
          t_kiji_pk: 1,
          title: '今日の献立',
          hashtagStr: '#料理',
          avatar: require('./../images/woman3.jpg'),
          cnt: 3
        },
        {
          t_kiji_pk: 1,
          title: '今日のプログラミング講座',
          hashtagStr: '#プログラミング',
          avatar: require('./../images/man2.jpg'),
          cnt: 1
        },
        {
          t_kiji_pk: 1,
          title: '6/16の天気',
          hashtagStr: '#天気',
          avatar: require('./../images/woman1.jpg'),
          cnt: 1
        },
        {
          t_kiji_pk: 1,
          title: 'ブロックチェーン勉強会について',
          hashtagStr: '#研修',
          avatar: require('./../images/man6.jpg'),
          cnt: 1
        },
        {
          t_kiji_pk: 1,
          title: '石垣の一言',
          hashtagStr: '#その他',
          avatar: require('./../images/man4.jpg'),
          cnt: 0
        },
        {
          t_kiji_pk: 1,
          title: '今日のポエム from Nakayama',
          hashtagStr: '#その他',
          avatar: require('./../images/woman4.jpg'),
          cnt: 0
        },
        {
          t_kiji_pk: 1,
          title: '江別の謎',
          hashtagStr: '#その他',
          avatar: require('./../images/man8.jpg'),
          cnt: 0
        }
      ]
    })
  }

  render() {
    return (
      <View style={styles.container}>
        {/* -- 共有ヘッダ -- */}
        <InAppHeader navigate={this.props.navigation.navigate} />

        {/* -- 記事 -- */}
        <View style={{ height: "90%" }}>
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <Text style={{ fontSize: 22 }}>
              {this.state.screenTitle}
            </Text>
          </View>
          <ScrollView>
            <Card containerStyle={{ padding: 0 }}>
              {this.state.articleList.map((item, i) => {
                return (
                  <ListItem
                    key={i}
                    titleStyle={{ fontSize: 16 }}
                    title={item.title}
                    subtitle={item.hashtagStr}
                    roundAvatar
                    // avatar={item.avatar}
                    badge={{
                      value: item.cnt + "いいね"
                    }}
                    onPress={() => this.props.navigation.navigate('ArticleRefer', {
                      mode: "home",
                      selectKijiPk: item.t_kiji_pk
                    })}
                  />
                )
              })}
            </Card>
          </ScrollView>
        </View>
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
