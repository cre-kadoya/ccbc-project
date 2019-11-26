const request = require('superagent')
const express = require('express')
const router = express.Router()
const async = require('async')
var db = require('./common/sequelize_helper.js').sequelize
var db2 = require('./common/sequelize_helper.js')
const bcdomain = require('./common/constans.js').bcdomain
const jimuAccount = require('./common/constans.js').jimuAccount
const jimuPassword = require('./common/constans.js').jimuPassword

var multer = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/article')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

const READ_COUNT = 10
const GET_COIN = 10

/**
 * API : findCategory
 * 記事カテゴリ一覧（カテゴリ別、未読件数付き）を取得
 */
router.post('/findCategory', (req, res) => {
  console.log('API : findCategory - start')
  findCategoryList(req, res)
  // const resdatas = [
  //   { t_kiji_category_pk: 1, category_nm: "ライフハック", midoku_cnt: 0 },
  //   { t_kiji_category_pk: 2, category_nm: "おすすめの本", midoku_cnt: 1 },
  //   { t_kiji_category_pk: 3, category_nm: "イベント情報", midoku_cnt: 10 },
  //   { t_kiji_category_pk: 4, category_nm: "美味しいお店", midoku_cnt: 0 },
  //   { t_kiji_category_pk: 5, category_nm: "その他", midoku_cnt: 0 },
  // ]
  // res.json({
  //   status: true,
  //   data: resdatas
  // })
  console.log('API : findCategory - end')
})

/**
 * API : findArticle
 * 記事リスト（条件により絞り込み可能）を取得
 */
router.post('/findArticle', (req, res) => {
  console.log('API : findArticle - start')
  findArticleList(req, res)

  // let idx = 100
  // if (req.body.readLastKijiPk !== null) {
  //   idx = req.body.readLastKijiPk - 5
  // }
  // const resdatas = [
  //   {
  //     t_kiji_pk: idx + 4, t_shain_pk: 1, title: (idx + 4) + "マラソン大会へのお誘い",
  //     t_kiji_category_pk: 1,
  //     contents: "今年もこの時期がやってまいりました！\n北海道の大自然の中を颯爽と走る事ができるマラソン大会です。\n自然あふれる風景を満喫しながら走りませんか？\nフルマラソンだけでなく、20kmや10kmもありますので、初心者の方も是非どうぞ。\n\n申し込み用のホームページです\nhttps://xxxxxxxxxx.jp/123456789-entry",
  //     post_dt: "2019/07/15", post_tm: "10:57", file_path: "test001.png",
  //     shain_nm: "佐藤　陸", shain_image_path: "",
  //     hashtagStr: "#スポーツ　#マラソン　",
  //     hashtag: [
  //       { seq_no: 1, hashtag: "スポーツ" },
  //       { seq_no: 2, hashtag: "マラソン" }],
  //     good_flg: "1", favorite_flg: "0", category_nm: "イベント情報"
  //   },
  //   {
  //     t_kiji_pk: idx + 3, t_shain_pk: 2, title: (idx + 3) + "ビアガーデン開催",
  //     t_kiji_category_pk: 1,
  //     contents: "どこよりも早く、会社の最寄り駅にてビアガーデンが開催されるようです。\n今年から始まるとの事で、イベントも盛り沢山みたいですね。\n\nURLを貼っておきますので、是非見てください。\nhttps://xxxxxxxxxx-xxxxx.jp\nちなみに私は来週の金曜日にチームメンバーと繰り出そうと思っています！",
  //     post_dt: "2019/07/02", post_tm: "19:09", file_path: "",
  //     shain_nm: "佐々木　澪", shain_image_path: "",
  //     hashtagStr: "#飲み会　#お店　",
  //     hashtag: [
  //       { seq_no: 3, hashtag: "飲み会" },
  //       { seq_no: 4, hashtag: "お店" }],
  //     good_flg: "0", favorite_flg: "1", category_nm: "イベント情報"
  //   },
  //   {
  //     t_kiji_pk: idx + 2, t_shain_pk: 3, title: (idx + 2) + "ビアガーデン開催2。会社の最寄り駅にてビアガーデンが開催されるようです。",
  //     t_kiji_category_pk: 1,
  //     contents: "どこよりも早く、会社の最寄り駅にてビアガーデンが開催されるようです。2",
  //     post_dt: "2019/07/02", post_tm: "9:35", file_path: "",
  //     shain_nm: "佐々木　澪", shain_image_path: "",
  //     hashtagStr: "#飲み会　#お店　#お店　#お店　",
  //     hashtag: [
  //       { seq_no: 3, hashtag: "飲み会" },
  //       { seq_no: 4, hashtag: "お店" }],
  //     good_flg: "0", favorite_flg: "1", category_nm: "イベント情報"
  //   },
  //   {
  //     t_kiji_pk: idx + 1, t_shain_pk: 4, title: (idx + 1) + "ビアガーデン開催3",
  //     t_kiji_category_pk: 1,
  //     contents: "どこよりも早く、会社の最寄り駅にてビアガーデンが開催されるようです。3",
  //     post_dt: "2019/07/02", post_tm: "7:05", file_path: "",
  //     shain_nm: "佐々木　澪", shain_image_path: "",
  //     hashtagStr: "#飲み会　#お店　",
  //     hashtag: [
  //       { seq_no: 3, hashtag: "飲み会" },
  //       { seq_no: 4, hashtag: "お店" }],
  //     good_flg: "1", favorite_flg: "1", category_nm: "イベント情報"
  //   },
  // ]
  // console.log(req.body)
  // if (req.body.searchCondKijiPk != null) {
  //   resdatas.splice(3, 1)
  //   resdatas.splice(2, 1)
  //   resdatas.splice(1, 1)
  // }
  // res.json({
  //   status: true,
  //   data: resdatas
  // })

  console.log('API : findArticle - end')
})

/**
 * API : edit
 * 記事情報を登録（新規登録も編集も）
 */
router.post('/edit', upload.fields([{ name: 'imageData' }]), (req, res) => {
  console.log('API : edit - start')
  console.log("jimuAccount:", jimuAccount)
  console.log("jimuPassword:", jimuPassword)
  
  edit(req, res)
  console.log('API : edit - req.body : ' + JSON.stringify(req.body))
  console.log('API : edit - req.body.editArticle.file_path : ' + req.body.editArticle.file_path)
  res.json({ status: true })
  console.log('API : edit - end')
})

/**
 * API : good
 * 記事情報をいいね登録（登録も解除も）
 */
router.post('/good', (req, res) => {
  console.log('API : good - start')
  // good(req, res)
  console.log('API : good - end')
})

/**
 * API : favorite
 * 記事情報をお気に入り登録（登録も解除も）
 */
router.post('/favorite', (req, res) => {
  console.log('API : favorite - start')
  // favorite(req, res)
  console.log('API : favorite - end')
})

// ----------------------------------------------------------------------
/**
 * 記事カテゴリ一覧（カテゴリ別、未読件数付き）を取得
 * @param req リクエスト
 * @param res レスポンス
 */
async function findCategoryList(req, res) {
  db = db2.sequelizeDB(req)

  // 記事カテゴリの取得
  const resdatas = await selectKijiCategory(db, req)
  res.json({
    status: true,
    data: resdatas
  })
}

/**
 * 記事リスト（条件により絞り込み可能）を取得
 * @param req リクエスト
 * @param res レスポンス
 */
async function findArticleList(req, res) {
  db = db2.sequelizeDB(req)

  // 記事リストの取得
  const resdatas = await selectKijiWithCond(db, req)
  res.json({
    status: true,
    data: resdatas
  })
  
  // 記事既読の更新
  if (resdatas.length > 0) {
    const kijiPk = resdatas[resdatas.length - 1].t_kiji_pk
    db.transaction(async function (tx) {
      // DB更新
      await insertOrUpdateKijiKidoku(db, tx, req, kijiPk)
    })
      .then(result => {
        // コミットしたらこっち
        console.log('正常')
      })
      .catch(e => {
        // ロールバックしたらこっち
        console.log('異常')
        console.log(e)
        res.json({ status: false })
      })
  }
}

/**
 * 記事情報を登録（新規登録も編集も）
 * @param req リクエスト
 * @param res レスポンス
 */
async function edit(req, res) {
  db = db2.sequelizeDB(req)

  db.transaction(async function (tx) {
    // 記事テーブルの更新
    let isInsert = true
    if (req.body.editArticle.t_kiji_pk != null && req.body.editArticle.t_kiji_pk != "") {
      isInsert = false
    }
    await insertOrUpdateKiji(db, tx, req, isInsert)

    // 記事ハッシュタグテーブルの更新（delete and insert）
    await deleteKijiHashtag(db, tx, req)
    var hashtag = req.body.editArticle.hashtagStr.split("　")
    for (var i in hashtag) {
      var kijiHashtag = {
        t_kiji_pk: req.body.editArticle.t_kiji_pk,
        seq_no: i,
        t_kiji_category_pk: req.body.editArticle.t_kiji_category_pk,
        hashtag: hashtag[i]
      }
      await insertKijiHashtag(db, tx, req, kijiHashtag)
    }

    // BCへの書き込み
    // const transactionId = await bcrequest(req)

    // 贈与テーブルの追加
    if (isInsert) {
      await insertZoyo(db, tx, req, transactionId)
    }
  })
    .then(result => {
      // コミットしたらこっち
      console.log('正常')
      res.json({ status: true })
    })
    .catch(e => {
      // ロールバックしたらこっち
      console.log('異常')
      console.log(e)
      res.json({ status: false })
    })
}

/**
 * 記事情報をいいね登録（登録も解除も）
 * @param req リクエスト
 * @param res レスポンス
 */
async function good(req, res) {
  db = db2.sequelizeDB(req)

  db.transaction(async function (tx) {
    await insertOrUpdateGood(db, tx, req)
  })
    .then(result => {
      // コミットしたらこっち
      console.log('正常')
      res.json({ status: true })
    })
    .catch(e => {
      // ロールバックしたらこっち
      console.log('異常')
      console.log(e)
      res.json({ status: false })
    })
}

/**
 * 記事情報をお気に入り登録（登録も解除も）
 * @param req リクエスト
 * @param res レスポンス
 */
async function favorite(req, res) {
  db = db2.sequelizeDB(req)

  db.transaction(async function (tx) {
    await insertOrUpdateFavorite(db, tx, req)
  })
    .then(result => {
      // コミットしたらこっち
      console.log('正常')
      res.json({ status: true })
    })
    .catch(e => {
      // ロールバックしたらこっち
      console.log('異常')
      console.log(e)
      res.json({ status: false })
    })
}

// ----------------------------------------------------------------------
/**
 * 記事カテゴリ一覧（カテゴリ別、未読件数付き）を取得（DBアクセス）
 * @param db SequelizeされたDBインスタンス
 * @param req リクエスト
 */
function selectKijiCategory(db, req) {
  return new Promise((resolve, reject) => {
    // 記事カテゴリテーブルの情報と、記事の未読件数（記事既読テーブルに登録されているIDより新しいIDの件数）を一緒に取得
    var sql =
      "select cat.t_kiji_category_pk, cat.category_nm, coalesce(sub.midoku_cnt, 0) as midoku_cnt" +
      " from t_kiji_category cat" +
      " left join" +
      "  (select count(*) as midoku_cnt, kij.t_kiji_category_pk" +
      "   from t_kiji kij left join t_kiji_kidoku kid on kij.t_kiji_category_pk = kid.t_kiji_category_pk" +
      "   where kid.t_shain_pk = :shain_pk" +
      "   and kij.delete_flg = '0'" +
      "   and kij.t_kiji_pk > kid.t_kiji_pk" +
      "   group by kij.t_kiji_category_pk) sub" +
      "  on cat.t_kiji_category_pk = sub.t_kiji_category_pk" +
      " where cat.delete_flg = '0'" +
      " order by cat.t_kiji_category_pk"
    db.query(sql, {
      replacements: { shain_pk: req.body.loginShainPk },
      type: db.QueryTypes.RAW
    })
      .spread((datas, metadata) => {
        console.log('DBAccess : selectKijiCategory result...')
        console.log(datas)
        return resolve(datas)
      })
  })
}

/**
 * 記事リスト（条件により絞り込み可能）を取得（DBアクセス）
 * @param db SequelizeされたDBインスタンス
 * @param req リクエスト
 */
function selectKijiWithCond(db, req) {
  return new Promise((resolve, reject) => {
    // 条件
    var sqlcond_kiji_category_pk = ""
    var sqlcond_kiji_pk = ""
    var sqlcond_dt_from = ""
    var sqlcond_dt_to = ""
    var sqlcond_hashtag = ""
    var sqlcond_keyword = ""
    if (req.body.current_kiji_category_pk != null) {
      sqlcond_kiji_category_pk = " and kij.t_kiji_category_pk = :t_kiji_category_pk"
    }
    if (req.body.searchCondKijiPk != null) {
      sqlcond_kiji_pk = " and kij.t_kiji_pk = :t_kiji_pk"
    } else if (req.body.readLastKijiPk != null) {
      sqlcond_kiji_pk = " and kij.t_kiji_pk < :t_kiji_pk_read_last"
    }
    if (req.body.searchCondYear != null && req.body.searchCondYear != '') {
      sqlcond_dt_from = " and kij.post_dt >= :dt_from"
      sqlcond_dt_to = " and kij.post_dt <= :dt_to"
    }
    if (req.body.searchCondHashtag != null && req.body.searchCondHashtag != '') {
      sqlcond_hashtag = " and exists (select * from t_kiji_hashtag has where kij.t_kiji_pk = has.t_kiji_pk and has.hashtag like :hashtag)"
    }
    if (req.body.searchCondKeyword != null && req.body.searchCondKeyword != '') {
      sqlcond_keyword = " and (kij.title like :keyword or kij.contents like : keyword)"
    }

    // 記事情報テーブルより条件を絞り込んで取得
    var sql =
      "select kij.t_kiji_pk, kij.t_kiji_category_pk, kij.t_shain_pk, kij.title, kij.contents, kij.post_dt, kij.post_tm, kij.file_path," +
      " sha.shimei as shain_nm, sha.image_file_nm as shain_image_path," +
      " coalesce(goo.t_kiji_pk, '1', '0') as good_flg, coalesce(fav.t_kiji_pk, '1', '0') as favorite_flg," +
      " array_to_string(array(select '#' || hashtag from t_kiji_hashtag has where kij.t_kiji_pk = has.t_kiji_pk order by has.seq_no), '　') as hashtagStr," +
      " cat.category_nm" +
      " from t_kiji kij" +
      " inner join t_kiji_category cat on kij.t_kiji_category_pk = cat.t_kiji_category_pk" +
      " left join t_shain sha on kij.t_shain_pk = sha.t_shain_pk" +
      " left join t_good goo on kij.t_kiji_pk = goo.t_kiji_pk and goo.t_shain_pk = :t_shain_pk" +
      " left join t_favorite fav on kij.t_kiji_pk = fav.t_kiji_pk and fav.t_shain_pk = :t_shain_pk" +
      " where kij.delete_flg = '0'" +
      sqlcond_kiji_category_pk +
      sqlcond_kiji_pk +
      sqlcond_dt_from +
      sqlcond_dt_to +
      sqlcond_hashtag +
      sqlcond_keyword +
      " order by kij.t_kiji_pk desc" +
      " limit " + READ_COUNT

    db.query(sql, {
      replacements: {
        t_kiji_category_pk: req.body.current_kiji_category_pk,
        t_shain_pk: req.body.loginShainPk,
        t_kiji_pk: req.body.t_kiji_pk,
        t_kiji_pk_read_last: req.body.readLastKijiPk,
        dt_from: req.body.searchCondYear + "/01/01",
        dt_to: req.body.searchCondYear + "/12/31",
        hashtag: "%" + req.body.searchCondHashtag + "%",
        keyword: "%" + req.body.searchCondKeyword + "%"
      },
      type: db.QueryTypes.RAW
    })
      .spread((datas, metadata) => {
        console.log('DBAccess : selectKijiWithCond result...')
        console.log(datas)
        return resolve(datas)
      })
  })
}

/**
 * 記事情報（t_kiji）テーブルのinsert or update
 * @param db SequelizeされたDBインスタンス
 * @param tx トランザクション
 * @param req リクエスト
 * @param isInsert 追加の場合はtrue
 */
function insertOrUpdateKiji(db, tx, req, isInsert) {
  return new Promise((resolve, reject) => {
    var sql = ""
    if (isInsert) {
      sql =
        "insert into t_kiji (t_kiji_category_pk, t_shain_pk, title, contents, hashtag, post_dt, post_tm, t_coin_ido_pk, file_path, delete_flg, insert_user_id, insert_tm, update_user_id, update_tm) " +
        " values (:t_kiji_category_pk, :t_shain_pk, :title, :contents, :hashtag, current_timestamp, current_timestamp, :t_coin_ido_pk, :file_path, '0', :user_id, current_timestamp, :user_id, current_timestamp) "
    } else {
      sql =
        "update t_kiji set " +
        " title = :title, contents = :contents, hashtag = :hashtag, file_path = :file_path," +
        " update_user_id = :user_id, update_tm = current_timestamp" +
        " where t_kiji_pk = :t_kiji_pk"
    }

    db.query(sql, {
      transaction: tx,
      replacements: {
        t_kiji_pk: req.body.editArticle.t_kiji_pk,
        t_kiji_category_pk: req.body.editArticle.t_kiji_category_pk,
        t_shain_pk: req.body.loginShainPk,
        title: req.body.editArticle.title,
        contents: req.body.editArticle.contents,
        hashtag: req.body.editArticle.hashtag,
        t_coin_ido_pk: null,
        file_path: req.body.editArticle.file_path,
        user_id: req.body.loginShainPk
      }
    })
      .spread((datas, metadata) => {
        return resolve(datas)
      })
  })
}

/**
 * 贈与情報（t_zoyo）テーブルのinsert
 * @param db SequelizeされたDBインスタンス
 * @param tx トランザクション
 * @param req リクエスト
 * @param transactionId BC登録時のトランザクションID
 */
function insertZoyo(db, tx, req, transactionId) {
  return new Promise((resolve, reject) => {

    var sql =
      "iinsert into t_zoyo (zoyo_moto_shain_pk, zoyo_saki_shain_pk, transaction_id, zoyo_comment, nenji_flg, delete_flg, insert_user_id, insert_tm) " +
      " values (:zoyo_moto_shain_pk, :zoyo_saki_shain_pk, :transaction_id, :zoyo_comment, :nenji_flg, '0', :insert_user_id, current_timestamp) "

    db.query(sql, {
      transaction: tx,
      replacements: {
        zoyo_moto_shain_pk: req.body.loginShainPk,
        zoyo_saki_shain_pk: jimuAccount,
        transaction_id: transactionId,
        zoyo_comment: "記事投稿",
        nenji_flg: "1",
        insert_user_id: req.body.loginShainPk
      }
    })
      .spread((datas, metadata) => {
        return resolve(datas)
      })
  })
}

/**
 * 記事ハッシュタグ（t_kiji_hashtag）テーブルのdelete
 * @param db SequelizeされたDBインスタンス
 * @param tx トランザクション
 * @param req リクエスト
 */
function deleteKijiHashtag(db, tx, req) {
  return new Promise((resolve, reject) => {
    var sql =
      "delete from t_kiji_hashtag where t_kiji_pk = :t_kiji_pk"

    db.query(sql, {
      transaction: tx,
      replacements: {
        t_kiji_pk: req.body.editArticle.t_kiji_pk
      }
    })
      .spread((datas, metadata) => {
        return resolve(datas)
      })
  })
}
/**
 * 記事ハッシュタグ（t_kiji_hashtag）テーブルのinsert
 * @param db SequelizeされたDBインスタンス
 * @param tx トランザクション
 * @param req リクエスト
 * @param tKijiHashtag 記事ハッシュタグテーブル情報
 */
function insertKijiHashtag(db, tx, req, tKijiHashtag) {
  return new Promise((resolve, reject) => {
    var sql =
      "insert into t_kiji_hashtag (t_kiji_pk, seq_no, t_kiji_category_pk, hashtag, insert_user_id, insert_tm, update_user_id, update_tm) " +
      " values (:t_kiji_pk, :seq_no, :t_kiji_category_pk, :hashtag, :user_id, current_timestamp, :user_id, current_timestamp) "

    db.query(sql, {
      transaction: tx,
      replacements: {
        t_kiji_pk: tKijiHashtag.t_kiji_pk,
        seq_no: tKijiHashtag.seq_no,
        t_kiji_category_pk: tKijiHashtag.t_kiji_category_pk,
        hashtag: tKijiHashtag.hashtag,
        user_id: req.body.loginShainPk
      }
    })
      .spread((datas, metadata) => {
        return resolve(datas)
      })
  })
}

/**
 * いいね（t_good）テーブルのinsert or update
 * @param db SequelizeされたDBインスタンス
 * @param tx トランザクション
 * @param req リクエスト
 */
function insertOrUpdateGood(db, tx, req) {
  return new Promise((resolve, reject) => {
    var sql = ""
    if (req.body.editArticle.good_flg = "1") {
      sql =
        "insert into t_good (t_kiji_pk, t_shain_pk, insert_user_id, insert_tm, update_user_id, update_tm) " +
        " values (:t_kiji_pk, :t_shain_pk, :user_id, current_timestamp, :user_id, current_timestamp) " +
        " on conflict do nothing"
    } else {
      sql =
        "delete from t_good " +
        " where t_kiji_pk = :t_kiji_pk and t_shain_pk = :t_shain_pk"
    }
    db.query(sql, {
      transaction: tx,
      replacements: {
        t_kiji_pk: req.body.editArticle.t_kiji_pk,
        t_shain_pk: req.body.loginShainPk,
        user_id: req.body.loginShainPk
      }
    })
      .spread((datas, metadata) => {
        return resolve(datas)
      })
  })
}

/**
 * お気に入り（t_favorite）テーブルのinsert or update
 * @param db SequelizeされたDBインスタンス
 * @param tx トランザクション
 * @param req リクエスト
 */
function insertOrUpdateFavorite(db, tx, req) {
  return new Promise((resolve, reject) => {
    var sql = ""
    if (req.body.editArticle.favorite_flg = "1") {
      sql =
        "insert into t_favorite (t_kiji_pk, t_shain_pk, insert_user_id, insert_tm, update_user_id, update_tm) " +
        " values (:t_kiji_pk, :t_shain_pk, :user_id, current_timestamp, :user_id, current_timestamp) " +
        " on conflict do nothing"
    } else {
      sql =
        "delete from t_favorite " +
        " where t_kiji_pk = :t_kiji_pk and t_shain_pk = :t_shain_pk"
    }
    db.query(sql, {
      transaction: tx,
      replacements: {
        t_kiji_pk: req.body.editArticle.t_kiji_pk,
        t_shain_pk: req.body.loginShainPk,
        user_id: req.body.loginShainPk
      }
    })
      .spread((datas, metadata) => {
        return resolve(datas)
      })
  })
}

/**
 * 記事既読（t_kiji_kidoku）テーブルのinsert or update
 * @param db SequelizeされたDBインスタンス
 * @param tx トランザクション
 * @param req リクエスト
 * @param kijiPk 記事テーブルPK
 */
function insertOrUpdateKijiKidoku(db, tx, req, kijiPk) {
  return new Promise((resolve, reject) => {
    var sql =
      "insert into t_kiji_kidoku (t_shain_pk, t_kiji_category_pk, t_kiji_pk, insert_user_id, insert_tm, update_user_id, update_tm) " +
      " values (:t_shain_pk, :t_kiji_category_pk, :t_kiji_pk, :user_id, current_timestamp, :user_id, current_timestamp) " +
      " on conflict (t_shain_pk, t_kiji_category_pk) do " +
      "update set t_kiji_pk = :t_kiji_pk, update_user_id = :user_id, update_tm = current_timestamp" +
      " where t_kiji_kidoku.t_kiji_pk < :t_kiji_pk"

    db.query(sql, {
      transaction: tx,
      replacements: {
        t_shain_pk: req.body.loginShainPk,
        t_kiji_category_pk: req.body.current_kiji_category_pk,
        t_kiji_pk: kijiPk,
        user_id: req.body.loginShainPk
      }
    })
      .spread((datas, metadata) => {
        return resolve(datas)
      })
  })
}

/**
 * BCコイン送金用関数
 * @param req リクエスト
 */
function bcrequest(req) {
  return new Promise((resolve, reject) => {
    var param = {
      from_account: [jimuAccount],
      to_account: [req.body.loginShainPk],
      password: [jimuPassword],
      coin: [GET_COIN],
      bc_addr: req.body.bc_addr
    }
    console.log('★★★')
    request
      .post(bcdomain + '/bc-api/send_coin')
      .send(param)
      .end((err, res) => {
        console.log('★★★')
        if (err) {
          console.log('★' + err)
          return
        }
        // 検索結果表示
        console.log('★★★' + res.body.transaction)
        return resolve(res.body.transaction[0])
      })
  })
}

module.exports = router
