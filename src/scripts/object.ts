import * as qiniu from 'qiniu';
import { checkTokens } from '../utils/token';
import { bucketList } from '../apis';
import { askBuckets, askObjectKey } from '../utils/ask';
import { objectStatsInfo } from '../utils/renderer';

export const stat = async () => {
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
