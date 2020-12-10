const axios = require("axios");
const SparkMD5 = require("spark-md5");

const appid = "20201208000641832";
const secret = "QHFmDIXHEK6JGmR8S3Vg";

module.exports = (word) => {
  const salt = Date.now();
  const sign = SparkMD5.hash(`${appid}${word}${salt}${secret}`);
  const url = `http://api.fanyi.baidu.com/api/trans/vip/translate`;
  return axios({
    url,
    params: {
      q: word,
      from: "zh",
      to: "en",
      appid,
      salt,
      sign,
    },
  })
    .then((res) => {
      const { data } = res;
      if (!data.trans_result.length) return "";

      return data.trans_result.map((v) => {
        return v.dst;
      });
    })
    .catch((err) => {
      console.log(err);
      Promise.resolve("");
    });
};
