import coininfo from 'coininfo';
//   import CoinKey from 'coinkey';
import fs from 'fs';
var coins=["decred"];
coins = Object.keys(coininfo);
coins.sort();
for( const coin of coins ) {
  const vec={ coin };
  const ci = coininfo(coin);
  console.log({vec,ci});
}

const text=JSON.stringify(vector,0,2);
console.log(text);
fs.writeFileSync('vector.json',text);
