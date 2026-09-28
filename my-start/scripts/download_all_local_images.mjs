import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('./public/images/places');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const phetchabunPath = path.resolve('./src/data/phetchabun.json');
const places = JSON.parse(fs.readFileSync(phetchabunPath, 'utf8'));

// High quality verified URLs for categories and landmarks
const masterFallbacks = {
  mountain_view: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Phu_Thap_Buek71.JPG',
  nature_park: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Nam_Nao.jpg',
  heritage_history: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%95%E0%B8%B3%E0%B8%AB%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%82%E0%B8%B2%E0%B8%84%E0%B9%89%E0%B8%AD_Khao_Kho_Palace_-_panoramio.jpg/800px-%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%95%E0%B8%B3%E0%B8%AB%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%82%E0%B8%B2%E0%B8%84%E0%B9%89%E0%B8%AD_Khao_Kho_Palace_-_panoramio.jpg',
  temple_culture: 'https://upload.wikimedia.org/wikipedia/commons/6/62/%E0%B8%9C%E0%B8%B2%E0%B8%8B%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A7.jpg',
  lifestyle_farm: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/RikaAW_picture.jpg/800px-RikaAW_picture.jpg',
  default: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Phu_Thap_Buek71.JPG'
};

// Map each place to best real image URLs
const specificUrls = {
  // ภูทับเบิก
  'phetchabun-27': ['https://upload.wikimedia.org/wikipedia/commons/7/7f/Phu_Thap_Buek71.JPG'],
  'phetchabun-31': ['https://upload.wikimedia.org/wikipedia/commons/7/7f/Phu_Thap_Buek71.JPG'],
  'phetchabun-29': ['https://upload.wikimedia.org/wikipedia/commons/7/7f/Phu_Thap_Buek71.JPG'],
  
  // วัดพระธาตุผาซ่อนแก้ว
  'phetchabun-62': ['https://upload.wikimedia.org/wikipedia/commons/6/62/%E0%B8%9C%E0%B8%B2%E0%B8%8B%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A7.jpg'],
  
  // พระพุทธมหาธรรมราชา / พุทธอุทยานเพชบุระ
  'phetchabun-10': ['https://commons.wikimedia.org/wiki/Special:FilePath/PhetMahaThamm1.jpg?width=800'],
  'phetchabun-7': ['https://commons.wikimedia.org/wiki/Special:FilePath/PhetMahaThamm1.jpg?width=800'],

  // อ่างเก็บน้ำห้วยป่าแดง
  'phetchabun-3': ['https://commons.wikimedia.org/wiki/Special:FilePath/PhetDaeng3.jpg?width=800'],
  'phetchabun-17': ['https://commons.wikimedia.org/wiki/Special:FilePath/PhetDaeng3.jpg?width=800'],

  // อุทยานแห่งชาติน้ำหนาว
  'phetchabun-42': ['https://upload.wikimedia.org/wikipedia/commons/3/3f/Nam_Nao.jpg'],
  'phetchabun-44': ['https://upload.wikimedia.org/wikipedia/commons/3/3f/Nam_Nao.jpg'],
  'phetchabun-43': ['https://upload.wikimedia.org/wikipedia/commons/3/3f/Nam_Nao.jpg'],

  // ทุ่งกังหันลม เขาค้อ
  'phetchabun-51': ['https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/RikaAW_picture.jpg/800px-RikaAW_picture.jpg'],
  'phetchabun-54': ['https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/RikaAW_picture.jpg/800px-RikaAW_picture.jpg'],

  // เขาค้อ / พระตำหนักเขาค้อ / พระบรมธาตุเจดีย์
  'phetchabun-55': ['https://upload.wikimedia.org/wikipedia/commons/a/ac/Kho_Mountain.jpg'],
  'phetchabun-48': ['https://upload.wikimedia.org/wikipedia/commons/a/ac/Kho_Mountain.jpg'],
  'phetchabun-57': ['https://upload.wikimedia.org/wikipedia/commons/a/ac/Kho_Mountain.jpg'],
  'phetchabun-59': ['https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%95%E0%B8%B3%E0%B8%AB%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%82%E0%B8%B2%E0%B8%84%E0%B9%89%E0%B8%AD_Khao_Kho_Palace_-_panoramio.jpg/800px-%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%95%E0%B8%B3%E0%B8%AB%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%82%E0%B8%B2%E0%B8%84%E0%B9%89%E0%B8%AD_Khao_Kho_Palace_-_panoramio.jpg'],

  // ศรีเทพ มรดกโลก
  'phetchabun-36': ['https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Prang_Si_Thep_02.jpg/800px-Prang_Si_Thep_02.jpg'],
  'phetchabun-37': ['https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Khao_Klang_Nai_%28Si_Thep_Historical_Park%29.jpg/800px-Khao_Klang_Nai_%28Si_Thep_Historical_Park%29.jpg'],
  'phetchabun-38': ['https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/%E0%B9%80%E0%B8%82%E0%B8%B2%E0%B8%84%E0%B8%A5%E0%B8%B1%E0%B8%87%E0%B8%99%E0%B8%AD%E0%B8%81_1_%E0%B8%AD%E0%B8%B8%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%99%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%A7%E0%B8%B1%E0%B8%95%E0%B8%B4%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C%E0%B8%A8%E0%B8%A3%E0%B8%B5%E0%B9%80%E0%B8%97%E0%B8%9E.jpg/800px-%E0%B9%80%E0%B8%82%E0%B8%B2%E0%B8%84%E0%B8%A5%E0%B8%B1%E0%B8%87%E0%B8%99%E0%B8%AD%E0%B8%81_1_%E0%B8%AD%E0%B8%B8%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%99%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%A7%E0%B8%B1%E0%B8%95%E0%B8%B4%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C%E0%B8%A8%E0%B8%A3%E0%B8%B5%E0%B9%80%E0%B8%97%E0%B8%9E.jpg'],
  'phetchabun-40': ['https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Khao_Klang_Nai_%28Si_Thep_Historical_Park%29.jpg/800px-Khao_Klang_Nai_%28Si_Thep_Historical_Park%29.jpg'],

  // น้ำตกตาดหมอก
  'phetchabun-5': ['https://upload.wikimedia.org/wikipedia/commons/d/d9/Thailand_099.jpg'],
  'phetchabun-11': ['https://upload.wikimedia.org/wikipedia/commons/d/d9/Thailand_099.jpg'],

  // อนุสาวรีย์พ่อขุนผาเมือง
  'phetchabun-24': ['https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Sri_Indraditya_%26_Pha_Mueang.jpg/800px-Sri_Indraditya_%26_Pha_Mueang.jpg'],
  'phetchabun-21': ['https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Sri_Indraditya_%26_Pha_Mueang.jpg/800px-Sri_Indraditya_%26_Pha_Mueang.jpg']
};

function isValidImageBuffer(buf) {
  if (!buf || buf.length < 1000) return false;
  // JPEG magic: FF D8
  const isJpeg = buf[0] === 0xFF && buf[1] === 0xD8;
  // PNG magic: 89 50 4E 47
  const isPng = buf[0] === 0x89 && buf[1] === 0x50;
  // WebP magic: RIFF ... WEBP
  const isWebp = buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46;
  return isJpeg || isPng || isWebp;
}

async function fetchBufferWithRetry(url) {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (isValidImageBuffer(buf)) {
      return buf;
    }
  } catch (err) {
    // ignore
  }
  return null;
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('Downloading category base images first...');
  const categoryBuffers = {};
  for (const [cat, url] of Object.entries(masterFallbacks)) {
    const buf = await fetchBufferWithRetry(url);
    if (buf) {
      categoryBuffers[cat] = buf;
      console.log(`✓ Master category buffer ready: ${cat} (${(buf.length / 1024).toFixed(1)} KB)`);
    } else {
      console.log(`✗ Failed to load master category: ${cat}`);
    }
    await sleep(200);
  }

  // Save default.jpg
  if (categoryBuffers['default']) {
    fs.writeFileSync(path.join(outDir, 'default.jpg'), categoryBuffers['default']);
    console.log('✓ Saved default.jpg');
  }

  console.log(`\nProcessing 67 places...`);
  let downloadedCount = 0;
  let fallbackCount = 0;

  for (let i = 0; i < places.length; i++) {
    const place = places[i];
    const targetFile = path.join(outDir, `${place.id}.jpg`);
    let finalBuf = null;

    // 1. Try specific URLs
    const specificList = specificUrls[place.id] || [];
    for (const url of specificList) {
      finalBuf = await fetchBufferWithRetry(url);
      if (finalBuf) {
        downloadedCount++;
        break;
      }
      await sleep(150);
    }

    // 2. If still null, try place.imageUrl if valid
    if (!finalBuf && place.imageUrl && place.imageUrl.startsWith('http')) {
      finalBuf = await fetchBufferWithRetry(place.imageUrl);
      if (finalBuf) {
        downloadedCount++;
      }
    }

    // 3. If still null, use category base buffer
    if (!finalBuf) {
      finalBuf = categoryBuffers[place.category] || categoryBuffers['default'];
      fallbackCount++;
    }

    // Save image
    fs.writeFileSync(targetFile, finalBuf);
    console.log(`[${i + 1}/${places.length}] Saved ${place.id}.jpg (${(finalBuf.length / 1024).toFixed(1)} KB) - ${place.name}`);
    await sleep(100);
  }

  // Update phetchabun.json to reference local images
  const updatedPlaces = places.map((place) => ({
    ...place,
    imageUrl: `/images/places/${place.id}.jpg`
  }));

  fs.writeFileSync(phetchabunPath, JSON.stringify(updatedPlaces, null, 2), 'utf8');
  console.log('\n🎉 ALL DONE!');
  console.log(`Downloaded ${downloadedCount} specific real images, ${fallbackCount} category-matched images.`);
  console.log('phetchabun.json successfully updated to use local static assets: /images/places/[id].jpg');
}

main();
