import coininfo from 'coininfo';
import CoinKey from 'coinkey';
import fs from 'fs';
const keys=Object.keys;
const coins = keys(coininfo);
console.dump=function(obj) {
  this.log(JSON.stringify(obj,null,2));
};
const hex_key=
  "038109007313a5807b2eccc082c8c3fbb988a973cacf1a7df9ce725c31b14776";
const key = Buffer.from(hex_key,'hex');
var ci;
const vector={};
vector.key=key.toString("hex");
vector.pub=new CoinKey(key).publicKey.toString('hex');
vector.addrs={};
for( const coin of coins ) {
  const vec=vector.addrs[coin]={};
  const ci = coininfo(coin);
  console.dump(ci);
  vec.ver=ci.versions.public;
  const ck = new CoinKey(key,ci);
  vec.addr=ck.publicAddress;
  vec.sym=ck.unit;
};

fs.writeFileSync('vector.json',JSON.stringify(vector,0,2));
