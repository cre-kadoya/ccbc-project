const request = require('superagent')
const express = require('express')
const router = express.Router()
const async = require('async')
var db = require('./common/sequelize_helper.js').sequelize
var db2 = require('./common/sequelize_helper.js')
const bcdomain = require('./common/constans.js').bcdomain

var multer = require('multer')
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/article')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

/**
 * API : findCategoryList
 * 記事カテゴリ一覧（カテゴリ別、未読件数付き）を取得
 */
router.post('/findCategoryList', (req, res) => {
  console.log('API : findCategoryList - start')
  findCategoryList(req, res)
  console.log('API : findCategoryList - end')
})

/**
 * API : findKijiList
 * 記事リスト（条件により絞り込み可能）を取得
 */
router.post('/findKijiList', (req, res) => {
  console.log('API : findKijiList - start')
  findKijiList(req, res)
  console.log('API : findKijiList - end')
})

/**
 * API : edit
 * 記事情報を登録（新規登録も編集も）
 */
router.post('/edit', upload.fields([{ name: 'imageData' }]), (req, res) => {
  console.log('API : edit - start')
  // edit(req, res)
  console.log('API : edit - req.body : ' + JSON.stringify(req.body))
  console.log('API : edit - req.body.editKiji.file_path : ' + req.body.editKiji.file_path)
  res.json({ status: true })
  console.log('API : edit - end')
})

/**
 * API : good
 * 記事情報をいいね登録（登録も解除も）
 */
router.post('/good', (req, res) => {
  console.log('API : good - start')
  good(req, res)
  console.log('API : good - end')
})

/**
 * API : favorite
 * 記事情報をお気に入り登録（登録も解除も）
 */
router.post('/favorite', (req, res) => {
  console.log('API : favorite - start')
  favorite(req, res)
  console.log('API : favorite - end')
})

// ----------------------------------------------------------------------
/**
 * 記事カテゴリ一覧（カテゴリ別、未読件数付き）を取得
 * @req {*} req
 * @res {*} res
 */
async function findCategoryList(req, res) {
  var resdatas = await getKijiCategoryList(req)
  res.json({
    status: true,
    data: resdatas
  })
}

/**
 * 記事リスト（条件により絞り込み可能）を取得
 * @req {*} req
 * @res {*} res
 */
async function findKijiList(req, res) {
  var resdatas = await getKijiList(req)
  res.json({
    status: true,
    data: resdatas
  })
  // 記事既読の更新
  if (resdatas.length > 0) {
    var kijiPk = resdatas[resdatas.length - 1].t_kiji_pk
    if (req.body.db_name != null && req.body.db_name != '') {
      db = db2.sequelize3(req.body.db_name)
    } else {
      db = require('./common/sequelize_helper.js').sequelize
    }
    db
      .transaction(async function(tx) {
        var resdatas = []
        // DB更新
        await insertOrUpdateKijiKidoku(tx, resdatas, req, kijiPk)
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
}

/**
 * 記事情報を登録（新規登録も編集も）
 * @req {*} req
 * @res {*} res
 */
async function edit(req, res) {
  if (req.body.db_name != null && req.body.db_name != '') {
    db = db2.sequelize3(req.body.db_name)
  } else {
    db = require('./common/sequelize_helper.js').sequelize
  }
  db
    .transaction(async function(tx) {
      var resdatas = []
      // 記事情報テーブル
      await insertOrUpdateKiji(tx, resdatas, req)

      // 記事ハッシュタグテーブル（delete and insert）
      await deleteKijiHashtag(tx, resdatas, req)
      var hashtag = req.body.editKiji.hashtagStr.split("　")
      for (var i in hashtag) {
        var kijiHashtag = {
          t_kiji_pk: req.body.editKiji.t_kiji_pk, 
          seq_no: i,
          t_kiji_category_pk: req.body.editKiji.t_kiji_category_pk,
          hashtag: hashtag[i]
        }
        await insertKijiHashtag(tx, resdatas, req, kijiHashtag)
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
 * @req {*} req
 * @res {*} res
 */
async function good(req, res) {
  if (req.body.db_name != null && req.body.db_name != '') {
    db = db2.sequelize3(req.body.db_name)
  } else {
    db = require('./common/sequelize_helper.js').sequelize
  }
  db
    .transaction(async function(tx) {
      var resdatas = []
      // DB更新
      await insertOrUpdateGood(tx, resdatas, req)
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
 * @req {*} req
 * @res {*} res
 */
async function favorite(req, res) {
  if (req.body.db_name != null && req.body.db_name != '') {
    db = db2.sequelize3(req.body.db_name)
  } else {
    db = require('./common/sequelize_helper.js').sequelize
  }
  db
    .transaction(async function(tx) {
      var resdatas = []
      // DB更新
      await insertOrUpdateFavorite(tx, resdatas, req)
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
 * @req {*} req
 */
function getKijiCategoryList(req) {
  return new Promise((resolve, reject) => {
    if (req.body.db_name != null && req.body.db_name != '') {
      db = db2.sequelize3(req.body.db_name)
    } else {
      db = require('./common/sequelize_helper.js').sequelize
    }
    // 記事カテゴリテーブルの情報と、記事の未読件数（記事既読テーブルに登録されているIDより新しいIDの件数）を一緒に取得
    var sql =
      "select cat.t_kiji_category_pk, cat.category_nm, coalesce(sub.midoku_cnt, 0) as midoku_cnt" +
      " from t_kiji_category cat" +
      " left join" +
      "  (select count(*) as midoku_cnt, kij.t_kiji_category_pk" +
      "   from t_kiji kij left join t_kiji_kidoku kid on kij.t_kiji_category_pk and kid.t_kiji_category_pk" +
      "   where kid.t_shain_pk = :shain_pk" +
      "   and kij.delete_flg = '0'" +
      "   and kij.t_kiji_pk > kid.t_kiji_pk" +
      "   group by kij.t_kiji_category_pk) sub" +
      "  on cat.t_kiji_category_pk = sub.t_kiji_category_pk" +
      " where cat.delete_flg = '0'" + 
      " order by cat.t_kiji_category_pk"
    db
      .query(sql, {
        replacements: { shain_pk: req.body.login_shain_pk },
        type: db.QueryTypes.RAW
      })
      .spread((datas, metadata) => {
        console.log('DBAccess : getKijiCategoryList result...')
        console.log(datas)
        return resolve(datas)
      })
  })
}

/**
 * 記事リスト（条件により絞り込み可能）を取得（DBアクセス）
 * @req {*} req
 */
function getKijiList(req) {
  return new Promise((resolve, reject) => {
    if (req.body.db_name != null && req.body.db_name != '') {
      db = db2.sequelize3(req.body.db_name)
    } else {
      db = require('./common/sequelize_helper.js').sequelize
    }
    // 条件
    var sqlcond_dt_from = ""
    var sqlcond_dt_to = ""
    var sqlcond_hashtag = ""
    var sqlcond_keyword = ""
    if (req.body.conditions.dt_from != null && req.body.conditions.dt_from != '') {
      sqlcond_dt_from = " and kij.post_dt >= :dt_from" 
    }
    if (req.body.conditions.dt_to != null && req.body.conditions.dt_to != '') {
      sqlcond_dt_to = " and kij.post_dt <= :dt_to" 
    }
    if (req.body.conditions.hashtag != null && req.body.conditions.hashtag != '') {
      sqlcond_hashtag = " and exists (select * from t_kiji_hashtag has where kij.t_kiji_pk = has.t_kiji_pk and has.hashtag like :hashtag)" 
    }
    if (req.body.conditions.keyword != null && req.body.conditions.keyword != '') {
      sqlcond_keyword = " and (kij.title like :keyword or kij.contents like : keyword)" 
    }

    // 記事情報テーブルより条件を絞り込んで取得
    var sql =
      "select kij.t_kiji_pk, kij.t_kiji_category_pk, kij.t_shain_pk, kij.title, kij.contents, kij.post_dt, kij.post_tm, kij.file_path," +
      " sha.shimei as shain_nm, sha.image_file_nm as shain_image_path," +
      " coalesce(goo.t_kiji_pk, '0', '1') as good_flg, coalesce(fav.t_kiji_pk, '0', '1') as favorite_flg," +
      " array_to_string(array(select '#' || hashtag from t_kiji_hashtag has where kij.t_kiji_pk = has.t_kiji_pk order by has.seq_no), '　')) as hashtagStr "
      " from t_kiji kij" +
      " left join t_shain sha on kij.t_shain_pk = sha.t_shain_pk" +
      " left join t_good goo on kij.t_kiji_pk = goo.t_kiji_pk and goo.t_shain_pk = :t_shain_pk" + 
      " left join t_favorite fav on kij.t_kiji_pk = fav.t_kiji_pk and fav.t_shain_pk = :t_shain_pk" + 
      " where kij.delete_flg = '0'" + 
      " and kij.t_kiji_category_pk = :t_kiji_category_pk" +
      sqlcond_dt_from + sqlcond_dt_to + sqlcond_hashtag + sqlcond_keyword + 
      " order by kij.post_dt, kij.post_tm, kij.t_kiji_pk"

    db
      .query(sql, {
        replacements: { 
          t_kiji_category_pk: req.body.current_kiji_category_pk,
          t_shain_pk: req.body.login_shain_pk,
          dt_from: req.body.conditions.dt_from,
          dt_to: req.body.conditions.dt_to,
          hashtag: "%" + req.body.conditions.hashtag + "%",
          keyword: "%" + req.body.conditions.keyword + "%"
        },
        type: db.QueryTypes.RAW
      })
      .spread((datas, metadata) => {
        console.log('DBAccess : getKijiList result...')
        console.log(datas)
        return resolve(datas)
      })
  })
}

/**
 * 記事情報（t_kiji）テーブルのinsert or update
 * @param {*} tx
 * @param {*} resdatas
 * @param {*} req
 */
function insertOrUpdateKiji(tx, resdatas, req) {
  return new Promise((resolve, reject) => {
    var sql = ""
    if (req.body.editKiji.t_kiji_pk != null && req.body.editKiji.t_kiji_pk != "") {
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
    if (req.body.db_name != null && req.body.db_name != '') {
      db = db2.sequelize3(req.body.db_name)
    } else {
      db = require('./common/sequelize_helper.js').sequelize
    }
    db
      .query(sql, {
        transaction: tx,
        replacements: {
          t_kiji_pk: req.body.editKiji.t_kiji_pk,
          t_kiji_category_pk: req.body.editKiji.t_kiji_category_pk,
          t_shain_pk: req.body.login_shain_pk,
          title: req.body.editKiji.title,
          contents: req.body.editKiji.contents,
          hashtag: req.body.editKiji.hashtag,
          t_coin_ido_pk: null,
          file_path: req.body.editKiji.file_path,
          user_id: req.body.login_shain_pk
        }
      })
      .spread((datas, metadata) => {
        console.log(datas)
        resdatas.push(datas)
        return resolve(datas)
      })
  })
}

/**
 * 記事ハッシュタグ（t_kiji_hashtag）テーブルのdelete
 * @param {*} tx
 * @param {*} resdatas
 * @param {*} req
 */
function deleteKijiHashtag(tx, resdatas, req) {
  return new Promise((resolve, reject) => {
    var sql = 
      "delete from t_kiji_hashtag where t_kiji_pk = :t_kiji_pk"

    if (req.body.db_name != null && req.body.db_name != '') {
      db = db2.sequelize3(req.body.db_name)
    } else {
      db = require('./common/sequelize_helper.js').sequelize
    }
    db
      .query(sql, {
        transaction: tx,
        replacements: {
          t_kiji_pk: req.body.editKiji.t_kiji_pk
        }
      })
      .spread((datas, metadata) => {
        console.log(datas)
        resdatas.push(datas)
        return resolve(datas)
      })
  })
}
/**
 * 記事ハッシュタグ（t_kiji_hashtag）テーブルのinsert
 * @param {*} tx
 * @param {*} resdatas
 * @param {*} req
 */
function insertKijiHashtag(tx, resdatas, req, tKijiHashtag) {
  return new Promise((resolve, reject) => {
    var sql = 
      "insert into t_kiji_hashtag (t_kiji_pk, seq_no, t_kiji_category_pk, hashtag, insert_user_id, insert_tm, update_user_id, update_tm) " +
      " values (:t_kiji_pk, :seq_no, :t_kiji_category_pk, :hashtag, :user_id, current_timestamp, :user_id, current_timestamp) "

    if (req.body.db_name != null && req.body.db_name != '') {
      db = db2.sequelize3(req.body.db_name)
    } else {
      db = require('./common/sequelize_helper.js').sequelize
    }
    db
      .query(sql, {
        transaction: tx,
        replacements: {
          t_kiji_pk: tKijiHashtag.t_kiji_pk,
          seq_no: tKijiHashtag.seq_no,
          t_kiji_category_pk: tKijiHashtag.t_kiji_category_pk,
          hashtag: tKijiHashtag.hashtag,
          user_id: req.body.login_shain_pk
        }
      })
      .spread((datas, metadata) => {
        console.log(datas)
        resdatas.push(datas)
        return resolve(datas)
      })
  })
}

/**
 * いいね（t_good）テーブルのinsert or update
 * @param {*} tx
 * @param {*} resdatas
 * @param {*} req
 */
function insertOrUpdateGood(tx, resdatas, req) {
  return new Promise((resolve, reject) => {
    var sql = ""
    if (req.body.editKiji.good_flg = "1") {
      sql =
        "insert into t_good (t_kiji_pk, t_shain_pk, insert_user_id, insert_tm, update_user_id, update_tm) " +
        " values (:t_kiji_pk, :t_shain_pk, :user_id, current_timestamp, :user_id, current_timestamp) " + 
        " on conflict do nothing"
    } else {
      sql =
        "delete from t_good " + 
        " where t_kiji_pk = :t_kiji_pk and t_shain_pk = :t_shain_pk"
    }
    if (req.body.db_name != null && req.body.db_name != '') {
      db = db2.sequelize3(req.body.db_name)
    } else {
      db = require('./common/sequelize_helper.js').sequelize
    }
    db
      .query(sql, {
        replacements: {
          t_kiji_pk: req.body.editKiji.t_kiji_pk,
          t_shain_pk: req.body.login_shain_pk,
          user_id: req.body.login_shain_pk
        }
      })
      .spread((datas, metadata) => {
        console.log(datas)
        resdatas.push(datas)
        return resolve(datas)
      })
  })
}

/**
 * お気に入り（t_favorite）テーブルのinsert or update
 * @param {*} tx
 * @param {*} resdatas
 * @param {*} req
 */
function insertOrUpdateFavorite(tx, resdatas, req) {
  return new Promise((resolve, reject) => {
    var sql = ""
    if (req.body.editKiji.favorite_flg = "1") {
      sql =
        "insert into t_favorite (t_kiji_pk, t_shain_pk, insert_user_id, insert_tm, update_user_id, update_tm) " +
        " values (:t_kiji_pk, :t_shain_pk, :user_id, current_timestamp, :user_id, current_timestamp) " + 
        " on conflict do nothing"
    } else {
      sql =
        "delete from t_favorite " + 
        " where t_kiji_pk = :t_kiji_pk and t_shain_pk = :t_shain_pk"
    }
    if (req.body.db_name != null && req.body.db_name != '') {
      db = db2.sequelize3(req.body.db_name)
    } else {
      db = require('./common/sequelize_helper.js').sequelize
    }
    db
      .query(sql, {
        replacements: {
          t_kiji_pk: req.body.editKiji.t_kiji_pk,
          t_shain_pk: req.body.login_shain_pk,
          user_id: req.body.login_shain_pk
        }
      })
      .spread((datas, metadata) => {
        console.log(datas)
        resdatas.push(datas)
        return resolve(datas)
      })
  })
}

/**
 * 記事既読（t_kiji_kidoku）テーブルのinsert or update
 * @param {*} tx
 * @param {*} resdatas
 * @param {*} req
 */
function insertOrUpdateKijiKidoku(tx, resdatas, req, kijiPk) {
  return new Promise((resolve, reject) => {
    var sql = 
      "insert into t_kiji_kidoku (t_shain_pk, t_kiji_category_pk, t_kiji_pk, insert_user_id, insert_tm, update_user_id, update_tm) " +
      " values (:t_shain_pk, :t_kiji_category_pk, :t_kiji_pk, :user_id, current_timestamp, :user_id, current_timestamp) " + 
      " on conflict (t_shain_pk, t_kiji_category_pk) do " +
      "update set t_kiji_pk = :t_kiji_pk, update_user_id = :user_id, update_tm = current_timestamp" +
      " where t_kiji_pk < :t_kiji_pk"

    if (req.body.db_name != null && req.body.db_name != '') {
      db = db2.sequelize3(req.body.db_name)
    } else {
      db = require('./common/sequelize_helper.js').sequelize
    }
    db
      .query(sql, {
        replacements: {
          t_shain_pk: req.body.login_shain_pk,
          t_kiji_category_pk: req.body.current_kiji_category_pk,
          t_kiji_pk: kijiPk,
          user_id: req.body.login_shain_pk
        }
      })
      .spread((datas, metadata) => {
        console.log(datas)
        resdatas.push(datas)
        return resolve(datas)
      })
  })
}

/**
 * BCコイン送金用関数
 * @param {*} req
 */
function bcrequest(req) {
  return new Promise((resolve, reject) => {
    var param = {
      from_account: [req.body.from_bcaccount],
      to_account: [req.body.to_bcaccount],
      password: [req.body.password],
      coin: [req.body.zoyoCoin],
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
