import { bucketList, bucketHostNames } from '../apis';
import { askBuckets } from '../utils/ask';
import * as renderer from '../utils/renderer';

export const fetchHosts = async (bucket?: string) => {
  if (!bucket) {
    const buckets = await bucketList();
    const answer = await askBuckets(buckets);
    bucket = answer.bucket;
  }
  const hostnames = await bucketHostNames(bucket);
  renderer.hostnames(hostnames, bucket);
}
