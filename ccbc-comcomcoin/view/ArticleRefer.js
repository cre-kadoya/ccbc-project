import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, ScrollView, Modal, TextInput } from 'react-native'
import { Icon, Avatar, Card } from 'react-native-elements'
import moment from 'moment'
import 'moment/locale/ja'
import InAppHeader from './components/InAppHeader'

const restdomain = require('./common/constans.js').restdomain

export default class ArticleRefer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      login_shain_pk: null,
      selectKijiCategory: null,
      dispKijiList: [],
			editKiji: null,
			searchDialogVisible: false,
			searchCondYear: "",
			searchCondKeyword: "",
			searchCondHashtag: "",
    }
  }

  /** コンポーネントのマウント時処理 */
  componentWillMount = async () => {
    // 記事選択画面からのパラメータ受け取り
    var selectKijiCategory = this.props.navigation.getParam("selectKijiCategory")

    // TODO : スタブデータ
    var t_kiji_category_pk = selectKijiCategory.t_kiji_category_pk
    this.setState({
      login_shain_pk: 1,
      dispKijiList: [
        {
          t_kiji_pk: 1, t_shain_pk: 1, title: "マラソン大会へのお誘い",
          t_kiji_category_pk: t_kiji_category_pk,
          contents: "今年もこの時期がやってまいりました！\n北海道の大自然の中を颯爽と走る事ができるマラソン大会です。\n自然あふれる風景を満喫しながら走りませんか？\nフルマラソンだけでなく、20kmや10kmもありますので、初心者の方も是非どうぞ。\n\n申し込み用のホームページです\nhttps://xxxxxxxxxx.jp/123456789-entry",
          post_dt: "2019/07/15", post_tm: "10:57", file_path: "",
          shain_nm: "佐藤　陸", shain_image_path: "",
          hashtagStr: "#スポーツ　#マラソン　",
          hashtag: [
            { seq_no: 1, hashtag: "スポーツ" },
            { seq_no: 2, hashtag: "マラソン" }],
          good_flg: "1", favorite_flg: "1"
        },
        {
          t_kiji_pk: 2, t_shain_pk: 2, title: "ビアガーデン開催",
          t_kiji_category_pk: t_kiji_category_pk,
          contents: "どこよりも早く、会社の最寄り駅にてビアガーデンが開催されるようです。\n今年から始まるとの事で、イベントも盛り沢山みたいですね。\n\nURLを貼っておきますので、是非見てください。\nhttps://xxxxxxxxxx-xxxxx.jp\nちなみに私は来週の金曜日にチームメンバーと繰り出そうと思っています！",
          post_dt: "2019/07/02", post_tm: "19:09", file_path: "",
          shain_nm: "佐々木　澪", shain_image_path: "",
          hashtagStr: "#飲み会　#お店　",
          hashtag: [
            { seq_no: 3, hashtag: "飲み会" },
            { seq_no: 4, hashtag: "お店" }],
          good_flg: "1", favorite_flg: "1"
          },
        {
          t_kiji_pk: 3, t_shain_pk: 3, title: "ビアガーデン開催2",
          t_kiji_category_pk: t_kiji_category_pk,
          contents: "どこよりも早く、会社の最寄り駅にてビアガーデンが開催されるようです。2",
          post_dt: "2019/07/02", post_tm: "9:35", file_path: "",
          shain_nm: "佐々木　澪", shain_image_path: "",
          hashtagStr: "#飲み会　#お店　",
          hashtag: [
            { seq_no: 3, hashtag: "飲み会" },
            { seq_no: 4, hashtag: "お店" }],
          good_flg: "1", favorite_flg: "1"
        },
        {
          t_kiji_pk: 4, t_shain_pk: 4, title: "ビアガーデン開催3",
          t_kiji_category_pk: t_kiji_category_pk,
          contents: "どこよりも早く、会社の最寄り駅にてビアガーデンが開催されるようです。3",
          post_dt: "2019/07/02", post_tm: "7:05", file_path: "",
          shain_nm: "佐々木　澪", shain_image_path: "",
          hashtagStr: "#飲み会　#お店　",
          hashtag: [
            { seq_no: 3, hashtag: "飲み会" },
            { seq_no: 4, hashtag: "お店" }],
          good_flg: "1", favorite_flg: "1"
        },
      ]
    })

    this.setState({
      selectKijiCategory: selectKijiCategory
    })
  }

  /** 記事投稿画面へ遷移 */
  moveEntry = async (index) => {
		var selectKiji = null
		// 編集の場合は対象リストのindexを指定、新規の場合はindexはnull
    if (index != null) {
      var selItem = this.state.dispKijiList[index]
      selectKiji = {
        t_kiji_pk: selItem.t_kiji_pk,
        t_kiji_category_pk: selItem.t_kiji_category_pk,
        t_shain_pk: selItem.t_shain_pk,
        title: selItem.title,
        contents: selItem.contents,
        post_dt: selItem.post_dt,
        post_tm: selItem.post_tm,
        file_path: selItem.file_path,
        hashtag: selItem.hashtag,
        hashtagStr: selItem.hashtagStr
      }
    }

    this.props.navigation.navigate('ArticleEntry', {
      selectKijiCategory: this.state.selectKijiCategory,
      selectKiji: selectKiji
    })
  }

  /**
   * 記事照会画面のイベント
   */

  /** 新規投稿ボタン押下 */
  onClickNewArticleBtn = async () => {
    // 記事投稿画面へ遷移
    this.moveEntry(null)
  }

  /** 記事編集ボタン押下 */
  onClickEditArticleBtn = async (index) => {
    // 記事投稿画面へ遷移（修正対象の記事情報を設定）
    this.moveEntry(index)
  }

  /** 記事検索ボタン押下 */
  onClickSearchArticleBtn = async () => {
    // 記事検索ダイアログを表示
		this.setState({searchDialogVisible: true})
  }

  /** いいねボタン押下 */
  onClickGoodBtn = async (index) => {
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

  /** お気に入りボタン押下 */
  onClickFavoriteBtn = async (index) => {
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

  /** スクロール最下部到達（次の記事の読み込み） */
  reachScrollBottom = async () => {
    // 記事API.記事検索処理の呼び出し（次の記事の読み込み）
  }

  /**
   * 検索ダイアログ画面のイベント
   */

  /** 検索条件設定ボタン押下 */
  onClickDlgSearchBtn = async () => {
    // 記事API.記事検索処理の呼び出し（条件付与）

		this.setState({
			searchDialogVisible: false
		})
  }

  /** 検索条件クリアボタン押下 */
  onClickDlgClearBtn = async () => {
		// 記事API.記事検索処理の呼び出し

		this.setState({
			searchDialogVisible: false,
			searchCondYear: "",
			searchCondKeyword: "",
			searchCondHashtag: ""
		})
  }

  render() {
    return (
      <View>
        {/* -- 共有ヘッダ -- */}
        <InAppHeader navigate={this.props.navigation.navigate} />

        {/* -- 画面タイトル -- */}
        <View style={[styles.screenTitleView, { flexDirection: 'row' }]}>
          <View style={{ flex: 1, alignItems: 'flex-start', marginLeft: 10 }}>
						{/* 検索アイコン */}
						<Icon name="search" type="font-awesome" color="white"
							onPress={() => this.onClickSearchArticleBtn()} />
          </View>
          <View style={{ alignItems: 'center' }}>
						{/* 記事カテゴリ名 */}
            <Text style={styles.screenTitleText}>
              {this.state.selectKijiCategory.category_nm}
						</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 10 }}>
						{/* 新規投稿アイコン */}
            <Icon name="edit" type="font-awesome" color="white"
              onPress={() => this.onClickNewArticleBtn()}
            />
          </View>
        </View>

        {/* -- 記事表示（繰り返し） -- */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.state.dispKijiList.map((item, i) => {
            return (
              <Card key={i}>
                {/* 投稿情報 */}
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1, alignItems: 'center', marginRight: 5 }}>
                    {/* 投稿日時 */}
                    <Text style={styles.dateTimeText}>
                      {moment(new Date(item.post_dt)).format('YYYY/MM/DD')}
                    </Text>
                    <Text style={styles.dateTimeText}>
                      {moment(new Date(item.post_dt + " " + item.post_tm)).format('H:mm')}
                    </Text>
                    <Avatar
                      rounded
                      source={{
                        uri: restdomain + `/uploads/${item.shain_image_path}`
                      }}
                      activeOpacity={0.7}
                    />
                  </View>
                  <View style={{ flex: 4 }}>
                    <View style={{ flexDirection: 'row' }}>
                      {/* 投稿者名 */}
                      <View style={{ flex: 4 }}>
                        <Text style={{ fontSize: 20, color: 'black' }}>
                          {item.shain_nm}
                        </Text>
                      </View>
                      <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        {/* 自身の投稿記事の場合、編集アイコンを表示する */}
                        {(() => {
                          if (item.t_shain_pk == this.state.login_shain_pk) {
                            return (
                              <Icon
                                name="pencil"
                                type="font-awesome"
                                onPress={() => this.onClickEditArticleBtn(i)}
                              />
                            )
                          }
                        })()}
                      </View>
                    </View>
                    {/* タイトル */}
                    <Text style={{ fontSize: 16, color: 'blue' }}>
                      【{item.title}】
                    </Text>
                    {/* ハッシュタグ */}
                    <Text style={{ fontSize: 12, color: 'blue' }}>
                      {item.hashtagStr}
                    </Text>
                  </View>
                </View>
                {/* 記事内容 */}
                <View style={{ marginTop: 10 }}>
                  <Text>
                    {item.contents}
                  </Text>
                </View>
                {/* 画像 */}
                <View style={{ marginTop: 10 }}>
                  {item.file_path != "" &&
                    <Image
                      source={{
                        uri: restdomain + `/uploads/article/${item.file_path}`
                      }} />
                    }
                </View>
                {/* TODO : いいね */}
                {/* TODO : お気に入り */}
              </Card>
            )
          })}
          {/* スクロールが最下部まで表示されないことの暫定対応... */}
          <View style={{ marginBottom: 100 }} />
        </ScrollView>

        {/* -- 検索ダイアログ -- */}
        <Modal
          visible={this.state.searchDialogVisible}
					animationType={'slide'}
					onRequestClose={() => {this.setState({searchDialogVisible: false})}}
        >
					<View style={{ flex: 1 }}>
						{/* ヘッダ部 */}
						<View style={{ flex: 1 }} />
						<View style={{ flexDirection: 'row' }}>
							<View style={{ flex: 1, alignItems: 'flex-start' }} />
								{/* 検索アイコン */}
								<Icon name="search" type="font-awesome" color="black"
									onPress={() => this.onClickDlgSearchBtn()} />
							<View style={{ flex: 1, alignItems: 'flex-start' }}>
								{/* 検索クリアアイコン */}
								<Icon name="search-minus" type="font-awesome" color="black"
									onPress={() => this.onClickDlgClearBtn()} />
							</View>
							<View style={{ flex: 1, alignItems: 'flex-end', marginRight: 10 }}>
								{/* 閉じるアイコン */}
								<Icon name="times-circle" type="font-awesome" color="black"
									onPress={() => {this.setState({searchDialogVisible: false})}}
								/>
							</View>
						</View>
						{/* 検索条件部 */}
						<View style={{ flex: 1 }}>
							<Card>
								<View>
									{/* 投稿年 */}
									<Text style={styles.inputTitle}>投稿年</Text>
									<TextInput
										style={styles.inputText}
										value={this.state.searchCondYear}
										keyboardType='numeric'
										maxLength={4}
										onChangeText={text => {this.setState({searchCondYear: text})}}
									/>
								</View>
								<View>
									{/* 検索キーワード */}
									<Text style={styles.inputTitle}>検索キーワード</Text>
									<TextInput
										style={styles.inputText}
										value={this.state.searchCondKeyword}
										onChangeText={text => {this.setState({searchCondKeyword: text})}}
									/>
								</View>
								<View>
									{/* タグ */}
									<Text style={styles.inputTitle}>タグ</Text>
									<TextInput
										style={styles.inputText}
										value={this.state.searchCondHashtag}
										onChangeText={text => {this.setState({searchCondHashtag: text})}}
									/>
									<Text style={styles.inputTitle}>※スペース区切りで複数条件可</Text>
								</View>
							</Card>
						</View>
						<View style={{ flex: 1 }} />
					</View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  screenTitleView: {
    alignItems: 'center',
    backgroundColor: '#ff5622'
  },
  screenTitleText: {
    fontSize: 18,
    color: 'white',
    padding: 10
  },
  dateTimeText: {
    fontSize: 10,
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
