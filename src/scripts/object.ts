import * as qiniu from 'qiniu';
import { checkTokens } from '../utils/token';
import { bucketList } from '../apis';
import { askBuckets, askObjectKey, askInputObjectKey } from '../utils/ask';
import { objectStatsInfo, selectOrigin, selectTarget, objectMoveSuccess, objectCopySuccess, objectDeleteSuccess } from '../utils/renderer';

export const stats = async () => {
  const { ak, sk } = await checkTokens();
  const mac = new qiniu.auth.digest.Mac(ak, sk);
  const qiniuConf = new qiniu.conf.Config();
  const bucketManager = new qiniu.rs.BucketManager(mac, qiniuConf);
  const buckets = await bucketList();
  const { bucket } = await askBuckets(buckets);
  const { key } = await askObjectKey(bucket);
  bucketManager.stat(bucket, key, (err, _, info) => {
    if (err) {
      console.log(`获取文件信息发生异常`);
      console.log(err);
    } else {
      objectStatsInfo(info.data);
    }
  });
}

export const move = async () => {
  const { ak, sk } = await checkTokens();
  const mac = new qiniu.auth.digest.Mac(ak, sk);
  const qiniuConf = new qiniu.conf.Config();
  const bucketManager = new qiniu.rs.BucketManager(mac, qiniuConf);
  const buckets = await bucketList();
  selectOrigin();
  const { bucket } = await askBuckets(buckets);
  const { key } = await askObjectKey(bucket);
  selectTarget();
  const { bucket: targetBucket } = await askBuckets(buckets);
  const { key: targetKey } = await askInputObjectKey();
  bucketManager.move(bucket, key, targetBucket, targetKey, null, (err, _, info) => {
    if (err) {
      console.log('error!! : err =>')
      console.log(err);
    } else {
      if (info.data && info.data.error) {
        console.log(`qiniu return error → ${info.data.error}`)
      } else {
        objectMoveSuccess(bucket, key, targetBucket, targetKey);
      }
    }
  })
}

export const copy = async () => {
  const { ak, sk } = await checkTokens();
  const mac = new qiniu.auth.digest.Mac(ak, sk);
  const qiniuConf = new qiniu.conf.Config();
  const bucketManager = new qiniu.rs.BucketManager(mac, qiniuConf);
  const buckets = await bucketList();
  selectOrigin();
  const { bucket } = await askBuckets(buckets);
  const { key } = await askObjectKey(bucket);
  selectTarget();
  const { bucket: targetBucket } = await askBuckets(buckets);
  const { key: targetKey } = await askInputObjectKey();
  bucketManager.copy(bucket, key, targetBucket, targetKey, null, (err, _, info) => {
    if (err) {
      console.log('error!! : err =>')
      console.log(err);
    } else {
      if (info.data && info.data.error) {
        console.log(`qiniu return error → ${info.data.error}`)
      } else {
        objectCopySuccess(bucket, key, targetBucket, targetKey);
      }
    }
  })
}

export const del = async () => {
  const { ak, sk } = await checkTokens();
  const mac = new qiniu.auth.digest.Mac(ak, sk);
  const qiniuConf = new qiniu.conf.Config();
  const bucketManager = new qiniu.rs.BucketManager(mac, qiniuConf);
  const buckets = await bucketList();
  const { bucket } = await askBuckets(buckets);
  const { key } = await askObjectKey(bucket);
  bucketManager.delete(bucket, key, (err, _, info) => {
    if (err) {
      console.log('error!! : err =>')
      console.log(err);
    } else {
      if (info.data && info.data.error) {
        console.log(`qiniu return error → ${info.data.error}`)
      } else {
        objectDeleteSuccess(bucket, key);
      }
    }
  })
}
