import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Alert,
  ScrollView,
  TextInput,
  TouchableHighlight,
  KeyboardAvoidingView
} from 'react-native'
import { Button, Icon, Avatar, Card } from 'react-native-elements'
import moment from 'moment'
import 'moment/locale/ja'

const restdomain = require('./common/constans.js').restdomain

export default class Kiji extends Component {
  state = {
    login_shain_pk: 1,
    login_shain_name: "佐藤　陸",
    current_kiji_category_pk: null,
    mode: 'select',
    kijiCategory: [
      { t_kiji_category_pk: 1, category_nm: "ライフハック", midoku_cnt: 0 },
      { t_kiji_category_pk: 2, category_nm: "おすすめの本", midoku_cnt: 1 },
      { t_kiji_category_pk: 3, category_nm: "イベント情報", midoku_cnt: 10 },
      { t_kiji_category_pk: 4, category_nm: "美味しいお店", midoku_cnt: 0 },
      { t_kiji_category_pk: 5, category_nm: "その他", midoku_cnt: 0 },
    ],
    selectKijiCategory: null,
    dispKijiList: [
      {
        t_kiji_pk: 1, t_shain_pk: 1, title: "マラソン大会へのお誘い",
        contents: "今年もこの時期がやってまいりました！\n北海道の大自然の中を颯爽と走る事ができるマラソン大会です。\n自然あふれる風景を満喫しながら走りませんか？\nフルマラソンだけでなく、20kmや10kmもありますので、初心者の方も是非どうぞ。\n\n申し込み用のホームページです\nhttps://xxxxxxxxxx.jp/123456789-entry",
        post_dt: "2019/07/01", post_tm: "10:00", file_path: "",
        shain_nm: "佐藤　陸", shain_image_path: "",
        hashtagStr: "#スポーツ　#マラソン　",
        hashtag: [
          { seq_no: 1, hashtag: "スポーツ" },
          { seq_no: 2, hashtag: "マラソン" }],
        good_flg: "1", favorite_flg: "1"
      },
      {
        post_dt: "2019/07/02", post_tm: "9:00", file_path: "",
        t_kiji_pk: 2, t_shain_pk: 2, title: "ビアガーデン開催",
        contents: "どこよりも早く、会社の最寄り駅にてビアガーデンが開催されるようです。\n今年から始まるとの事で、イベントも盛り沢山みたいですね。\n\nURLを貼っておきますので、是非見てください。\nhttps://xxxxxxxxxx-xxxxx.jp\nちなみに私は来週の金曜日にチームメンバーと繰り出そうと思っています！",
        shain_nm: "佐々木　澪", shain_image_path: "",
        hashtagStr: "#飲み会　#お店　",
        hashtag: [
          { seq_no: 3, hashtag: "飲み会" },
          { seq_no: 4, hashtag: "お店" }],
        good_flg: "1", favorite_flg: "1"
        },
      {
        t_kiji_pk: 3, t_shain_pk: 3, title: "ビアガーデン開催2",
        contents: "どこよりも早く、会社の最寄り駅にてビアガーデンが開催されるようです。2",
        post_dt: "2019/07/02", post_tm: "9:00", file_path: "",
        shain_nm: "佐々木　澪", shain_image_path: "",
        hashtagStr: "#飲み会　#お店　",
        hashtag: [
          { seq_no: 3, hashtag: "飲み会" },
          { seq_no: 4, hashtag: "お店" }],
        good_flg: "1", favorite_flg: "1"
      },
      {
        t_kiji_pk: 4, t_shain_pk: 4, title: "ビアガーデン開催3",
        contents: "どこよりも早く、会社の最寄り駅にてビアガーデンが開催されるようです。3",
        post_dt: "2019/07/02", post_tm: "9:00", file_path: "",
        shain_nm: "佐々木　澪", shain_image_path: "",
        hashtagStr: "#飲み会　#お店　",
        hashtag: [
          { seq_no: 3, hashtag: "飲み会" },
          { seq_no: 4, hashtag: "お店" }],
        good_flg: "1", favorite_flg: "1"
      },
    ],
    editKiji: null,
  }


  /**
   * 画面遷移イベント
   */

  // 記事選択画面へ遷移
  async moveSelect() {
    this.setState({
      mode: 'select'
    })
  }

  // 記事投稿画面へ遷移
  async moveInput(selectKiji) {
    if (selectKiji == null) {
      selectKiji = {
        t_kiji_pk: null,
        t_shain_pk: this.state.login_shain_pk, title: "",
        contents: "",
        post_dt: "",
        post_tm: "",
        file_path: "",
        shain_nm: this.state.login_shain_name,
        shain_image_path: "",
        hashtagStr: "",
        hashtag: [],
        good_flg: "0",
        favorite_flg: "0"
      }

    }
    this.setState({
      mode: 'input',
      editKiji: selectKiji
    })
  }

  // 記事照会画面へ遷移
  moveRead(selectKijiCategory) {
    this.setState({
      mode: 'read'
    })
    if (selectKijiCategory != null) {
      this.setState({
        current_kiji_category_pk: selectKijiCategory.t_kiji_category_pk,
        selectKijiCategory: selectKijiCategory
      })
    }
  }

  /**
   * 記事投稿画面のイベント
   */

  // 記事投稿ボタン押下
  async clickEntryArticle() {
    // 入力チェック
    if (this.state.title == "") {
      alert("タイトルを入力してください")
    }
    if (this.state.contents == "") {
      alert("記事の内容を入力してください")
    }

    // 記事API.投稿処理の呼び出し（DB登録→BC登録）
    await fetch(restdomain + '/kiji/Entry', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(this.state),
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

    // 遷移元画面に戻る
    this.moveRead(this.state.selectKijiCategory)
  }

  // 画像選択処理
  async choiceImage() {

  }

  /**
   * 記事照会画面のイベント
   */

   // いいねボタン押下
   async clickGoodBtn(index) {
    // stateの内容を書き換え
    var wkDispKijiList = this.state.dispKijiList
    var selectKiji = wkDispKijiList[index]
    selectKiji.good_flg = selectKiji.good_flg == "0" ? "1" : "0"
    wkDispKijiList[index] = selectKiji
    this.setState({dispKijiList: wkDispKijiList})
    
    // 記事API.いいね処理の呼び出し（DB登録）
    await fetch(restdomain + '/kiji/good', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(this.state),
      headers: new Headers({ 'Content-type': 'application/json' })
    })
      .then(function(response) {
        return response.json()
      })
      .then(
        function(json) {
        }.bind(this)
      )
      .catch(error => console.error(error))
  }

  // お気に入りボタン押下
  async clickFavoriteBtn(index) {
    // stateの内容を書き換え
    var wkDispKijiList = this.state.dispKijiList
    var selectKiji = wkDispKijiList[index]
    selectKiji.favorite_flg = selectKiji.favorite_flg == "0" ? "1" : "0"
    wkDispKijiList[index] = selectKiji
    this.setState({dispKijiList: wkDispKijiList})
    
    // 記事API.お気に入り処理の呼び出し（DB登録）
    await fetch(restdomain + '/kiji/favorite', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(this.state),
      headers: new Headers({ 'Content-type': 'application/json' })
    })
      .then(function(response) {
        return response.json()
      })
      .then(
        function(json) {
        }.bind(this)
      )
      .catch(error => console.error(error))
  }

  // 新規投稿ボタン押下
  async clickNewArticleBtn() {
    // 記事投稿画面へ遷移
    this.moveInput(null)
  }

  // 記事修正ボタン押下
  async clickEditArticleBtn(index) {
    // 記事投稿画面へ遷移（修正対象の記事情報を設定）
    this.moveInput(this.state.dispKijiList[index])
  }

  // 記事検索ボタン押下
  async clickSearchArticleBtn() {
    // 記事検索ダイアログを表示

  }

  // スクロール最下部到達（次の記事の読み込み）
  async reachScrollBottom() {
    // 記事API.記事検索処理の呼び出し（次の記事の読み込み）
  }

  /**
   * 検索ダイアログ画面のイベント
   */

  // 検索ボタン押下
  async clickDlgSearchArticleBtn() {
    // 記事API.記事検索処理の呼び出し（条件付与）
    
  }

  // クリアボタン押下
  async clickDlgClearBtn() {
    // 記事API.記事検索処理の呼び出し

  }

  // 閉じるボタン押下
  async clickDlgCloseBtn() {

  }

  render() {
    if (this.state.mode == 'select') {
      return (
        <View>
          {/* -- 画面タイトル -- */}
          <View style={styles.screenTitleView}>
            <Text style={styles.screenTitleText}>記事を選択</Text>
          </View>
          {/* -- 記事カテゴリ（繰り返し） -- */}
          {this.state.kijiCategory.map((itemKijiCat, i) => {
            return (
              <TouchableHighlight onPress={() => this.moveRead(itemKijiCat)} key={i}>
                <View style={styles.articleLine}>
                  <View style={styles.articleTitleView}>
                    <Text style={styles.articleTitleText}>{"　　" + itemKijiCat.category_nm}</Text>
                  </View>
                  {/* 未読マーク */}
                  {(() => {
                    if (itemKijiCat.midoku_cnt > 0) {
                      return (
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                          <Text style={styles.nonReadMark}>{'   ' + itemKijiCat.midoku_cnt + '   '}</Text>
                        </View>
                      )
                    }
                  })()}
                  <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 10 }}>
                    <Icon name="chevron-right" type="font-awesome" color="white" />
                  </View>
                </View>
              </TouchableHighlight>
            )
          })}
        </View>
      )
    } else if (this.state.mode == 'read') {
      return (
        <View>
          {/* -- 画面タイトル -- */}
          <View style={[styles.screenTitleView, { flexDirection: 'row' }]}>
            <View
              style={{
                flex: 2,
                alignItems: 'flex-start',
                marginLeft: 10
              }}
            >
              <Icon
                name="chevron-left"
                type="font-awesome"
                color="white"
                onPress={() => this.moveSelect()}
              />
            </View>
            <View style={{ flex: 7, alignItems: 'center' }}>
              <Text style={styles.screenTitleText}>{this.state.selectKijiCategory.category_nm}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Icon name="search" type="font-awesome" color="white" />
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 10 }}>
              <Icon
                name="edit"
                type="font-awesome"
                color="white"
                onPress={() => this.moveInput(null)}
              />
            </View>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* -- 記事表示（繰り返し） -- */}
            {this.state.dispKijiList.map((itemKiji, i) => {
              return (
                <Card key={i}>
                  <View style={{ flexDirection: 'row' }}>
                    {/* 投稿情報 */}
                    <View style={{ flex: 1, alignItems: 'center', marginRight: 5 }}>
                      <Text style={styles.dateTimeText}>
                        {moment(new Date(itemKiji.post_dt)).format('M/D')}
                      </Text>
                      <Text style={styles.dateTimeText}>
                        {moment(new Date(itemKiji.post_dt + " " + itemKiji.post_tm)).format('H:mm')}
                      </Text>
                      <Avatar
                        rounded
                        source={{
                          uri: restdomain + `/uploads/${itemKiji.shain_image_path}`
                        }}
                        activeOpacity={0.7}
                      />
                    </View>
                    <View style={{ flex: 4 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 4 }}>
                          <Text style={{ fontSize: 20, color: 'black' }}>
                            {itemKiji.shain_nm}
                          </Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                          <Icon
                            name="pencil"
                            type="font-awesome"
                            onPress={() => this.moveInput(itemKiji)}
                          />
                        </View>
                      </View>
                      {/* タイトル */}
                      <Text style={{ fontSize: 16, color: 'blue' }}>
                        【{itemKiji.title}】
                      </Text>
                      {/* ハッシュタグ */}
                      <Text style={{ fontSize: 12, color: 'blue' }}>
                        {itemKiji.hashtagStr}
                      </Text>
                    </View>
                  </View>
                  {/* 記事内容 */}
                  <View style={{ marginTop: 10 }}>
                    <Text>
                      {itemKiji.contents}
                    </Text>
                  </View>
                  {/* 画像 */}
                  <View style={{ marginTop: 10 }}>
                    <Image
                      source={{
                        uri: restdomain + `/uploads/kiji/${itemKiji.file_path}`
                      }} />
                  </View>
                  {/* TODO : いいね */}
                  {/* TODO : お気に入り */}
                </Card>
              )
            })}
          </ScrollView>
        </View>
      )
    } else if (this.state.mode == 'input') {
      {/* ■■ 記事投稿画面 ■■ */ }
      return (
        <View>
          {/* -- 画面タイトル -- */}
          <View style={[styles.screenTitleView, { flexDirection: 'row' }]}>
            <View
              style={{
                flex: 1,
                alignItems: 'flex-start',
                marginLeft: 10
              }}
            >
              <Icon
                name="chevron-left"
                type="font-awesome"
                color="white"
                onPress={() => this.moveRead(this.state.selectKijiCategory)}
              />
            </View>
            <View style={{ flex: 7, alignItems: 'center' }}>
              <Text style={styles.screenTitleText}>記事投稿</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }} />
          </View>
          <KeyboardAvoidingView behavior="padding">
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ padding: 10 }}>
                <View>
                  <Text style={styles.inputTitle}>投稿先</Text>
                  <TextInput
                    style={{ fontSize: 16, color: 'black', padding: 5 }}
                    value={this.state.selectKijiCategory.category_nm}
                    editable={false}
                  />
                </View>
                <View>
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
                  <Text style={styles.inputTitle}>タグ</Text>
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
                  <Text style={[styles.inputTitle, { padding: 5 }]}>
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
              <TouchableHighlight onPress={() => this.clickEntryArticle()}>
                <View style={styles.saveButton}>
                  <View style={styles.articleTitleView}>
                    <Text style={styles.articleTitleText}>投稿する</Text>
                  </View>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
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
  saveButton: {
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#6666DD',
    flexDirection: 'row'
  },
  articleLine: {
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
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