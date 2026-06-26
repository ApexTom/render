// ============================================================
// 央视频 IPTV - Render Node.js 服务
// 移植自 yspios.php / CKeyManager
// ============================================================

import http from 'http';
import { URL } from 'url';

const PORT = process.env.PORT || 3000;

// -------------------- 频道表 --------------------
const CHANNELS = {
  cctv1:      ['2024078201', '600001859', 'fhd'],
  cctv2:      ['2024075401', '600001800', 'fhd'],
  cctv3:      ['2024068501', '600001801', 'fhd'],
  cctv4:      ['2029797101', '600001814', 'fhd'],
  cctv5:      ['2024078401', '600001818', 'fhd'],
  cctv5p:     ['2024078001', '600001817', 'fhd'],
  cctv6:      ['2013693901', '600108442', 'fhd'],
  cctv7:      ['2024072001', '600004092', 'fhd'],
  cctv8:      ['2029793001', '600001803', 'fhd'],
  cctv9:      ['2024078601', '600004078', 'fhd'],
  cctv10:     ['2024078701', '600001805', 'fhd'],
  cctv11:     ['2027248701', '600001806', 'fhd'],
  cctv12:     ['2027248801', '600001807', 'fhd'],
  cctv13:     ['2029797201', '600001811', 'fhd'],
  cctv14:     ['2027248901', '600001809', 'fhd'],
  cctv15:     ['2027249001', '600001815', 'fhd'],
  cctv16:     ['2027249101', '600098637', 'fhd'],
  cctv164k:   ['2027249301', '600099502', 'fhd'],
  cctv17:     ['2027249401', '600001810', 'fhd'],
  cctv4k:     ['2029810301', '600002264', 'fhd'],
  cctv8k:     ['2026774101', '600156816', 'fhd'],
  cgtn:       ['2024181701', '600014550', 'fhd'],
  cgtnfy:     ['2024181801', '600084704', 'fhd'],
  cgtney:     ['2024181901', '600084758', 'fhd'],
  cgtnalby:   ['2024182001', '600084782', 'fhd'],
  cgtnxby:    ['2024182101', '600084744', 'fhd'],
  cgtnwyjl:   ['2024182301', '600084781', 'fhd'],
  cctvfyjc:   ['2025637103', '600099658', 'shd'],
  cctvdyjc:   ['2026874203', '600099655', 'shd'],
  cctvhjjc:   ['2026874303', '600099620', 'shd'],
  cctvsjdl:   ['2026874403', '600099637', 'shd'],
  cctvfyyy:   ['2026874503', '600099660', 'shd'],
  cctvbqkj:   ['2026874603', '600099649', 'shd'],
  cctvfyzq:   ['2026966203', '600099636', 'shd'],
  cctvgeqwq:  ['2026874703', '600099659', 'shd'],
  cctvnxss:   ['2026874803', '600099650', 'shd'],
  cctvyswhjp: ['2026874903', '600099653', 'shd'],
  cctvystq:   ['2026875003', '600099652', 'shd'],
  cctvdszn:   ['2026875103', '600099656', 'shd'],
  cctvwsjk:   ['2025637003', '600099651', 'shd'],
  bjws:       ['2024052703', '600002309', 'fhd'],
  jsws:       ['2024171103', '600002521', 'fhd'],
  dfws:       ['2024054503', '600002483', 'fhd'],
  zjws:       ['2024054703', '600002520', 'fhd'],
  hnws:       ['2024054803', '600002475', 'fhd'],
  hbws:       ['2024171203', '600002508', 'fhd'],
  gdws:       ['2024060903', '600002485', 'fhd'],
  gxws:       ['2024060703', '600002509', 'fhd'],
  hljws:      ['2029797003', '600002498', 'fhd'],
  hnws2:      ['2024055603', '600002506', 'fhd'],
  cqws:       ['2024061103', '600002531', 'fhd'],
  szws:       ['2024061303', '600002481', 'fhd'],
  scws:       ['2024061403', '600002516', 'fhd'],
  henanws:    ['2029797303', '600002525', 'fhd'],
  fjdnhz:     ['2024061503', '600002484', 'fhd'],
  gzhws:      ['2024061603', '600002490', 'fhd'],
  jxws:       ['2024061703', '600002503', 'fhd'],
  lnws:       ['2024171303', '600002505', 'fhd'],
  ahws:       ['2024171403', '600002532', 'fhd'],
  hbws2:      ['2024171503', '600002493', 'fhd'],
  sdws:       ['2029787903', '600002513', 'fhd'],
  tjws:       ['2019927003', '600152137', 'fhd'],
  jlws:       ['2025561503', '600190405', 'fhd'],
  shanxiws:   ['2029795103', '600190400', 'fhd'],
  nxws:       ['2025608503', '600190737', 'fhd'],
  nmgws:      ['2025561203', '600190401', 'fhd'],
  ynws:       ['2025561303', '600190402', 'fhd'],
  shanxiws2:  ['2025560803', '600190407', 'fhd'],
  qhws:       ['2025559103', '600190406', 'fhd'],
  xzws:       ['2025558003', '600190403', 'fhd'],
  cetv1:      ['2022823801', '600171827', 'fhd'],
  gxpd:       ['2029360403', '600213139', 'fhd'],
  xjws:       ['2019927403', '600152138', 'fhd'],
};

const NAMES = {
  cctv1:'CCTV-1高清', cctv2:'CCTV-2高清', cctv3:'CCTV-3高清', cctv4:'CCTV-4高清',
  cctv5:'CCTV-5高清', cctv5p:'CCTV-5+高清', cctv6:'CCTV-6高清', cctv7:'CCTV-7高清',
  cctv8:'CCTV-8高清', cctv9:'CCTV-9高清', cctv10:'CCTV-10高清', cctv11:'CCTV-11高清',
  cctv12:'CCTV-12高清', cctv13:'CCTV-13高清', cctv14:'CCTV-14高清', cctv15:'CCTV-15高清',
  cctv16:'CCTV-16高清', cctv164k:'CCTV-16(4K)', cctv17:'CCTV-17高清',
  cctv4k:'CCTV-4K', cctv8k:'CCTV-8K',
  cgtn:'CGTN', cgtnfy:'CGTN法语', cgtney:'CGTN俄语', cgtnalby:'CGTN阿拉伯语',
  cgtnxby:'CGTN西班牙语', cgtnwyjl:'CGTN外语纪录',
  cctvfyjc:'CCTV风云剧场', cctvdyjc:'CCTV第一剧场', cctvhjjc:'CCTV怀旧剧场',
  cctvsjdl:'CCTV世界地理', cctvfyyy:'CCTV风云音乐', cctvbqkj:'CCTV兵器科技',
  cctvfyzq:'CCTV风云足球', cctvgeqwq:'CCTV高尔夫网球', cctvnxss:'CCTV女性时尚',
  cctvyswhjp:'CCTV央视文化精品', cctvystq:'CCTV央视台球', cctvdszn:'CCTV电视指南',
  cctvwsjk:'CCTV卫生健康',
  bjws:'北京卫视', jsws:'江苏卫视', dfws:'东方卫视', zjws:'浙江卫视',
  hnws:'湖南卫视', hbws:'湖北卫视', gdws:'广东卫视', gxws:'广西卫视',
  hljws:'黑龙江卫视', hnws2:'海南卫视', cqws:'重庆卫视', szws:'深圳卫视',
  scws:'四川卫视', henanws:'河南卫视', fjdnhz:'福建东南卫视', gzhws:'贵州卫视',
  jxws:'江西卫视', lnws:'辽宁卫视', ahws:'安徽卫视', hbws2:'河北卫视',
  sdws:'山东卫视', tjws:'天津卫视', jlws:'吉林卫视', shanxiws:'陕西卫视',
  nxws:'宁夏卫视', nmgws:'内蒙古卫视', ynws:'云南卫视', shanxiws2:'山西卫视',
  qhws:'青海卫视', xzws:'西藏卫视', cetv1:'中国教育1', gxpd:'国学频道', xjws:'新疆卫视',
};

// -------------------- 常量 --------------------
const DELTA = 0x9e3779b9;
const ROUNDS = 16;
const SALT_LEN = 2;
const ZERO_LEN = 7;
const TEA_CKEY = '59b2f7cf725ef43c34fdd7c123411ed3';
const GUARD_TEA_KEY = '110DBEC10C23E7D2E56A1CAD6914EF1B';
const XOR_KEY = [0x84,0x2E,0xED,0x08,0xF0,0x66,0xE6,0xEA,0x48,0xB4,0xCA,0xA9,0x91,0xED,0x6F,0xF3];
const GUARD_XOR_KEY = [0xB3,0xC9,0x53,0xA0,0x69,0x13,0xAD,0x4D];
const STD_ALPHA  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const CUST_ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-=';

// -------------------- 工具 --------------------
const uint32 = n => n >>> 0;

function randomBytes(n) {
  const buf = Buffer.alloc(n);
  for (let i = 0; i < n; i++) buf[i] = Math.floor(Math.random() * 256);
  return buf;
}

function hexToBytes(hex) {
  return Buffer.from(hex, 'hex');
}

function bytesToHex(buf) {
  return Buffer.from(buf).toString('hex');
}

function generateGuid() {
  return randomBytes(16).toString('hex');
}

function calcSignature(bytes) {
  let sig = 0;
  for (const b of bytes) {
    sig = uint32(uint32(0x83 * sig) + (b & 0xFF)) & 0x7FFFFFFF;
  }
  return sig;
}

// -------------------- 自定义 Base64 --------------------
function customEncode(buf) {
  let b64 = buf.toString('base64');
  let result = '';
  for (const ch of b64) {
    const i = STD_ALPHA.indexOf(ch);
    result += i >= 0 ? CUST_ALPHA[i] : ch;
  }
  return result.replace(/=+$/, '');
}

// -------------------- XOR --------------------
function xorArray(buf) {
  return Buffer.from(buf).map((b, i) => b ^ XOR_KEY[i & 0xF]);
}

// -------------------- TEA ECB --------------------
function teaEncryptECB(block8, keyBuf) {
  const k = [keyBuf.readUInt32BE(0), keyBuf.readUInt32BE(4), keyBuf.readUInt32BE(8), keyBuf.readUInt32BE(12)];
  let y = block8.readUInt32BE(0);
  let z = block8.readUInt32BE(4);
  let sum = 0;
  for (let i = 0; i < ROUNDS; i++) {
    sum = uint32(sum + DELTA);
    y = uint32(y + (uint32((uint32(z << 4) + k[0]) ^ uint32(z + sum) ^ (uint32(z >>> 5) + k[1]))));
    z = uint32(z + (uint32((uint32(y << 4) + k[2]) ^ uint32(y + sum) ^ (uint32(y >>> 5) + k[3]))));
  }
  const out = Buffer.alloc(8);
  out.writeUInt32BE(y, 0);
  out.writeUInt32BE(z, 4);
  return out;
}

function teaDecryptECB(block8, keyBuf) {
  const k = [keyBuf.readUInt32BE(0), keyBuf.readUInt32BE(4), keyBuf.readUInt32BE(8), keyBuf.readUInt32BE(12)];
  let y = block8.readUInt32BE(0);
  let z = block8.readUInt32BE(4);
  let sum = uint32(uint32(DELTA) * ROUNDS);
  for (let i = 0; i < ROUNDS; i++) {
    z = uint32(z - (uint32((uint32(y << 4) + k[2]) ^ uint32(y + sum) ^ (uint32(y >>> 5) + k[3]))));
    y = uint32(y - (uint32((uint32(z << 4) + k[0]) ^ uint32(z + sum) ^ (uint32(z >>> 5) + k[1]))));
    sum = uint32(sum - DELTA);
  }
  const out = Buffer.alloc(8);
  out.writeUInt32BE(y, 0);
  out.writeUInt32BE(z, 4);
  return out;
}

// -------------------- TEA CBC 加密 --------------------
function oiSymmetryEncrypt2(plainBuf, keyBuf) {
  const nInBufLen = plainBuf.length;
  const nPadSaltBodyZeroLen = nInBufLen + 1 + SALT_LEN + ZERO_LEN;
  let nPadlen = nPadSaltBodyZeroLen % 8;
  if (nPadlen) nPadlen = 8 - nPadlen;

  const outChunks = [];
  const src_buf = Buffer.alloc(8);
  src_buf[0] = (randomBytes(1)[0] & 0xF8) | nPadlen;
  let src_i = 1;
  const iv_plain = Buffer.alloc(8);
  let iv_crypt = Buffer.alloc(8);

  function flushBlock() {
    const xored = Buffer.from(src_buf).map((b, j) => b ^ iv_crypt[j]);
    const enc = teaEncryptECB(xored, keyBuf);
    const out = Buffer.from(enc).map((b, j) => b ^ iv_plain[j]);
    iv_plain.set(src_buf);
    iv_crypt = out;
    outChunks.push(Buffer.from(out));
    src_i = 0;
  }

  for (let p = 0; p < nPadlen; p++) {
    src_buf[src_i++] = randomBytes(1)[0];
    if (src_i === 8) flushBlock();
  }
  for (let s = 0; s < SALT_LEN; s++) {
    src_buf[src_i++] = randomBytes(1)[0];
    if (src_i === 8) flushBlock();
  }
  for (let bi = 0; bi < nInBufLen; bi++) {
    src_buf[src_i++] = plainBuf[bi];
    if (src_i === 8) flushBlock();
  }
  for (let z = 0; z < ZERO_LEN; z++) {
    src_buf[src_i++] = 0;
    if (src_i === 8) flushBlock();
  }
  if (src_i > 0) {
    for (let j = src_i; j < 8; j++) src_buf[j] = 0;
    flushBlock();
  }

  return Buffer.concat(outChunks);
}

// -------------------- ck_guard_time --------------------
function guardLastFive(s) {
  s = String(s);
  return s.length >= 5 ? s.slice(-5) : '';
}

function generateCkGuardTime(timestamp, guid) {
  const guardKey = hexToBytes(GUARD_TEA_KEY);
  const parts = [guardLastFive(guid), guardLastFive('null'), guardLastFive('null'), '-1'];

  const tsBytes = Buffer.alloc(4);
  tsBytes.writeUInt32BE(timestamp >>> 0, 0);

  const partBufs = parts.map(p => Buffer.from(p, 'utf8'));
  const bodyLen = 4 + partBufs.reduce((s, b) => s + 2 + b.length, 0);
  const body = Buffer.alloc(bodyLen);
  tsBytes.copy(body, 0);
  let pos = 4;
  for (const pb of partBufs) {
    body.writeUInt16BE(pb.length, pos); pos += 2;
    pb.copy(body, pos); pos += pb.length;
  }

  const plain = Buffer.alloc(2 + bodyLen);
  plain.writeUInt16BE(bodyLen, 0);
  body.copy(plain, 2);

  const checksum = calcSignature(plain);
  const encrypted = oiSymmetryEncrypt2(plain, guardKey);

  const full = Buffer.alloc(encrypted.length + 4);
  encrypted.copy(full, 0);
  full.writeUInt32BE(checksum >>> 0, encrypted.length);

  const xored = Buffer.from(full).map((b, i) => b ^ GUARD_XOR_KEY[i & 7]);
  return bytesToHex(xored).toUpperCase();
}

// -------------------- buildPacket --------------------
function strField(s) {
  const sb = Buffer.from(s, 'utf8');
  const r = Buffer.alloc(2 + sb.length);
  r.writeUInt16BE(sb.length, 0);
  sb.copy(r, 2);
  return r;
}

function buildPacket(params) {
  const header = hexToBytes('0000004200000004000004d2');
  const plat = Buffer.alloc(4); plat.writeUInt32BE(params.Platform, 0);
  const sigPlaceholder = Buffer.alloc(4);
  const ts = Buffer.alloc(4); ts.writeUInt32BE(params.Timestamp, 0);
  const p1 = Buffer.alloc(4); p1.writeUInt32BE(1, 0);
  const dl = Buffer.alloc(4); dl.writeUInt32BE(1, 0);

  const chunks = [
    header, plat, sigPlaceholder, ts,
    strField(params.Sdtfrom),
    strField(params.randFlag),
    strField(params.appVer),
    strField(params.vid),
    strField(params.guid),
    p1, dl,
    strField('2622783A'),
    strField('nil'),
    strField(params.uuid4),
    strField('nil'),
    strField('v0.1.000'),
    strField('com.cctv.yangshipin.app.iphone'),
    strField('4330403'),
    strField('ex_json_bus'),
    strField('ex_json_vs'),
    strField(params.ck_guard_time),
  ];

  const body = Buffer.concat(chunks);
  const bodyLen = body.length;
  const lenHeader = Buffer.alloc(2);
  lenHeader.writeUInt16BE(bodyLen, 0);
  const buffer = Buffer.concat([lenHeader, body]);

  const sig = calcSignature(buffer);
  buffer.writeUInt32BE(sig >>> 0, 18); // 2+12+4=18

  return buffer;
}

// -------------------- encryptDataToCKey --------------------
function encryptDataToCKey(dataBuf) {
  const teaKey = hexToBytes(TEA_CKEY);
  const checksum = calcSignature(dataBuf);
  const encrypted = oiSymmetryEncrypt2(dataBuf, teaKey);
  const full = Buffer.alloc(encrypted.length + 4);
  encrypted.copy(full, 0);
  full.writeUInt32BE(checksum >>> 0, encrypted.length);
  const xored = xorArray(full);
  return '--01' + customEncode(xored);
}

// -------------------- generateCKey --------------------
function generateCKey(cnlid, timestamp, guid) {
  const ck_guard_time = generateCkGuardTime(timestamp, guid);
  const params = {
    Platform: 4330403,
    Timestamp: timestamp,
    Sdtfrom: 'dcgh',
    vid: cnlid,
    guid,
    appVer: 'V8.22.1035.3031',
    randFlag: '_zj1A5Gh6QYcxWjIUGos2w==',
    uuid4: '57eab0c4-2c58-44c6-8ae9-dd2757525dc5',
    ck_guard_time,
  };
  const buffer = buildPacket(params);
  return { ckey: encryptDataToCKey(buffer), params };
}

// -------------------- flowid --------------------
function generateFlowid() {
  const b = randomBytes(16);
  const h = b.toString('hex').toUpperCase();
  return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}_4330403`;
}

// -------------------- API 请求 --------------------
async function getPlayUrl(cnlid, livepid, defn) {
  const guid = generateGuid();
  const timestamp = Math.floor(Date.now() / 1000);
  const { ckey, params } = generateCKey(cnlid, timestamp, guid);

  const qp = new URLSearchParams({
    atime: '120', livepid, cnlid,
    appVer: 'V8.22.1035.3031', app_version: '300090',
    caplv: '1', cmd: '2', defn, device: 'iPhone',
    encryptVer: '4.2', getpreviewinfo: '0', hevclv: '33',
    lang: 'zh-Hans_JP', livequeue: '0', logintype: '1',
    nettype: '1', newnettype: '1', newplatform: '4330403', platform: '4330403',
    sdtfrom: 'v3021', spacode: '23', spaudio: '1', spdemuxer: '6',
    spdrm: '2', spdynamicrange: '7', spflv: '1', spflvaudio: '1',
    sphdrfps: '60', sphttps: '0',
    spvcode: 'MSgzMDoyMTYwLDYwOjIxNjB8MzA6MjE2MCw2MDoyMTYwKTsyKDMwOjIxNjAsNjA6MjE2MHwzMDoyMTYwLDYwOjIxNjAp',
    spvideo: '4', stream: '1', system: '1', sysver: 'ios18.2.1',
    uhd_flag: '4', cKey: ckey, guid,
    fntick: String(params.Timestamp),
    flowid: generateFlowid(),
    playbacktime: '0',
  });

  const resp = await fetch(`https://bkliveinfo.ysp.cctv.cn?${qp}`, {
    headers: { 'User-Agent': 'qqlive', 'Connection': 'Keep-Alive', 'Accept': 'application/json' },
  });
  if (!resp.ok) return null;
  const data = await resp.json();
  if (data.iretcode === 0 && data.playurl) return data.playurl;
  console.error('API error:', data.iretcode, data.errinfo);
  return null;
}

// -------------------- 获取并修正 M3U8 --------------------
async function fetchAndProxyM3u8(playUrl) {
  const resp = await fetch(playUrl);
  if (!resp.ok) return null;
  const text = await resp.text();
  const baseUrl = playUrl.slice(0, playUrl.lastIndexOf('/') + 1);
  return text.replace(/([\w\-.]+\.ts)/g, baseUrl + '$1');
}

// -------------------- 生成 M3U --------------------
function generateM3u(baseUrl) {
  const group = id => {
    if (id.startsWith('cctv') || id.startsWith('cgtn')) return '央视';
    if (id === 'cetv1' || id === 'gxpd') return '教育';
    return '卫视';
  };
  let m3u = '#EXTM3U\n';
  for (const id of Object.keys(CHANNELS)) {
    const name = NAMES[id] || id;
    m3u += `#EXTINF:-1 tvg-name="${name}" group-title="${group(id)}",${name}\n`;
    m3u += `${baseUrl}/live?id=${id}\n`;
  }
  return m3u;
}

// -------------------- HTTP 服务 --------------------
const server = http.createServer(async (req, res) => {
  const baseUrl = `https://${req.headers.host}`;
  const reqUrl = new URL(req.url, baseUrl);
  const path = reqUrl.pathname;

  try {
    // 健康检查（Render 需要）
    if (path === '/health') {
      res.writeHead(200); res.end('OK'); return;
    }

    // M3U 订阅
    if (path === '/m3u' || path === '/playlist.m3u') {
      const m3u = generateM3u(baseUrl);
      res.writeHead(200, { 'Content-Type': 'application/vnd.apple.mpegurl; charset=utf-8' });
      res.end(m3u); return;
    }

    // 单频道
    if (path === '/live') {
      const id = reqUrl.searchParams.get('id') || 'cctv1';
      const ch = CHANNELS[id];
      if (!ch) { res.writeHead(404); res.end('未知频道'); return; }

      const [cnlid, livepid, defn] = ch;
      const playUrl = await getPlayUrl(cnlid, livepid, defn);
      if (!playUrl) { res.writeHead(502); res.end('获取播放地址失败'); return; }

      const m3u8 = await fetchAndProxyM3u8(playUrl);
      if (!m3u8) { res.writeHead(502); res.end('获取M3U8失败'); return; }

      res.writeHead(200, { 'Content-Type': 'application/vnd.apple.mpegurl' });
      res.end(m3u8); return;
    }

    // 根路径说明
    if (path === '/' || path === '') {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`央视频 IPTV 服务\n\nM3U订阅: ${baseUrl}/m3u\n单频道:  ${baseUrl}/live?id=cctv1\n`);
      return;
    }

    res.writeHead(404); res.end('Not Found');
  } catch (e) {
    console.error(e);
    res.writeHead(500); res.end('内部错误');
  }
});

server.listen(PORT, () => {
  console.log(`央视频 IPTV 服务启动，端口 ${PORT}`);
});
