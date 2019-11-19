import React, { Component } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { Card, ListItem } from 'react-native-elements'
import moment from 'moment'
import 'moment/locale/ja'
import InAppHeader from './components/InAppHeader'

export default class HomeInfoList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inforList: []
    }
  }

  /** コンポーネントのマウント時処理 */
  componentWillMount = async () => {
    // TODO : テストデータ
    this.setState({
      inforList: [
        {
          renban: 1,
          title: '北海道新聞にHARVESTの記事が掲載されました。',
          notice_dt: '2019/04/12'
        },
        {
          renban: 2,
          title: 'HARVESTに関するプレスリリースしました。',
          notice_dt: '2019/03/15'
        },
        {
          renban: 3,
          title: '財界さっぽろ様の企業特集に掲載されました。',
          notice_dt: '2018/09/15'
        },
        {
          renban: 4,
          title: '財界さっぽろ様の企業特集に掲載されました。',
          notice_dt: '2018/09/15'
        },
        {
          renban: 5,
          title: '財界さっぽろ様の企業特集に掲載されました。',
          notice_dt: '2018/09/15'
        },
        {
          renban: 6,
          title: '財界さっぽろ様の企業特集に掲載されました。',
          notice_dt: '2018/09/15'
        },
        {
          renban: 7,
          title: '財界さっぽろ様の企業特集に掲載されました。',
          notice_dt: '2018/09/15'
        },
        {
          renban:8,
          title: '財界さっぽろ様の企業特集に掲載されました。',
          notice_dt: '2018/09/15'
        },
        {
          renban: 9,
          title: '財界さっぽろ様の企業特集に掲載されました。',
          notice_dt: '2018/09/15'
        },
        {
          renban: 10,
          title: '財界さっぽろ様の企業特集に掲載されました。',
          notice_dt: '2018/09/15'
        },
        {
          renban: 11,
          title: '財界さっぽろ様の企業特集に掲載されました。',
          notice_dt: '2018/09/15'
        },
        {
          renban: 12,
          title: '財界さっぽろ様の企業特集に掲載されました。',
          notice_dt: '2018/09/15'
        },
        {
          renban: 13,
          title: '財界さっぽろ様の企業特集に掲載されました。',
          notice_dt: '2018/09/15'
        },
        {
          renban: 14,
          title: '財界さっぽろ様の企業特集に掲載されました。',
          notice_dt: '2018/09/15'
        }
      ]
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
            <Card containerStyle={{ padding: 0 }}>
              {this.state.inforList.map((item, i) => {
                return (
                  <ListItem
                    key={i}
                    titleStyle={{ fontSize: 16 }}
                    title={item.title}
                    subtitle={moment(new Date(item.notice_dt)).format('YYYY/MM/DD')}
                    onPress={() => this.props.navigation.navigate('HomeInformation', {
                      renban: item.renban
                    })} />
                )
              })}
            </Card>
          </ScrollView>
        </View>
      </View >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF'
  }
})
