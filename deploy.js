/* eslint-disable no-undef */

const Axios = require('axios');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const instance = Axios.create({
  baseURL: 'https://api.xjq.icu/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

function getUploadToken() {
  return instance.get('/public/sts-token').then(({ data: responseData }) => {
    const { code, data } = responseData;
    if (code === 0) {
      return data;
    }
    process.exit(1);
  });
}

const deploy = require('aliyun-oss-static-deploy');

function upload() {
  getUploadToken().then((ossConfig) => {
    const { AccessKeyId, AccessKeySecret, SecurityToken } = ossConfig || {};
    const options = {
      ...ossConfig,
      stsToken: SecurityToken,
      accessKeyId: AccessKeyId,
      accessKeySecret: AccessKeySecret,
    };

    deploy({
      ossConfig: options,
      //  最好同时配置staticPath,ossPath,确定上传文件路径以及存储路径
      staticPath: 'build', // 默认为根路径
      ossPath: 'img', // oss存储路径,默认是根路径,
      recursion: true, // 递归上传,默认为true,文件夹下所有文件递归上传
    });
  });
}
upload();
