import React from 'react'
import { Dimensions, StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { Card } from 'react-native-elements'
import moment from 'moment'
import 'moment/locale/ja'
import BaseComponent from './components/BaseComponent'

const restdomain = require('./common/constans.js').restdomain
const windowWidth = Dimensions.get('window').width

export default class Home extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
      activeSlide: 0,
      adList: [],
      infoList: [],
      newArticleList: [],
      popularArticleList: []
    }
  }

  /** コンポーネントのマウント時処理 */
  componentWillMount = async () => {
    // ログイン情報の取得（BaseComponent）
    await this.getLoginInfo()

    // ホームAPI.ComComCoinホーム情報取得処理の呼び出し
    await fetch(restdomain + '/comcomcoin_home/findHome', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(this.state),
      headers: new Headers({ 'Content-type': 'application/json' })
    })
      .then(function (response) {
        return response.json()
      })
      .then(
        function (json) {
          // 結果が取得できない場合は終了
          if (typeof json.data === 'undefined') {
            return
          }
          // 取得したデータをStateに格納
          this.setState({
            activeSlide: 0,
            adList: json.data.adList,
            infoList: json.data.infoList,
            newArticleList: json.data.newArticleList,
            popularArticleList: json.data.popularArticleList
          })
        }.bind(this)
      )
      .catch(error => console.error(error))
  }

  renderItem = ({ item, index }) => (
    <View style={styles.tile}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => this.props.navigation.navigate('HomeAdvertise', {
          renban: item.renban
        })}
      >
        <Image style={{ height: 185, width: windowWidth }}
          resizeMode="contain"
          source={{ uri: restdomain + `/uploads/advertise/${item.file_path}` }}
        />
      </TouchableOpacity>
    </View>
  )

  get pagination() {
    return (
      <Pagination
        dotsLength={this.state.adList.length}
        activeDotIndex={this.state.activeSlide}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: 'rgba(200, 200, 200, 0.92)'
        }}
        inactiveDotStyle={
          {}
        }
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={[{ flex: 0.1 }]}>
          <Text />
        </View>

        {/* -- 広告 -- */}
        <View style={{ flex: 1.0, flexDirection: 'row' }}>
          <View style={styles.container}>
            <Carousel
              data={this.state.adList}
              layout={'default'}
              renderItem={this.renderItem.bind(this)}
              onSnapToItem={index => this.setState({ activeSlide: index })}
              itemWidth={windowWidth}
              sliderWidth={windowWidth}
              containerCustomStyle={styles.carousel}
              slideStyle={{ flex: 1 }}
              loop
              autoplay
            />
            <View>{this.pagination}</View>
          </View>
        </View>

        {/* -- お知らせ -- */}
        <View style={{ flex: 0.1, backgroundColor: 'rgba(255, 136, 0, 0.92)', flexDirection: 'row', alignItems: 'center' }}>
          <Image resizeMode="contain" source={require('./../images/icons8-post-box-24.png')} />
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            {' '}お知らせ
          </Text>
          <Text style={{ color: 'white', fontSize: 16, position: 'absolute', right: 0 }}
            onPress={() => this.props.navigation.navigate('HomeInfoList')} >
            もっと見る>
          </Text>
        </View>
        <View style={[{ flex: 0.3 }]}>
          {/* お知らせの件数分、繰り返し（最大3件） */}
          {this.state.infoList.map((item, i) => {
            return (
              <Text ellipsizeMode={"tail"} numberOfLines={1} style={{ marginTop: 5 }} key={i}>
                {moment(new Date(item.notice_dt)).format('YYYY/MM/DD')}{' '}{item.title}
              </Text>
            )
          })}
        </View>

        {/* -- 最新の記事 -- */}
        <View style={{ flex: 0.1, backgroundColor: 'rgba(255, 136, 0, 0.92)', flexDirection: 'row', alignItems: 'center' }}>
          <Image resizeMode="contain" source={require('./../images/icons8-news-24.png')} />
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            {' '}最新の記事
          </Text>
          <Text style={{ color: 'white', fontSize: 16, position: 'absolute', right: 0 }}
            onPress={() => this.props.navigation.navigate('HomeArticleList', {
              mode: "new"
            })}>
            もっと見る>
          </Text>
        </View>

        <View style={[{ flex: 0.6, flexDirection: 'row' }]}>
          {/* 最新の記事の件数分、繰り返し（横スクロール） */}
          <ScrollView horizontal={true}>
            {this.state.newArticleList.map((item, i) => {
              return (
                <TouchableOpacity key={i}
                  activeOpacity={1}
                  onPress={() => this.props.navigation.navigate('ArticleRefer', {
                    mode: "home",
                    selectKijiPk: item.t_kiji_pk
                  })}>
                  <Card containerStyle={{ height: 120, width: 150 }}>
                    {/* 画像 */}
                    <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: -15 }}>
                      {item.file_path !== "" &&
                        <Image
                          source={{ uri: restdomain + `/uploads/article/${item.file_path}` }}
                          style={{ width: 60, height: 60 }}
                        />
                      }
                      {/* 画像が未登録の場合はNo-Imageを表示 */}
                      {item.file_path === "" &&
                        <Image
                          source={require('./../images/icon-noimage.png')}
                          style={{ width: 60, height: 60 }}
                        />
                      }
                    </View>
                    {/* タイトル */}
                    <Text ellipsizeMode={"tail"} numberOfLines={1} style={{ marginBottom: 10 }}>
                      {item.title}
                    </Text>
                    {/* ハッシュタグ */}
                    <Text ellipsizeMode={"tail"} numberOfLines={1} style={{ color: '#808080', marginTop: -10 }}>
                      {item.hashtagStr}
                    </Text>
                    {/* いいね */}
                    <View style={[{ flexDirection: 'row' }]}>
                      <Image
                        resizeMode="contain"
                        source={require('./../images/good-on.png')}
                        style={{ width: 25, height: 25 }}
                      />
                      <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 18 }}>
                        {' '}{item.goodCnt}
                      </Text>
                    </View>
                  </Card>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

        {/* -- 人気の記事 -- */}
        <View style={{ flex: 0.1, backgroundColor: 'rgba(255, 136, 0, 0.92)', flexDirection: 'row', alignItems: 'center' }}>
          <Image resizeMode="contain" source={require('./../images/icons8-thumbs-up-24.png')} />
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            {' '}人気の記事
          </Text>
          <Text style={{ color: 'white', fontSize: 16, position: 'absolute', right: 0 }}
            onPress={() => this.props.navigation.navigate('HomeArticleList', {
              mode: "popular"
            })}>
            もっと見る>
          </Text>
        </View>

        <View style={[{ flex: 0.6 }]}>
          {/* 人気の記事の件数分、繰り返し（横スクロール） */}
          <ScrollView horizontal={true}>
            {this.state.popularArticleList.map((item, i) => {
              return (
                <TouchableOpacity key={i}
                  activeOpacity={1}
                  onPress={() => this.props.navigation.navigate('ArticleRefer', {
                    mode: "home",
                    selectKijiPk: item.t_kiji_pk
                  })}>
                  <Card containerStyle={{ height: 120, width: 150 }}>
                    {/* 画像 */}
                    <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: -15 }}>
                      {item.file_path !== "" &&
                        <Image
                          source={{ uri: restdomain + `/uploads/article/${item.file_path}` }}
                          style={{ width: 60, height: 60 }}
                        />
                      }
                      {/* 画像が未登録の場合はNo-Imageを表示 */}
                      {item.file_path === "" &&
                        <Image
                          source={require('./../images/icon-noimage.png')}
                          style={{ width: 60, height: 60 }}
                        />
                      }
                    </View>
                    {/* タイトル */}
                    <Text ellipsizeMode={"tail"} numberOfLines={1} style={{ marginBottom: 10 }}>
                      {item.title}
                    </Text>
                    {/* ハッシュタグ */}
                    <Text ellipsizeMode={"tail"} numberOfLines={1} style={{ color: '#808080', marginTop: -10 }}>
                      {item.hashtagStr}
                    </Text>
                    {/* いいね */}
                    <View style={[{ flexDirection: 'row' }]}>
                      <Image
                        resizeMode="contain"
                        source={require('./../images/good-on.png')}
                        style={{ width: 25, height: 25 }}
                      />
                      <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 18 }}>
                        {' '}{item.goodCnt}
                      </Text>
                    </View>
                  </Card>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

        {/* -- 各機能アイコン -- */}
        <View style={[{ flex: 0.3, flexDirection: 'row' }]}>
          <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Image
              resizeMode="contain"
              source={require('./../images/icons8-chat-bubble-48.png')}
            />
            <Text>チャット</Text>
          </View>
          <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Image
              resizeMode="contain"
              source={require('./../images/icons8-qr-code-48.png')}
            />
            <Text>買い物</Text>
          </View>
          <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => this.props.navigation.navigate('ArticleSelect')}>
              <Image
                resizeMode="contain"
                source={require('./../images/icons8-brainstorm-skill-48.png')}
              />
              <Text>情報ひろば</Text>
            </TouchableOpacity>
          </View>
          <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => this.props.navigation.navigate('HomeArticleList', {
                mode: "favorite"
              })}>
              <Image
                resizeMode="contain"
                source={require('./../images/icons8-services-48.png')}
              />
              <Text>お気に入り</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  carousel: {
    flex: 1
  },
  tile: {
    flex: 1,
    width: Dimensions.get('window').width * 0.85
  }
})
