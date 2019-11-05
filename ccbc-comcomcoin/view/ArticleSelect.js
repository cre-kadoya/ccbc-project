import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native'
import { Icon } from 'react-native-elements'
import InAppHeader from './components/InAppHeader'

export default class ArticleSelect extends Component {
  constructor(props) {
    super(props)
    this.state = {
      kijiCategory: []
    }
  }

  /** コンポーネントのマウント時処理 */
  componentWillMount = async () => {
    // TODO : スタブデータ
    this.setState({kijiCategory: [
      { t_kiji_category_pk: 1, category_nm: "ライフハック", midoku_cnt: 0 },
      { t_kiji_category_pk: 2, category_nm: "おすすめの本", midoku_cnt: 1 },
      { t_kiji_category_pk: 3, category_nm: "イベント情報", midoku_cnt: 10 },
      { t_kiji_category_pk: 4, category_nm: "美味しいお店", midoku_cnt: 0 },
      { t_kiji_category_pk: 5, category_nm: "その他", midoku_cnt: 0 },
    ]})
  }

  /** 記事照会画面へ遷移 */
  onPressCategory = async (selectKijiCategory) => {
    this.props.navigation.navigate('ArticleRefer', {
      selectKijiCategory: selectKijiCategory
    })
  }

  render() {
    return (
      <View>
        {/* -- 共有ヘッダ -- */}
        <InAppHeader navigate={this.props.navigation.navigate} />
        <View style={{ marginTop: 20 }} />
        {/* -- 記事カテゴリ（繰り返し） -- */}
        {this.state.kijiCategory.map((item, i) => {
          return (
            <TouchableHighlight onPress={() => this.onPressCategory(item)} key={i}>
              <View style={styles.articleLine}>
                <View style={styles.articleTitleView}>
                  <Text style={styles.articleTitleText}>{"　　" + item.category_nm}</Text>
                </View>
                {/* 未読マーク */}
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  {(() => {
                    if (item.midoku_cnt > 0) {
                      return (
                        <View style={styles.nonReadMark}>
                          <Text style={styles.nonReadMarkStr}>{'   ' + item.midoku_cnt + '   '}</Text>
                        </View>
                      )
                    }
                  })()}
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 10 }}>
                  <Icon name="chevron-right" type="font-awesome" color="white" />
                </View>
              </View>
            </TouchableHighlight>
          )
        })}
      </View>
    )
  }
}

const styles = StyleSheet.create({
	articleLine: {
		borderRadius: 20,
		alignItems: 'center',
		marginTop: 15,
		marginLeft: 10,
		marginRight: 10,
		backgroundColor: '#AA0000',
		flexDirection: 'row'
	},
	articleTitleView: {
		flex: 8,
		alignItems: 'center'
	},
	articleTitleText: {
		fontSize: 26,
		color: 'white',
		padding: 10
	},
	nonReadMark: {
    textAlign: 'center',
    textAlignVertical: 'center',
		backgroundColor: '#FF3333',
		borderRadius: 50,
		borderColor: 'white'
  },
  nonReadMarkStr: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
    marginBottom: 5
	}
})
