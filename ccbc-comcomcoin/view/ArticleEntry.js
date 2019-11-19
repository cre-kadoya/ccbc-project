import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableHighlight, KeyboardAvoidingView } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import moment from 'moment'
import 'moment/locale/ja'
import InAppHeader from './components/InAppHeader'
import ConfirmDialog from './components/ConfirmDialog'
import AlertDialog from './components/AlertDialog'

const restdomain = require('./common/constans.js').restdomain

export default class ArticleEntry extends Component {
  constructor(props) {
    super(props)
    this.state = {
      login_shain_pk: null,
      selectKijiCategory: null,
      selectKiji: null,
      editKiji: {
        t_kiji_pk: null,
        t_kiji_category_pk: null,
        t_shain_pk: null,
        title: "",
        contents: "",
        post_dt: "",
        post_tm: "",
        file_path: "",
        hashtag: [],
        hashtagStr: ""
      },
      imageData: {
        uri: "",
        type: ""
      },
      confirmDialogVisible: false,
      confirmDialogMessage: "",
      alertDialogVisible: false,
      alertDialogMessage: "",
    }
  }

  /** コンポーネントのマウント時処理 */
  componentWillMount = async () => {
    this.getPermissionAsync()

    // 記事照会画面からのパラメータ受け取り
    var selectKijiCategory = this.props.navigation.getParam("selectKijiCategory")
    var selectKiji = this.props.navigation.getParam("selectKiji")
    var editKiji = this.state.editKiji
    if (selectKiji != null) {
      // 編集時
      editKiji.t_kiji_pk = selectKiji.t_kiji_pk
      editKiji.t_kiji_category_pk = selectKiji.t_kiji_category_pk
      editKiji.t_shain_pk = selectKiji.t_shain_pk
      editKiji.title = selectKiji.title
      editKiji.contents = selectKiji.contents
      editKiji.post_dt = selectKiji.post_dt
      editKiji.post_tm = selectKiji.post_tm
      editKiji.file_path = selectKiji.file_path
      editKiji.hashtag = selectKiji.hashtag
      editKiji.hashtagStr = selectKiji.hashtagStr
    } else {
      // 新規投稿時
      editKiji.t_kiji_category_pk = selectKijiCategory.t_kiji_category_pk
      editKiji.t_shain_pk = this.state.login_shain_pk
    }
    this.setState({
      selectKijiCategory: selectKijiCategory,
      selectKiji: selectKiji,
      editKiji: editKiji
    })
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  /** 記事投稿ボタン押下 */
  onClickEntry = async () => {
    // 入力チェック
    if (this.state.editKiji.title == "") {
      this.setState({
        alertDialogVisible: true,
        alertDialogMessage: "タイトルを入力してください"
      })
      return
    }
    if (this.state.editKiji.contents == "") {
      this.setState({
        alertDialogVisible: true,
        alertDialogMessage: "記事の内容を入力してください"
      })
      return
    }

    // 確認ダイアログを表示（YESの場合、entry()を実行）
    this.setState({
      confirmDialogVisible: true,
      confirmDialogMessage: "記事を投稿します。よろしいですか？"
    })
  }

  entry = async () => {
    this.setState({ confirmDialogVisible: false })

    // APIパラメータ作成
    const data = new FormData()
    let editItem = this.state.editKiji
    let fileName = ""
    if (this.state.imageData.uri !== "") {
      // 画像ファイル
      fileName = moment(new Date()).format('YYYYMMDDHHmmssSS')
      data.append('imageData', {
        uri: this.state.imageData.uri,
        type: this.state.imageData.type,
        name: fileName
      })
      editItem.file_path = fileName
    }
    editItem.post_dt = new Date()
    editItem.post_tm = new Date()
    this.setState({
      editKiji: editItem
    })
    data.append('editKiji', this.state.editKiji)

    // 記事API.投稿処理の呼び出し（DB登録→BC登録）
    await fetch(restdomain + '/article/edit', {
      method: 'POST',
      mode: 'cors',
      body: data,
      headers: new Headers({ 'Accept': 'application/json', 'Content-Type': 'multipart/form-data' })
    })
      .then(
        function (response) {
          return response.json()
        }.bind(this)
      )
      .then(
        function (json) {
          if (!json.status) {
            // TODO：エラー処理
            alert("APIエラー")
          } else {
            // 記事照会画面に戻る
            this.props.navigation.navigate('ArticleRefer', {
              selectKijiCategory: this.state.selectKijiCategory
            })
          }
        }.bind(this)
      )
      .catch(error => console.error(error))
  }

  /** 画像選択処理 */
  onClickPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3]
    })
    let data = {}
    if (!result.cancelled) {
      data = {
        uri: result.uri,
        type: result.type
      }
    } else {
      data = {
        uri: "",
        type: ""
      }
    }
    this.setState({ imageData: data })
  }

  render() {
    return (
      <View>
        {/* -- 共有ヘッダ -- */}
        <InAppHeader navigate={this.props.navigation.navigate} />

        {/* -- 入力部 -- */}
        <KeyboardAvoidingView behavior="padding">
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ padding: 10 }}>
              <View>
                {/* 投稿先カテゴリ（表示のみ） */}
                <Text style={styles.inputTitle}>投稿先</Text>
                <TextInput
                  style={{ fontSize: 16, color: 'black', padding: 5 }}
                  value={this.state.selectKijiCategory.category_nm}
                  editable={false}
                />
              </View>
              <View>
                {/* タイトル */}
                <Text style={styles.inputTitle}>タイトル</Text>
                <TextInput
                  style={styles.inputText}
                  value={this.state.editKiji.title}
                  onChangeText={text => {
                    let editItem = this.state.editKiji
                    editItem.title = text
                    this.setState({
                      editKiji: editItem
                    })
                  }}
                />
              </View>
              <View>
                {/* ハッシュタグ */}
                <Text style={styles.inputTitle}>タグ（スペース区切り #は不要）</Text>
                <TextInput
                  style={styles.inputText}
                  value={this.state.editKiji.hashtagStr.replace(/#/g, ' ')}
                  onChangeText={text => {
                    let editItem = this.state.editKiji
                    editItem.hashtagStr = text
                    this.setState({
                      editKiji: editItem
                    })
                  }}
                />
              </View>
              <View
                style={{
                  marginTop: 10,
                  marginButtom: 10
                }}
              >
                {/* 記事内容 */}
                <Text style={styles.inputTitle}>
                  記事
                </Text>
                <TextInput
                  multiline={true}
                  numberOfLines={8}
                  style={[styles.inputText, { textAlignVertical: 'top' }]}
                  value={this.state.editKiji.contents}
                  onChangeText={text => {
                    let editItem = this.state.editKiji
                    editItem.contents = text
                    this.setState({
                      editKiji: editItem
                    })
                  }}
                />
              </View>
              {/* 画像 */}
              {(this.state.editKiji.file_path !== "" && this.state.imageData.uri === "") && (
                <View style={{ marginTop: 10 }}>
                  <Image
                    source={{ uri: restdomain + `/uploads/article/${this.state.editKiji.file_path}` }}
                    style={{ width: 300, height: 300 }} />
                </View>
              )}
              <TouchableHighlight onPress={() => this.onClickPickImage()}>
                <Text>画像選択</Text>
              </TouchableHighlight>
              {this.state.imageData.uri !== "" && (
                <View>
                  <Image
                    source={{ uri: this.state.imageData.uri }}
                    style={{
                      width: 250,
                      height: 250,
                      marginTop: 30,
                      marginBottom: 30
                    }}
                  />
                </View>
              )}
            </View>

            {/* -- 投稿ボタン -- */}
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <TouchableHighlight onPress={() => this.onClickEntry()}>
                  <View style={styles.saveButtonView}>
                    <View style={styles.saveButtonTitleView}>
                      <Text style={styles.saveButtonTitleText}>投稿する</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              </View>
            </View>

            {/* スクロールが最下部まで表示されないことの暫定対応... */}
            <View style={{ marginBottom: 200 }} />
          </ScrollView>
        </KeyboardAvoidingView>

        {/* -- 確認ダイアログ -- */}
        <ConfirmDialog
          modalVisible={this.state.confirmDialogVisible}
          message={this.state.confirmDialogMessage}
          handleYes={this.entry.bind(this)}
          handleNo={() => { this.setState({ confirmDialogVisible: false }) }}
          handleClose={() => { this.setState({ confirmDialogVisible: false }) }}
        />
        {/* -- メッセージダイアログ -- */}
        <AlertDialog
          modalVisible={this.state.alertDialogVisible}
          message={this.state.alertDialogMessage}
          handleClose={() => { this.setState({ alertDialogVisible: false }) }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  saveButtonView: {
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: 'rgba(255, 136, 0, 0.92)',
    flexDirection: 'row'
  },
  saveButtonTitleView: {
    flex: 8,
    alignItems: 'center'
  },
  saveButtonTitleText: {
    fontSize: 26,
    color: 'white',
    padding: 10
  },
  nonReadMark: {
    color: 'white',
    backgroundColor: '#FF3333',
    padding: 0,
    borderRadius: 40,
    borderWidth: 0,
    borderColor: 'white',
    overflow: 'hidden'
  },
  dateTimeText: {
    fontSize: 14,
    color: 'gray'
  },
  inputTitle: {
    marginTop: 10,
    fontSize: 16,
    color: 'gray'
  },
  inputText: {
    fontSize: 16,
    color: 'black',
    padding: 5,
    borderColor: 'gray',
    borderWidth: 1
  }
})