import React, { Component } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { Text } from 'react-native-elements'
import moment from 'moment'
import 'moment/locale/ja'
import InAppHeader from './components/InAppHeader'

export default class HomeInformation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: "",
      comment: "",
      notice_dt: null,
    }
  }

  /** コンポーネントのマウント時処理 */
  componentWillMount = async () => {
    const renban = this.props.navigation.getParam("renban")
    
    // TODO : テストデータ
    this.setState({
      title: "HARVESTに関するプレスリリースしました。",
      comment: "アプリケーション・ソフトウェア開発を行う株式会社クリエイティブ・コンサルタント（本社：北海道札幌市、代表取締役：斉藤雅之）は3月22日、ブロックチェーン技術を活用した企業向け社内仮想通貨（以下、企業コイン）サービス「HARVEST」と「ComComCoin」を発表しました。\n\n" +
        "▼お問い合わせ先\n" +
        "株式会社クリエイティブ・コンサルタント\n\n" +
        "〒060-0031　札幌市中央区北１条東２丁目５番地３　塚本ビル北１館２階\n" +
        "TEL 011-210-7130\n" +
        "E-Mail：press@hokkaido-ima.co.jp（担当者：坂本 義和）",
      notice_dt: new Date(),
    })
  }

  render() {
    return (
      <View style={styles.container}>
        {/* -- 共有ヘッダ -- */}
        <InAppHeader navigate={this.props.navigation.navigate} />

        {/* -- お知らせ -- */}
        <View style={{ height: "90%" }}>
          <ScrollView>
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              {/* お知らせ日 */}
              <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                {moment(new Date(this.state.notice_dt)).format('YYYY/MM/DD')}
              </Text>
            </View>
            <View style={{ marginTop: 20 }}>
              {/* タイトル ＆ コメント */}
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {this.state.title}{'\n'}
              </Text>
              <Text style={{ fontSize: 16 }}>
                {this.state.comment}
              </Text>
            </View>
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
