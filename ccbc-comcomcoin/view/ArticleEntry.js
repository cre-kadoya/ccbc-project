import React from 'react'
import { StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableHighlight, KeyboardAvoidingView } from 'react-native'
import { Icon } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import moment from 'moment'
import 'moment/locale/ja'
import BaseComponent from './components/BaseComponent'
import InAppHeader from './components/InAppHeader'
import ConfirmDialog from './components/ConfirmDialog'
import AlertDialog from './components/AlertDialog'

const restdomain = require('./common/constans.js').restdomain
const CHAR_LEN_TITLE = 30
const CHAR_LEN_HASHTAG = 10
const CHAR_LEN_CONTENTS = 1000
const HASHTAG_UPPER_LIMIT = 3

export default class ArticleEntry extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
      mode: "",
      selectCategory: null,
      selectArticle: null,
      t_kiji_pk: "",
      t_kiji_category_pk: "",
      t_shain_pk: "",
      title: "",
      contents: "",
      post_dt: "",
      post_tm: "",
      file_path: "",
      hashtag_str: "",
      imageData: {
        uri: "",
        type: "",
        name: ""
      },
      categoryNm: "",
      confirmDialogVisible: false,
      confirmDialogMessage: "",
      alertDialogVisible: false,
      alertDialogMessage: "",
    }
  }

  /** コンポーネントのマウント時処理 */
  componentWillMount = async () => {
    // ログイン情報の取得（BaseComponent）
    await this.getLoginInfo()

    // スマホの画像機能へのアクセス許可
    this.getPermissionAsync()

    // 記事照会画面からのパラメータ受け取り
    const mode = this.props.navigation.getParam("mode")
    const paramCategory = this.props.navigation.getParam("selectCategory")
    const paramArticle = this.props.navigation.getParam("selectArticle")
    if (paramArticle !== null) {
      // 編集時
      this.setState({
        t_kiji_pk: paramArticle.t_kiji_pk,
        t_kiji_category_pk: paramArticle.t_kiji_category_pk,
        t_shain_pk: paramArticle.t_shain_pk,
        title: paramArticle.title,
        contents: paramArticle.contents,
        post_dt: paramArticle.post_dt,
        post_tm: paramArticle.post_tm,
        file_path: paramArticle.file_path,
        hashtag_str: paramArticle.hashtag_str.replace(/#/g, ' ')
      })
    } else {
      // 新規投稿時
      this.setState({
        t_kiji_category_pk: paramCategory.t_kiji_category_pk,
        t_shain_pk: this.state.login_shain_pk
      })
    }
    this.setState({
      mode: mode,
      selectCategory: paramCategory,
      selectArticle: paramArticle,
      categoryNm: paramCategory.category_nm
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
    var alertMessage = ""
    if (this.state.title == "") {
      alertMessage += "タイトルを入力してください\n\n"
    }
    if (this.state.contents == "") {
      alertMessage += "記事の内容を入力してください\n\n"
    }
    if (this.state.title.length > CHAR_LEN_TITLE) {
      alertMessage += "タイトルの文字数が超過しています" + "（" + this.state.title.length + "文字）\n\n"
    }
    var hashes = this.state.hashtag_str.replace("　", " ").split(" ")
    if (hashes.length > HASHTAG_UPPER_LIMIT) {
      alertMessage += "タグの数は" + HASHTAG_UPPER_LIMIT + "つまでです\n\n"
    } else {
      for (var i = 0; i < hashes.length; i++) {
        if (hashes[i].length > CHAR_LEN_HASHTAG) {
          alertMessage += "タグの文字数が超過しています" + "（" + hashes[i].length + "文字）\n\n"
        }
      }
    }
    if (this.state.contents.length > CHAR_LEN_CONTENTS) {
      alertMessage += "記事の文字数が超過しています" + "（" + this.state.contents.length + "文字）\n\n"
    }
    if (alertMessage !== "") {
      this.setState({
        alertDialogVisible: true,
        alertDialogMessage: alertMessage
      })
      return
    }

    // 確認ダイアログを表示（YESの場合、entry()を実行）
    this.setState({
      confirmDialogVisible: true,
      confirmDialogMessage: "記事を投稿します。よろしいですか？"
    })
  }

  /** 記事更新処理 */
  entry = async () => {
    this.setState({ confirmDialogVisible: false })

    // APIパラメータ作成
    const data = new FormData()
    data.append('db_name', this.state.db_name)
    data.append('loginShainPk', this.state.loginShainPk)

    // 画像ファイル
    let fileName = ""
    if (this.state.imageData.uri !== "") {
      fileName = moment(new Date()).format('YYYYMMDDHHmmssSS') + ".png"
      data.append('imageData', {
        uri: this.state.imageData.uri,
        type: this.state.imageData.type,
        name: fileName
      })
    } else if (this.state.file_path !== "") {
      fileName = this.state.file_path
    }
    data.append('t_kiji_pk', this.state.t_kiji_pk)
    data.append('t_kiji_category_pk', this.state.t_kiji_category_pk)
    data.append('t_shain_pk', this.state.t_shain_pk)
    data.append('title', this.state.title)
    data.append('contents', this.state.contents)
    data.append('post_dt', new Date())
    data.append('post_tm', new Date())
    data.append('file_path', fileName)
    data.append('hashtag', this.state.hashtag)
    data.append('hashtag_str', this.state.hashtag_str)
    // data.append('editArticle', {
    //   t_kiji_pk: this.state.t_kiji_pk,
    //   t_kiji_category_pk: this.state.t_kiji_category_pk,
    //   t_shain_pk: this.state.t_shain_pk,
    //   title: this.state.title,
    //   contents: this.state.contents,
    //   post_dt: new Date(),
    //   post_tm: new Date(),
    //   file_path: fileName,
    //   hashtag: this.state.hashtag,
    //   hashtag_str: this.state.hashtag_str
    // })

    // 記事API.投稿処理の呼び出し（DB登録→BC登録）
    await fetch(restdomain + '/article/edit', {
      method: 'POST',
      mode: 'cors',
      body: data,
      // body: JSON.stringify(this.state),
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
              mode: this.state.mode,
              selectCategory: this.state.selectCategory
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
          <View style={{ height: "90%" }}>
            <ScrollView>
              <View style={{ padding: 10 }}>
                <View>
                  {/* 投稿先カテゴリ（表示のみ） */}
                  <Text style={styles.inputTitle}>投稿先</Text>
                  <TextInput
                    style={{ fontSize: 16, color: 'black', padding: 5 }}
                    value={this.state.categoryNm}
                    editable={false}
                  />
                </View>
                <View>
                  {/* タイトル */}
                  <Text style={styles.inputTitle}>{"タイトル（" + CHAR_LEN_TITLE + "文字以内）"}</Text>
                  <TextInput
                    style={styles.inputText}
                    value={this.state.title}
                    onChangeText={text => { this.setState({ title: text }) }}
                  />
                </View>
                <View>
                  {/* ハッシュタグ */}
                  <Text style={styles.inputTitle}>
                    {"タグ（1タグ" + CHAR_LEN_HASHTAG + "文字以内、スペース区切りで" + HASHTAG_UPPER_LIMIT + "つまで #は不要）"}
                  </Text>
                  <TextInput
                    style={styles.inputText}
                    value={this.state.hashtag_str}
                    onChangeText={text => { this.setState({ hashtag_str: text }) }}
                  />
                </View>
                <View style={{ marginTop: 10, marginButtom: 10 }}>
                  {/* 記事内容 */}
                  <Text style={styles.inputTitle}>
                    {"記事（" + CHAR_LEN_CONTENTS + "文字以内）"}
                  </Text>
                  <TextInput
                    multiline={true}
                    numberOfLines={8}
                    style={[styles.inputText, { textAlignVertical: 'top' }]}
                    value={this.state.contents}
                    onChangeText={text => { this.setState({ contents: text }) }}
                  />
                </View>
                {/* 画像 */}
                <View>
                  <Text style={styles.inputTitle}>画像</Text>
                  {(this.state.file_path !== "" && this.state.imageData.uri === "") && (
                    <View style={{ marginTop: 10 }}>
                      <Image
                        source={{ uri: restdomain + `/uploads/article/${this.state.file_path}` }}
                        style={{ width: 300, height: 300 }} />
                    </View>
                  )}
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
                  <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    {/* 画像選択ボタン */}
                    <View style={{ flex: 1, alignItems: 'flex-start', marginLeft: 10 }}>
                      <TouchableHighlight onPress={() => this.onClickPickImage()}>
                        <View style={styles.selectButtonView}>
                          <View style={styles.selectButtonTitleView}>
                            <Text style={styles.selectButtonTitleText}>画像選択</Text>
                          </View>
                        </View>
                      </TouchableHighlight>
                    </View>
                    {/* 画像削除アイコン */}
                    <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 10 }}>
                      <Icon name="times-circle" type="font-awesome" color="black"
                        onPress={() => { this.setState({ imageData: { uri: "" }, file_path: "" }) }}
                      />
                    </View>
                  </View>
                </View>
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
            </ScrollView>
          </View>
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
  selectButtonView: {
    borderRadius: 20,
    // alignItems: 'center',
    // marginTop: 30,
    // marginLeft: 10,
    // marginRight: 10,
    width: 100,
    backgroundColor: 'lightblue',
    // flexDirection: 'row'
  },
  selectButtonTitleView: {
    // flex: 1,
    alignItems: 'center'
  },
  selectButtonTitleText: {
    fontSize: 16,
    color: 'white',
    padding: 10
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