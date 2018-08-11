import { bucketList } from '../apis';

export const list = async () => {
  try {
    const buckets = await bucketList();
    console.log(`bucket list：`)
    buckets.forEach((bucket, index) => {
      console.log(`${index + 1}. ${bucket}`);
    })
  } catch (error) {
    console.log(error);
  }
}
