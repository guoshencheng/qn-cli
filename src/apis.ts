import * as request from 'request-promise';
import { checkTokens } from './utils/token';
import * as qiniu from 'qiniu';

export const bucketList = async (): Promise<string[]> => {
  const { ak, sk } = await checkTokens();
  const mac = new qiniu.auth.digest.Mac(ak, sk);
  const accessToken = qiniu.util.generateAccessToken(mac, '/buckets', '');
  const zone = qiniu.zone.Zone_z0;
  const data = await request({
    baseUrl: `https://${zone.rsHost}`,
    uri: '/buckets',
    headers: {
      Authorization: accessToken,
    }
  })
  try {
    return JSON.parse(data);
  } catch (_) {
    return data;
  }
}

export const bucketHostNames = async (bucket: string): Promise<string[]> => {
  const { ak, sk } = await checkTokens();
  const mac = new qiniu.auth.digest.Mac(ak, sk);
  const uri = `/v6/domain/list?tbl=${bucket}`
  const accessToken = qiniu.util.generateAccessToken(mac, uri, '');
  const zone = qiniu.zone.Zone_z0;
  const data = await request({
    baseUrl: `https://${zone.apiHost}`,
    uri,
    headers: {
      Authorization: accessToken,
    }
  })
  try {
    return JSON.parse(data);
  } catch (_) {
    return data;
  }
}
