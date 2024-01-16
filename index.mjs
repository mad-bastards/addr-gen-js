import coininfo from 'coininfo';
import CoinKey from 'coinkey';
import fs from 'fs';
var coins=["decred"];
coins = Object.keys(coininfo);
coins.sort();
//   console.dump=function(obj) {
//     this.log(JSON.stringify(obj,null,2));
//   };
const keys = [
  "038109007313a5807b2eccc082c8c3fbb988a973cacf1a7df9ce725c31b14776",
  "0000000000000000000000000000000000000000000000000000000000000001"
];
const vector=[];
for(const hex_key of keys ) {
  const key = Buffer.from(hex_key,'hex');
  var ci;
  const set={};
  vector.push(set);
  set.key=key.toString("hex");
  set.pub=new CoinKey(key).publicKey.toString('hex');
  set.addrs={};
  for( const coin of coins ) {
    const vec={ coin };
    const ci = coininfo(coin);
    vec.pubver=ci.versions.public;
    vec.priver=ci.versions.private;
    const ck = new CoinKey(key,ci);
    console.log(ck);
    vec.addr=ck.publicAddress;
    vec.sym=ci.unit;
    vec.wif=ck.privateWif;
    set.addrs[vec.sym]=vec;
  }
}

const text=JSON.stringify(vector,0,2);
console.log(text);
fs.writeFileSync('vector.json',text);
