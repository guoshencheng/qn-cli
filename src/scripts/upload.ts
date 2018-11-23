import { createReadStream } from 'fs';
import { join, relative, sep } from 'path';
import * as qiniu from 'qiniu';
import * as gs from 'glob-stream';
import * as through2 from 'through2';

import { askBuckets, askBasePath } from '../utils/ask';

import { checkTokens } from '../utils/token';
import { bucketList, bucketHostNames } from '../apis';
import * as renderer from '../utils/renderer';

const cwd = process.cwd();

export interface UploadFileOptions {
  dir: string;
  key: string;
  basePath: string;
  putPolicy: qiniu.rs.PutPolicy;
  mac: qiniu.auth.digest.Mac;
  qiniuConf: qiniu.conf.Config;
}
export const uploadFile = async ({
  dir,
  key,
  basePath,
  putPolicy,
  mac,
  qiniuConf
}: UploadFileOptions): Promise<any> => {
  const readable = createReadStream(dir);
  return await uploadStream({
    stream: readable,
    key: join(basePath, key),
    putPolicy,
    mac,
    qiniuConf
  });
}

export interface UploadStreamOptions {
  stream: NodeJS.ReadableStream,
  key: string;
  putPolicy: qiniu.rs.PutPolicy;
  mac: qiniu.auth.digest.Mac;
  qiniuConf: qiniu.conf.Config;
}

export const uploadStream = async ({ stream, key, putPolicy, mac, qiniuConf }: UploadStreamOptions) => {
  const token = putPolicy.uploadToken(mac);
  const putExtra = new qiniu.form_up.PutExtra();
  const formUploader = new qiniu.form_up.FormUploader(qiniuConf);
  return new Promise((resolve, reject) => {
    formUploader.putStream(token, key, stream, putExtra, (err: Error, body: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

export interface CheckFileOptions {
  basePath: string;
  key: string;
  mac: qiniu.auth.digest.Mac;
  qiniuConf: qiniu.conf.Config;
  bucket: string;
}

export const checkFile = ({ basePath, key, mac, qiniuConf, bucket }: CheckFileOptions) => {
  return new Promise((resolve, reject) => {
    const bucketManager = new qiniu.rs.BucketManager(mac, qiniuConf);
    bucketManager.stat(bucket, join(basePath, key), (err, _, info) => {
      if (err) {
        reject(err);
      } else {
        if (info.data.error) {
          resolve(true);
        } else {
          /* tslint:disable-next-line */
          console.log(`文件已经存在 跳过上传 → ${key}`);
          resolve(false);
        }
      }
    });
  });
}

export interface QiniuUploaderOption {
  force?: boolean,
  basePath?: string;
  glob: string | string[];
}

export default async ({ glob, basePath, force }: QiniuUploaderOption) => {
  const buckets = await bucketList();
  const { bucket } = await askBuckets(buckets);
  const hostnames = await bucketHostNames(bucket);
  renderer.hostnames(hostnames, bucket);
  let $basePath: string;
  if (!basePath) {
    $basePath = await askBasePath();
  } else {
    $basePath = basePath;
  }
  const hostname = hostnames[hostnames.length - 1] || '';
  const { ak, sk } = await checkTokens();
  const mac = new qiniu.auth.digest.Mac(ak, sk);
  const putPolicy =  new qiniu.rs.PutPolicy({
    scope: bucket,
    returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
  });
  const qiniuConf = new qiniu.conf.Config();
  return new Promise((resolve, reject) => {
    if (Array.isArray(glob)) {
      glob = glob.map(i => join(cwd, i));
    } else {
      glob = join(cwd, glob);
    }
    const stream = gs(glob)
      .pipe(through2.obj(async(file, _, next) => {
        let filePath = relative(file.base, file.path);
        filePath = filePath.split(sep).join('/');
        const need = !!force || await checkFile({
          basePath: $basePath,
          key: filePath,
          mac,
          qiniuConf,
          bucket
        });
        if (!need) {
          next();
        } else {
          /* tslint:disable-next-line */
          console.log(`uploading → ${filePath} ...`);
          const body = await uploadFile({
            dir: file.path,
            key: filePath,
            putPolicy,
            qiniuConf,
            mac,
            basePath: $basePath,
          });
          /* tslint:disable-next-line */
          console.log(`success upload -> ${hostname ? `http://${hostname}`: ''}/${body.key}`);
          next();
        }
      }));
    stream.on('data', () => { });
    stream.on('end', resolve);
    stream.on('error', reject);
  });
}
