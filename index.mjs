import coininfo from 'coininfo';
import CoinKey from 'coinkey';
import cashaddr from  'cashaddrjs';
import { encode, decode } from 'coinstring';

const str = "1PRTTaJesdNovgne6Ehcdu1fpEdX7913CK";
console.log(decode(str,0));
process.exit(0);


import fs from 'fs';

let coins;///=["decred"];
coins = Object.keys(coininfo);
coins.sort();
//   console.dump=function(obj) {
//     this.log(JSON.stringify(obj,null,2));
//   };
const keys = [
  "038109007313a5807b2eccc082c8c3fbb988a973cacf1a7df9ce725c31b14776",
  "0000000000000000000000000000000000000000000000000000000000000001"
];
const vector={};
vector.coins={};
vector.addrs=[];
for( const coin of coins ) {
  const vec={ coin };
  const ci = coininfo(coin);
  vec.pubver=ci.versions.public;
  vec.priver=ci.versions.private;
  vec.bchpre=ci.versions.bchpre;
  vec.sym=ci.unit.toLowerCase();
  vector.coins[vec.sym]=vec;
}
for(const hex_key of keys ) {
  const key = Buffer.from(hex_key,'hex');
  var ci;
  const set={};
  vector.addrs.push(set);
  set.key=key.toString("hex");
  set.pub=new CoinKey(key).publicKey.toString('hex');
  set.addrs={};
  for( const coin of coins ) {
    const vec={ };
    const ci = coininfo(coin);
    vec.sym=ci.unit.toLowerCase();
    const ck = new CoinKey(key,ci);
    vec.addr=ck.publicAddress;
    vec.wif=ck.privateWif;
    if(ci.versions.bchpre) {
      const prefix=ci.versions.bchpre;
      const type='P2PKH';
      const hash=ck.pubKeyHash;
      const bchaddr=cashaddr.encode(prefix, type, hash);
      vec.bchaddr=bchaddr;
    }
    set.addrs[vec.sym]=vec;
  }
}

const text=JSON.stringify(vector,0,2);
fs.writeFileSync('vector.json',text);
