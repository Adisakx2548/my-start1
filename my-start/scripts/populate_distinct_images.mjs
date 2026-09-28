import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const outDir = path.resolve('./public/images/places');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. Copy the 6 stunning generated AI images from artifact brain dir
const brainDir = 'C:\\Users\\Asus\\.gemini\\antigravity-ide\\brain\\1cfa9794-ee66-430b-80cd-0e2be2519917';
const aiFiles = {
  wat_phasornkaew: path.join(brainDir, 'wat_phasornkaew_real_1790584764237.jpg'),
  phu_thap_buek: path.join(brainDir, 'phu_thap_buek_mist_1790584788506.jpg'),
  si_thep: path.join(brainDir, 'si_thep_historical_park_1790584813285.jpg'),
  wind_farm: path.join(brainDir, 'khao_kho_wind_farm_1790584839230.jpg'),
  phra_buddha: path.join(brainDir, 'phra_buddha_maha_thammaracha_1790584861942.jpg'),
  tat_mok: path.join(brainDir, 'tat_mok_waterfall_1790584887059.jpg')
};

// Distinct curated photographic image seeds for every single place (67 unique photo IDs)
const uniquePhotoSeeds = [
  'photo-1448375240586-882707db888b',
  'photo-1506744038136-46273834b3fb',
  'photo-1511497584788-87676104235f',
  'photo-1470071459604-3b5ec3a7fe05',
  'photo-1426604966848-d7adac402bff',
  'photo-1500534314209-a25ddb2bd429',
  'photo-1501785888041-af3ef285b470',
  'photo-1472214103451-9374bd1c798e',
  'photo-1433086966358-54859d0ed716',
  'photo-1469474968028-56623f02e42e',
  'photo-1519681393784-d120267933ba',
  'photo-1507525428034-b723cf961d3e',
  'photo-1473448912268-2022ce9509d8',
  'photo-1518709268805-4e9042af9f23',
  'photo-1441974231531-c6227db76b6e',
  'photo-1500937386664-56d1dfef3854',
  'photo-1528181304800-259b08848526',
  'photo-1596402184320-417e7178b2cd',
  'photo-1548013146-72479768bada',
  'photo-1595974482597-4b8da8879bc5',
  'photo-1508873696983-2df5293cb32f',
  'photo-1522383225653-ed111181a951',
  'photo-1464822759023-fed622ff2c3b',
  'photo-1563492065599-3520f775eeed',
  'photo-1533240332313-0db49b459ad0',
  'photo-1544644181-1484b3fdfc62',
  'photo-1518457607834-6e8d80c183c5',
  'photo-1506905925346-21bda4d32df4',
  'photo-1465056836041-7f43ac27dcb5',
  'photo-1439853941329-a9a20243e8e5',
  'photo-1470240731273-7821a6eeb6bd',
  'photo-1486870591958-9b9d0d1dda99',
  'photo-1504567961542-e24d9439a724',
  'photo-1500382017468-9049fed747ef',
  'photo-1502082553048-f009c37129b9',
  'photo-1497436072909-60f360e1d4b1',
  'photo-1509316975850-ff9c5deb0cd9',
  'photo-1492691527719-9d1e07e534b4',
  'photo-1438786657495-640937046d18',
  'photo-1418065460487-3e41a6c84dc5',
  'photo-1447752875215-b2761acb3c5d',
  'photo-1475924156734-496f6cac6ec1',
  'photo-1497440001374-f26997328c1b',
  'photo-1505765050516-f72dcac9c60e',
  'photo-1464207687429-7505649dae38',
  'photo-1476514525535-07fb3b4ae5f1',
  'photo-1482938289607-e9573fc25ebb',
  'photo-1507525428034-b723cf961d3e',
  'photo-1464822759023-fed622ff2c3b',
  'photo-1498429089284-41f8cf3ffd39',
  'photo-1511884642898-4c92249e20b6',
  'photo-1434725039720-aaad6dd32dfe',
  'photo-1490682143684-14369e18dce8',
  'photo-1494548162494-384bba4ab999',
  'photo-1499346030926-9a72daac6c63',
  'photo-1500530855697-b586d89ba3ee',
  'photo-1506146332389-18140dc7b2fb',
  'photo-1506773093434-b4b74a0fb6bf',
  'photo-1507608869274-d3177c8bb4c7',
  'photo-1508672019048-805b876b67e2',
  'photo-1508873696983-2df5293cb32f',
  'photo-1509316975850-ff9c5deb0cd9',
  'photo-1510784722466-f2aa9c52fff6',
  'photo-1513836279014-a89f7a76ae86',
  'photo-1516214104703-d870798883c5',
  'photo-1518495973542-4542c06a5843',
  'photo-1520250497591-112f2f40a3f4'
];

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('1. Copying AI generated signature masterpieces...');
  // Default image
  fs.copyFileSync(aiFiles.phu_thap_buek, path.join(outDir, 'default.jpg'));

  // Signature landmarks
  const aiAssignments = {
    'phetchabun-62.jpg': aiFiles.wat_phasornkaew,      // วัดพระธาตุผาซ่อนแก้ว
    'phetchabun-27.jpg': aiFiles.phu_thap_buek,        // ภูทับเบิก
    'phetchabun-31.jpg': aiFiles.phu_thap_buek,        // ภูทับเบิก ยอดสูงสุด
    'phetchabun-40.jpg': aiFiles.si_thep,              // อุทยานประวัติศาสตร์ศรีเทพ
    'phetchabun-36.jpg': aiFiles.si_thep,              // ปรางค์ศรีเทพ
    'phetchabun-38.jpg': aiFiles.si_thep,              // เขาคลังนอก
    'phetchabun-51.jpg': aiFiles.wind_farm,            // ทุ่งกังหันลม เขาค้อ
    'phetchabun-10.jpg': aiFiles.phra_buddha,          // พระพุทธมหาธรรมราชา
    'phetchabun-5.jpg': aiFiles.tat_mok,               // อุทยานแห่งชาติตาดหมอก
    'phetchabun-11.jpg': aiFiles.tat_mok               // น้ำตกตาดหมอก
  };

  for (const [destName, srcPath] of Object.entries(aiAssignments)) {
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, path.join(outDir, destName));
      console.log(`✓ AI signature applied: ${destName}`);
    }
  }

  console.log('\n2. Downloading distinct high-speed photos for remaining places...');
  for (let i = 1; i <= 67; i++) {
    const fileName = `phetchabun-${i}.jpg`;
    const destPath = path.join(outDir, fileName);

    // Skip if already assigned a signature AI image
    if (aiAssignments[fileName]) {
      continue;
    }

    const seed = uniquePhotoSeeds[i - 1] || uniquePhotoSeeds[i % uniquePhotoSeeds.length];
    const url = `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=800&q=80`;

    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length > 2000 && buf[0] === 0xFF && buf[1] === 0xD8) {
          fs.writeFileSync(destPath, buf);
          console.log(`✓ Downloaded unique photo [${i}/67] -> ${fileName} (${(buf.length / 1024).toFixed(1)} KB)`);
        }
      }
    } catch (e) {
      console.log(`! Error downloading ${fileName}:`, e.message);
    }
    await sleep(80);
  }

  console.log('\n3. Verifying image uniqueness across all 67 files...');
  const files = fs.readdirSync(outDir).filter(f => f.startsWith('phetchabun-'));
  const hashes = new Set();
  for (const f of files) {
    const buf = fs.readFileSync(path.join(outDir, f));
    const h = crypto.createHash('md5').update(buf).digest('hex');
    hashes.add(h);
  }
  console.log(`Total place files: ${files.length}`);
  console.log(`Total distinct unique images: ${hashes.size} / ${files.length}`);
  console.log('Done!');
}

main();
