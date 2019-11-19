import React, { PureComponent } from 'react'
import { Dimensions, StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { Card } from 'react-native-elements'
import moment from 'moment'
import 'moment/locale/ja'

const restdomain = require('./common/constans.js').restdomain
const windowWidth = Dimensions.get('window').width

export default class Home extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      activeSlide: 0,
      adList: [],
      adList2: [],
      infoList: [],
      newArticleList: [],
      popularArticleList: []
    }
  }

  /** コンポーネントのマウント時処理 */
  componentWillMount = async () => {
    // TODO : テストデータ
    this.setState({
      activeSlide: 0,
      adList: [
        { renban: 1, file_path: 'kokoku_1.jpg' },
        { renban: 2, file_path: 'kokoku_2.jpg' },
        { renban: 3, file_path: 'kokoku_3.jpg' },
        { renban: 4, file_path: 'kokoku_4.jpg' },
        { renban: 5, file_path: 'CONSADOLE.png' },
      ],
      adList2: [
        'kokoku_1.jpg',
        'kokoku_2.jpg',
        'kokoku_3.jpg',
        'kokoku_4.jpg',
        'CONSADOLE.png',
      ],
      infoList: [
        { notice_dt: "2019/04/12", title: "北海道新聞にHARVESTの記事が掲載されました。" },
        { notice_dt: "2019/03/15", title: "HARVESTに関するプレスリリースしました。" },
        { notice_dt: "2019/03/15", title: "HARVESTに関するプレスリリースしました。" },
      ],
      newArticleList: [
        { title: "マラソン大会へのお誘い", hashtagStr: "#スポーツ　#マラソン　", file_path: "test001.png", shain_image_path: "", goodCnt: 12 },
        { title: "ビアガーデン開催", hashtagStr: "#飲み会　#お店　", file_path: "", goodCnt: 0 },
        { title: "ビアガーデン開催", hashtagStr: "#飲み会　#お店　", file_path: "", goodCnt: 0 },
      ],
      popularArticleList: [
        { title: "マラソン大会へのお誘い", hashtagStr: "#スポーツ　#マラソン　", file_path: "test001.png", shain_image_path: "", goodCnt: 12 },
        { title: "ビアガーデン開催", hashtagStr: "#飲み会　#お店　", file_path: "", goodCnt: 0 },
        { title: "ビアガーデン開催", hashtagStr: "#飲み会　#お店　", file_path: "", goodCnt: 0 },
      ]
    })
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
                <Card containerStyle={{ height: 120, width: 150 }} key={i}>
                  {/* TODO : onPressで画面遷移 */}
                  {/* 画像 */}
                  <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: -15 }}>
                    {item.file_path !== "" &&
                      <Image
                        source={{ uri: restdomain + `/uploads/article/${item.file_path}` }}
                        style={{ width: 60, height: 60 }}
                      />
                    }
                    {/* 画像が未登録の場合は社員の顔写真を表示 */}
                    {item.file_path === "" &&
                      <Image
                        source={{ uri: restdomain + `/uploads/${item.shain_image_path}` }}
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
                      source={require('./../images/icons8-thumbs-up-24_2.png')}
                    />
                    <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 20 }}>
                      {' '}{item.goodCnt}
                    </Text>
                  </View>
                </Card>
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
                <Card containerStyle={{ height: 120, width: 150 }} key={i}>
                  {/* TODO : onPressで画面遷移 */}
                  {/* 画像 */}
                  <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: -15 }}>
                    {item.file_path !== "" &&
                      <Image
                        source={{ uri: restdomain + `/uploads/article/${item.file_path}` }}
                        style={{ width: 60, height: 60 }}
                      />
                    }
                    {/* 画像が未登録の場合は社員の顔写真を表示 */}
                    {item.file_path === "" &&
                      <Image
                        source={{ uri: restdomain + `/uploads/${item.shain_image_path}` }}
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
                      source={require('./../images/icons8-thumbs-up-24_2.png')}
                    />
                    <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 20 }}>
                      {' '}{item.goodCnt}
                    </Text>
                  </View>
                </Card>
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
            <Image
              resizeMode="contain"
              source={require('./../images/icons8-brainstorm-skill-48.png')}
            />
            <Text>情報ひろば</Text>
          </View>
          <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Image
              resizeMode="contain"
              source={require('./../images/icons8-services-48.png')}
            />
            <Text>設定</Text>
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
