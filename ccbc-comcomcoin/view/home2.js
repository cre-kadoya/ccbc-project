import React, { PureComponent } from 'react'
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView
} from 'react-native'

import Carousel, { Pagination } from 'react-native-snap-carousel'
import { Card, Avatar } from 'react-native-elements'

export default class ExampleCarousel extends PureComponent {
  state = {
    data: [
      require('./../images/CONSADOLE.png'),
      require('./../images/kokoku_1.jpg'),
      require('./../images/kokoku_2.jpg'),
      require('./../images/kokoku_3.jpg'),
      require('./../images/kokoku_4.jpg')
    ]
  }

  renderItem = ({ index }) => (
    <View style={styles.tile}>
      <Image
        style={{
          height: 185,
          width: 350
        }}
        resizeMode="contain"
        source={this.state.data[index]}
      />
    </View>
  )

  get pagination() {
    const { entries, activeSlide = 0 } = this.state
    return (
      <Pagination
        dotsLength={this.state.data.length}
        activeDotIndex={activeSlide}
        //containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: 'rgba(200, 200, 200, 0.92)'
        }}
        inactiveDotStyle={
          {
            // Define styles for inactive dots here
          }
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
        <View style={{ flex: 1.0, flexDirection: 'row' }}>
          <View style={styles.container}>
            <Carousel
              data={this.state.data}
              renderItem={index => this.renderItem(index)}
              onSnapToItem={index => this.setState({ activeSlide: index })}
              itemWidth={Dimensions.get('window').width * 0.85}
              sliderWidth={Dimensions.get('window').width}
              containerCustomStyle={styles.carousel}
              slideStyle={{ flex: 1 }}
              autoplay
              firstItem={0}
              // loop
            />
            <View>{this.pagination}</View>
          </View>
        </View>
        <View
          style={[
            {
              flex: 0.1,
              backgroundColor: 'rgba(255, 136, 0, 0.92)',
              flexDirection: 'row',
              alignItems: 'center'
              //justifyContent: 'center'
            }
          ]}
        >
          <Image
            // style={{
            //   height: 185,
            //   width: 350
            // }}
            resizeMode="contain"
            source={require('./../images/icons8-post-box-24.png')}
          />
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            {' '}
            お知らせ
          </Text>
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              position: 'absolute',
              right: 0
            }}
          >
            もっと見る>
          </Text>
        </View>
        <View style={[{ flex: 0.3 }]}>
          <Text>2019.04.12 北海道新聞にHARVESTの記事が掲載されました。</Text>
          <Text style={{ marginTop: 5 }}>
            2019.03.15 HARVESTに関するプレスリリースしました。
          </Text>
          <Text style={{ marginTop: 5 }}>
            2018.09.15 財界さっぽろ様の企業特集に掲載されました。
          </Text>
        </View>
        <View
          style={[
            {
              flex: 0.1,
              backgroundColor: 'rgba(255, 136, 0, 0.92)',
              flexDirection: 'row',
              alignItems: 'center'
              //justifyContent: 'center'
            }
          ]}
        >
          <Image
            // style={{
            //   height: 185,
            //   width: 350
            // }}
            resizeMode="contain"
            source={require('./../images/icons8-news-24.png')}
          />
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            {' '}
            最新の記事
          </Text>
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              position: 'absolute',
              right: 0
            }}
          >
            もっと見る>
          </Text>
        </View>
        <View style={[{ flex: 0.6, flexDirection: 'row' }]}>
          <ScrollView horizontal={true}>
            <Card containerStyle={{ height: 120, width: 150 }}>
              <View
                style={[
                  {
                    justifyContent: 'center',
                    flexDirection: 'row',
                    marginTop: -15
                  }
                ]}
              >
                <Image
                  source={require('./../images/man3.jpg')}
                  style={{ width: 60, height: 60 }}
                />
              </View>
              <Text style={{ marginBottom: 10 }}>第三回マラソン大…</Text>
              <Text style={{ color: '#808080', marginTop: -10 }}>
                #スポーツ
              </Text>
              <View style={[{ flexDirection: 'row' }]}>
                <Image
                  resizeMode="contain"
                  source={require('./../images/icons8-thumbs-up-24_2.png')}
                />
                <Text
                  style={{ color: 'red', fontWeight: 'bold', fontSize: 20 }}
                >
                  {' '}
                  1
                </Text>
              </View>
            </Card>
            <Card containerStyle={{ height: 120, width: 150 }}>
              <View
                style={[
                  {
                    justifyContent: 'center',
                    flexDirection: 'row',
                    marginTop: -15
                  }
                ]}
              >
                <Image
                  source={require('./../images/woman3.jpg')}
                  style={{ width: 60, height: 60 }}
                />
              </View>
              <Text style={{ marginBottom: 10 }}>6/3の夜ご飯</Text>
              <Text style={{ color: '#808080', marginTop: -10 }}>
                #食べ物 #女子力
              </Text>
              <View style={[{ flexDirection: 'row' }]}>
                <Image
                  resizeMode="contain"
                  source={require('./../images/icons8-thumbs-up-24_2.png')}
                />
                <Text
                  style={{ color: 'red', fontWeight: 'bold', fontSize: 20 }}
                >
                  {' '}
                  3
                </Text>
              </View>
            </Card>
            <Card containerStyle={{ height: 120, width: 150 }}>
              <View
                style={[
                  {
                    justifyContent: 'center',
                    flexDirection: 'row',
                    marginTop: -15
                  }
                ]}
              >
                <Image
                  source={require('./../images/man2.jpg')}
                  style={{ width: 60, height: 60 }}
                />
              </View>
              <Text style={{ marginBottom: 10 }}>プログラミング講…</Text>
              <Text style={{ color: '#808080', marginTop: -10 }}>
                #プログラミング
              </Text>
              <View style={[{ flexDirection: 'row' }]}>
                <Image
                  resizeMode="contain"
                  source={require('./../images/icons8-thumbs-up-24_2.png')}
                />
                <Text
                  style={{ color: 'red', fontWeight: 'bold', fontSize: 20 }}
                >
                  {' '}
                  2
                </Text>
              </View>
            </Card>
          </ScrollView>
        </View>
        <View
          style={[
            {
              flex: 0.1,
              backgroundColor: 'rgba(255, 136, 0, 0.92)',
              flexDirection: 'row',
              alignItems: 'center'
              //justifyContent: 'center'
            }
          ]}
        >
          <Image
            // style={{
            //   height: 185,
            //   width: 350
            // }}
            resizeMode="contain"
            source={require('./../images/icons8-thumbs-up-24.png')}
          />
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            {' '}
            人気の記事
          </Text>
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              position: 'absolute',
              right: 0
            }}
          >
            もっと見る>
          </Text>
        </View>
        <View style={[{ flex: 0.6 }]}>
          <ScrollView horizontal={true}>
            <Card containerStyle={{ height: 120, width: 150 }}>
              <View
                style={[
                  {
                    justifyContent: 'center',
                    flexDirection: 'row',
                    marginTop: -15
                  }
                ]}
              >
                <Image
                  source={require('./../images/woman3.jpg')}
                  style={{ width: 60, height: 60 }}
                />
              </View>
              <Text style={{ marginBottom: 10 }}>笑顔の効果</Text>
              <Text style={{ color: '#808080', marginTop: -10 }}>#EQ</Text>
              <View style={[{ flexDirection: 'row' }]}>
                <Image
                  resizeMode="contain"
                  source={require('./../images/icons8-thumbs-up-24_2.png')}
                />
                <Text
                  style={{ color: 'red', fontWeight: 'bold', fontSize: 20 }}
                >
                  {' '}
                  12
                </Text>
              </View>
            </Card>
            <Card containerStyle={{ height: 120, width: 150 }}>
              <View
                style={[
                  {
                    justifyContent: 'center',
                    flexDirection: 'row',
                    marginTop: -15
                  }
                ]}
              >
                <Image
                  source={require('./../images/man1.jpg')}
                  style={{ width: 60, height: 60 }}
                />
              </View>
              <Text style={{ marginBottom: 10 }}>今日のポエム</Text>
              <Text style={{ color: '#808080', marginTop: -10 }}>#妄想</Text>
              <View style={[{ flexDirection: 'row' }]}>
                <Image
                  resizeMode="contain"
                  source={require('./../images/icons8-thumbs-up-24_2.png')}
                />
                <Text
                  style={{ color: 'red', fontWeight: 'bold', fontSize: 20 }}
                >
                  {' '}
                  10
                </Text>
              </View>
            </Card>
            <Card containerStyle={{ height: 120, width: 150 }}>
              <View
                style={[
                  {
                    justifyContent: 'center',
                    flexDirection: 'row',
                    marginTop: -15
                  }
                ]}
              >
                <Image
                  source={require('./../images/man2.jpg')}
                  style={{ width: 60, height: 60 }}
                />
              </View>
              <Text style={{ marginBottom: 10 }}>初心者プログラミ…</Text>
              <Text style={{ color: '#808080', marginTop: -10 }}>
                #プログラミング
              </Text>
              <View style={[{ flexDirection: 'row' }]}>
                <Image
                  resizeMode="contain"
                  source={require('./../images/icons8-thumbs-up-24_2.png')}
                />
                <Text
                  style={{ color: 'red', fontWeight: 'bold', fontSize: 20 }}
                >
                  {' '}
                  7
                </Text>
              </View>
            </Card>
          </ScrollView>
        </View>
        <View style={[{ flex: 0.3, flexDirection: 'row' }]}>
          <View
            style={[
              {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1
              }
            ]}
          >
            <Image
              resizeMode="contain"
              source={require('./../images/icons8-chat-bubble-48.png')}
            />
            <Text>チャット</Text>
          </View>
          <View
            style={[
              {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1
              }
            ]}
          >
            <Image
              resizeMode="contain"
              source={require('./../images/icons8-qr-code-48.png')}
            />
            <Text>買い物</Text>
          </View>
          <View
            style={[
              {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1
              }
            ]}
          >
            <Image
              resizeMode="contain"
              source={require('./../images/icons8-brainstorm-skill-48.png')}
            />
            <Text>情報ひろば</Text>
          </View>
          <View
            style={[
              {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1
              }
            ]}
          >
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
  container: {
    height: 250
  },
  carousel: {
    flex: 1
    // backgroundColor: 'red'
  },
  tile: {
    flex: 1,
    width: Dimensions.get('window').width * 0.85
    // backgroundColor: 'yellow'
  },
  tile2: {
    flex: 0.1,
    backgroundColor: 'rgba(255, 136, 0, 0.92)'
  }
})
