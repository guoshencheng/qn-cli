import * as request from 'request-promise';
import { checkTokens } from './utils/token';
import * as qiniu from 'qiniu';

interface RefreshParams {
  urls?: string[];
  dirs?: string[];
}

export const refreshResource = async (params: RefreshParams): Promise<void> => {
  const { ak, sk } = await checkTokens();
  const mac = new qiniu.auth.digest.Mac(ak, sk);
  const accessToken = qiniu.util.generateAccessToken(mac, '/v2/tune/refresh', '');
  const zone = qiniu.zone.Zone_z0;
  const result = await request({
    baseUrl: `https://${zone.apiHost}`,
    method: 'POST',
    uri: '/v2/tune/refresh',
    body: JSON.stringify(params),
    headers: {
      Authorization: accessToken,
    }
  })
  console.log(result);
}

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
