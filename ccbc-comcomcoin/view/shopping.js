import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Alert,
  TextInput
} from 'react-native'
import { BarCodeScanner, Permissions } from 'expo'
import { Button, Icon, Card, Divider } from 'react-native-elements'

const { width } = Dimensions.get('window')
const qrSize = width * 0.7
const iconButtonSize = 20

export default class Shopping extends Component {
  state = {
    mode: 'cart',
    hasCameraPermission: null,
    totalCoin: 250,
    itemCnt: 2
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({
      hasCameraPermission: status === 'granted'
    })
  }

  handleBarCodeScanned = ({ type, data }) => {
    Alert.alert('barcode type:' + type + ' \ndata: ' + data)
    //Alert.alert(data);
    this.setState({
      mode: 'cart'
    })
  }

  cancelCamera() {
    // Alert.alert("読み取り終了しますか？");
    this.setState({
      mode: 'cart'
    })
  }

  moveCamera() {
    this.setState({
      mode: 'camera'
    })
  }

  moveCart() {
    this.setState({
      mode: 'cart'
    })
  }

  moveInput() {
    this.setState({
      mode: 'input'
    })
  }

  pay() {
    Alert.alert('支払いを確定します。\nよろしいですか？')
  }

  render() {
    const { hasCameraPermission } = this.state
    if (hasCameraPermission === null) {
      return <Text>カメラにアクセスを許可しますか？</Text>
    }
    if (hasCameraPermission === false) {
      return <Text>カメラにアクセスできません</Text>
    }

    if (this.state.mode == 'camera') {
      return (
        <BarCodeScanner
          onBarCodeRead={this.handleBarCodeScanned}
          style={[StyleSheet.absoluteFill, styles.container]}
        >
          <View style={styles.layerTop}>
            <Text style={styles.description}>Scan QR code</Text>
          </View>
          <View style={styles.layerCenter}>
            <View style={styles.layerLeft} />
            <View style={styles.focused} />
            <View style={styles.layerRight} />
          </View>
          <View style={styles.layerBottom}>
            <Text onPress={() => this.cancelCamera()} style={styles.cancel}>
              Cancel
            </Text>
          </View>
        </BarCodeScanner>
      )
    } else if (this.state.mode == 'cart' || this.state.mode == 'input') {
      return (
        <View>
          <View
            style={[
              styles.screenTitleView,
              {
                flexDirection: 'row'
              }
            ]}
          >
            <View
              style={{
                flex: 1,
                alignItems: 'flex-start',
                marginLeft: 10
              }}
            >
              <Icon name="chevron-left" type="font-awesome" color="white" />
            </View>
            <View style={{ flex: 7, alignItems: 'center' }}>
              <Text style={styles.screenTitleText}>ショッピングカート</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }} />
          </View>
          <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: 'row', marginLeft: 20 }}>
              <View>
                <View>
                  <View>
                    <Text style={{ fontSize: 22, color: 'gray' }}>残高</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 26 }}>1,510 コイン</Text>
                  </View>
                </View>
                <View>
                  <View>
                    <Text style={{ fontSize: 22, color: 'gray' }}>合計</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 26 }}>
                      {this.state.totalCoin} コイン
                      {'  '}
                      {this.state.itemCnt}個
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  marginTop: 5,
                  flex: 1,
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end'
                }}
              >
                <Button
                  title="支払い"
                  icon={{ name: 'yen', type: 'font-awesome' }}
                  onPress={() => this.pay()}
                  textStyle={{ fontSize: 24 }}
                  buttonStyle={{
                    backgroundColor: 'gray',
                    borderRadius: 10,
                    width: 130
                  }}
                />
              </View>
            </View>
          </View>
          <Card title="カートの内容">
            {/* 1行目 */}
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 4 }}>
                <Text style={{ fontSize: 26 }}>ペットボトル（お茶）</Text>
                <Text style={{ fontSize: 26 }}>100 コイン</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Icon name="trash" type="font-awesome" size={iconButtonSize} />
              </View>
            </View>
            <View style={{ marginTop: 10, marginBottom: 10 }}>
              <Divider style={{ backgroundColor: 'lightgray' }} />
            </View>
            {/* 2行目 */}
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 4 }}>
                <Text style={{ fontSize: 26 }}>カップラーメン</Text>
                <Text style={{ fontSize: 26 }}>150 コイン</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Icon name="trash" type="font-awesome" size={iconButtonSize} />
              </View>
            </View>
          </Card>
          {(() => {
            if (this.state.mode == 'cart') {
              return (
                <View style={{ marginTop: 80 }}>
                  <View>
                    <Button
                      title="続けて買い物"
                      icon={{ name: 'shopping-cart', type: 'font-awesome' }}
                      onPress={() => this.moveCamera()}
                      textStyle={{ fontSize: 24 }}
                      buttonStyle={{
                        backgroundColor: 'gray',
                        borderRadius: 10
                      }}
                    />
                  </View>
                </View>
              )
            } else {
              return (
                <Card>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 2 }}>
                      <Text style={{ fontSize: 16, color: 'gray' }}>
                        コイン
                      </Text>
                      <TextInput value=" 150" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16 }}>{'\n'}×</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                      <Text style={{ fontSize: 16, color: 'gray' }}>num</Text>
                      <TextInput value=" 1" />
                    </View>
                    <View style={{ flex: 2, marginLeft: 10 }}>
                      <Text style={{ fontSize: 16, color: 'gray' }}>total</Text>
                      <Text style={{ fontSize: 16 }}>150 コイン</Text>
                    </View>
                  </View>
                  <View>
                    <Text style={{ fontSize: 16, color: 'gray' }}>item</Text>
                    <TextInput value=" カップラーメン" />
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                      <Button
                        title="add"
                        onPress={() => this.moveCart()}
                        buttonStyle={{
                          width: 120,
                          borderRadius: 10
                        }}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Button
                        title="cancel"
                        onPress={() => this.moveCart()}
                        buttonStyle={{
                          width: 120,
                          borderRadius: 10
                        }}
                      />
                    </View>
                  </View>
                </Card>
              )
            }
          })()}
        </View>
      )
    }
  }
}

const opacity = 'rgba(0, 0, 0, .6)'
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  layerTop: {
    flex: 1,
    backgroundColor: opacity
  },
  layerCenter: {
    flex: 1,
    flexDirection: 'row'
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity
  },
  focused: {
    flex: 8
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity
  },
  layerBottom: {
    flex: 1,
    backgroundColor: opacity
  },
  description: {
    fontSize: 25,
    marginTop: '40%',
    textAlign: 'center',
    color: 'white'
  },
  cancel: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    marginTop: '30%'
  },
  screenTitleView: {
    alignItems: 'center',
    marginTop: 25,
    backgroundColor: '#ff5622'
  },
  screenTitleText: {
    fontSize: 26,
    color: 'white',
    padding: 10
  },
  itemLine: {
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: 'cornflowerblue',
    flexDirection: 'row'
  }
})
