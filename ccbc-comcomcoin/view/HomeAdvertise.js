import React, { Component } from 'react'
import { StyleSheet, View, Image, ScrollView } from 'react-native'
import { Text } from 'react-native-elements'
import InAppHeader from './components/InAppHeader'

const restdomain = require('./common/constans.js').restdomain

export default class HomeAdvertise extends Component {
  constructor(props) {
    super(props)
    this.state = {
      file_path: "",
      comment: "",
    }
  }

  /** コンポーネントのマウント時処理 */
  componentWillMount = async () => {
    const renban = this.props.navigation.getParam("renban")

    // TODO : テストデータ
    this.setState({
      file_path: "CONSADOLE.png",
      comment: "サッカーＪ１　コンサドーレ札幌の観戦案内です。\n" +
        "■8月10日（土）14:00キックオフ　vs 浦和レッズ\n" +
        "■8月24日（土）13:00キックオフ　vs FC東京\n" +
        "場所はいずれも札幌ドーム。\n" +
        "チケットは「浦和レッズ戦　7枚」「FC東京戦　7枚」です。\n\n" +
        "観戦を希望される方は、三上まで連絡ください。\n" +
        "※締め切りは、6月19日（水）17時。\n" +
        "\n" +
        "※締め切りは上記の通りですが、チケットの数に限りがあることと、観戦当日までの段取りの調整を鑑み、早めの連絡をお願いいたします。\n" +
        "\n\n" +
        "ご存知の通り、今年度から弊社はコンサドーレ札幌のサポートシップ・パートナーとなりました。\n\n" +
        "5月4日のヴィッセル神戸戦を観戦したメンバーから好評をいただき、サッカーを知らない人でも楽しめたようです。\n\n" +
        "みなさん、北海道のプロスポーツを応援し、北海道を元気にしましょう！\n"
    })
  }

  render() {
    return (
      <View style={styles.container}>
        {/* -- 共有ヘッダ -- */}
        <InAppHeader navigate={this.props.navigation.navigate} />

        {/* -- 広告 -- */}
        <View style={{ height: "90%" }}>
          <ScrollView>
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              {/* 画像 */}
              <Image resizeMode="contain" flexDirection="row" alignItems="center"
                source={{ uri: restdomain + `/uploads/advertise/${this.state.file_path}` }}
                style={{ width: 300, height: 300 }} />
            </View>
            <View style={{ margin: 10 }}>
              {/* コメント */}
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
  }
})
