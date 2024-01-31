const base58 = require('bs58');
const createHash = require('create-hash');

let data;
function main() {
  const addr = "1PRTTaJesdNovgne6Ehcdu1fpEdX7913CK";
  data={
    addr: addr,
    from: "1PRTTaJesdNovgne6Ehcdu1fpEdX7913CK"
  };
  data.equal=data.from===addr;
  console.log({data});
  console.log(decode(addr));
}


function decode (base58str, version) {
  data.str=base58str;
  data.ver=version;
  const arr = base58.decode(base58str);
  const buf = new Buffer(arr);
  let versionLength;
  if (version == null) {
    versionLength = 0
  } else {
    if (typeof version === 'number')
      version = new Buffer([version])
    versionLength = version.length
    const versionCompare = buf.slice(0, versionLength);
    logBuf("vc", versionCompare);
    if (versionCompare.toString('hex') !== version.toString('hex')) {
      throw new Error('Invalid version')
    }
  }
  data.ver_len=versionLength;
  data.buf=logStr(buf);
  const checksum = buf.slice(-4);
  data.checksum=logStr(buf.slice(-4));
  const endPos = buf.length - 4;
  const bytes = buf.slice(0, endPos);
  data.bytes=logStr(bytes);
  const sha1 = createHash('sha256').update(bytes).digest();
  data.sha1=logStr(sha1);
  const sha2 = createHash('sha256').update(sha1).digest();
  data.sha2=logStr(sha2);
  const newChecksum = sha256x2(bytes).slice(0, 4);
  data.new=logStr(newChecksum);
  console.log(JSON.stringify(data,null,2));
  if (checksum.toString('hex') !== newChecksum.toString('hex')) {
    throw new Error('Invalid checksum')
  }
  data.valid=true;

  return bytes.slice(versionLength)
}
function logBuf(buf) {
  console.log(logStr(buf));
}
function logStr(buf) {
  const res={
  };
  res.len=buf.length;
  res.dat=buf.toString('hex');
  return JSON.stringify(res);
}

function isValid (base58str, version) {
  try {
    decode(base58str, version)
  } catch (e) {
    return false
  }

  return true
}

function createEncoder (version) {
  return function (payload) {
    return encode(payload, version)
  }
}

function createDecoder (version) {
  return function (base58str) {
    return decode(base58str, version)
  }
}

function createValidator (version) {
  return function (base58str) {
    return isValid(base58str, version)
  }
}

function sha256x2 (buffer) {
  const sha = createHash('sha256').update(buffer).digest();
  return createHash('sha256').update(sha).digest()
}

function encode (payload, version) {
  if (Array.isArray(payload) || payload instanceof Uint8Array) {
    payload = Buffer.from(payload)
  }

  let buf;
  if (version != null) {
    if (typeof version === 'number') {
      version = Buffer.from([version])
    }
    buf = Buffer.concat([version, payload])
  } else {
    buf = payload
  }
  const checksum = sha256x2(buf).slice(0, 4);
  const result = Buffer.concat([buf, checksum]);
  return base58.encode(result)
}
module.exports = {
  encode: encode,
  decode: decode,
  isValid: isValid,
  createEncoder: createEncoder,
  createDecoder: createDecoder,
  createValidator: createValidator
}
main();
