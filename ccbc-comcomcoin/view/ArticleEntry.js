import React, { Component } from 'react'
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableHighlight, KeyboardAvoidingView } from 'react-native'
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
      confirmDialogVisible: false,
      confirmDialogMessage: "",
      alertDialogVisible: false,
      alertDialogMessage: "",
    }
  }
  
  /** コンポーネントのマウント時処理 */
  async componentWillMount() {
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

  /** 記事投稿ボタン押下 */
  async onClickEntry() {
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

  async entry() {
    this.setState({confirmDialogVisible: false})

    // 記事API.投稿処理の呼び出し（DB登録→BC登録）
    await fetch(restdomain + '/kiji/Entry', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(this.state.editKiji),
      headers: new Headers({ 'Content-type': 'application/json' })
    })
      .then(function(response) {
        return response.json()
      })
      .then(
        function(json) {
          // TODO : HARVESTの投票などを参考にする
          // エラーの場合はメッセージを表示して終了
          if (typeof json.data === 'undefined') {
            return
          }
        }.bind(this)
      )
      .catch(error => console.error(error))

    // 記事照会画面に戻る
    this.props.navigation.navigate('ArticleRefer', {
      selectKijiCategory: this.state.selectKijiCategory
    })
  }

  // 画像選択処理
  async choiceImage() {
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
              {/* TODO : 画像 */}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
        {/* -- 確認ダイアログ -- */}
        <ConfirmDialog
          modalVisible={this.state.confirmDialogVisible}
          message={this.state.confirmDialogMessage}
          handleYes={this.entry.bind(this)}
          handleNo={()=>{this.setState({confirmDialogVisible: false})}}
          handleClose={()=>{this.setState({confirmDialogVisible: false})}}
        />
        {/* -- メッセージダイアログ -- */}
        <AlertDialog
          modalVisible={this.state.alertDialogVisible}
          message={this.state.alertDialogMessage}
          handleClose={()=>{this.setState({alertDialogVisible: false})}}
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