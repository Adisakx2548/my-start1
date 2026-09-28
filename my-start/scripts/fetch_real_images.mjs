import fs from 'node:fs';
import path from 'node:path';

const phetchabunPath = path.resolve('./src/data/phetchabun.json');
const places = JSON.parse(fs.readFileSync(phetchabunPath, 'utf8'));

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Map custom search queries for places that have specific known names on Wikipedia/Wikimedia
const customQueries = {
  'phetchabun-1': 'น้ำตกธาราเอราวัณ เพชรบูรณ์',
  'phetchabun-2': 'หอวัฒนธรรมนครบาลเพชรบูรณ์',
  'phetchabun-3': 'อ่างเก็บน้ำห้วยป่าแดง',
  'phetchabun-4': 'หนองนารี เพชรบูรณ์',
  'phetchabun-5': 'อุทยานแห่งชาติตาดหมอก',
  'phetchabun-6': 'วัดพระแก้ว เพชรบูรณ์',
  'phetchabun-7': 'วัดไตรภูมิ เพชรบูรณ์',
  'phetchabun-8': 'ไร่กำนันจุล',
  'phetchabun-9': 'วัดมหาธาตุ เพชรบูรณ์',
  'phetchabun-10': 'พระพุทธมหาธรรมราชาเฉลิมพระเกียรติ',
  'phetchabun-11': 'อุทยานแห่งชาติตาดหมอก',
  'phetchabun-12': 'วัดช้างเผือก เพชรบูรณ์',
  'phetchabun-13': 'ศาลหลักเมืองเพชรบูรณ์',
  'phetchabun-14': 'น้ำตกวังหินหอ',
  'phetchabun-15': 'น้ำตกแสนสมบูรณ์',
  'phetchabun-16': 'ภูเขาหินปะการัง เพชรบูรณ์',
  'phetchabun-17': 'ชนแดน เพชรบูรณ์',
  'phetchabun-18': 'วัดพระพุทธบาทชนแดน',
  'phetchabun-19': 'พิพิธภัณฑ์หล่มศักดิ์',
  'phetchabun-20': 'อ่างเก็บน้ำห้วยน้ำชุน',
  'phetchabun-21': 'อนุสรณ์สถานเมืองราด',
  'phetchabun-22': 'ถ้ำสมบัติ หล่มสัก',
  'phetchabun-23': 'น้ำตกธารทิพย์ หล่มสัก',
  'phetchabun-24': 'อนุสาวรีย์พ่อขุนผาเมือง',
  'phetchabun-25': 'ศาลหลักเมืองนครบาลเพชรบูรณ์',
  'phetchabun-26': 'วัดตาล หล่มเก่า',
  'phetchabun-27': 'ภูทับเบิก',
  'phetchabun-28': 'ภูลมโล',
  'phetchabun-29': 'ภูแผงม้า',
  'phetchabun-30': 'วัดศรีมงคล หล่มเก่า',
  'phetchabun-31': 'ภูทับเบิก',
  'phetchabun-32': 'บ่อน้ำพุร้อนบ้านพุเตย',
  'phetchabun-33': 'สุสานหอย วิเชียรบุรี',
  'phetchabun-34': 'บ่อน้ำพุร้อนบ้านพุขาม',
  'phetchabun-35': 'ศาลสมเด็จพระนเรศวร วิเชียรบุรี',
  'phetchabun-36': 'ปรางค์ศรีเทพ',
  'phetchabun-37': 'เขาคลังใน',
  'phetchabun-38': 'เขาคลังนอก',
  'phetchabun-39': 'เขาถมอรัตน์',
  'phetchabun-40': 'อุทยานประวัติศาสตร์ศรีเทพ',
  'phetchabun-41': 'บึงสามพัน',
  'phetchabun-42': 'อุทยานแห่งชาติน้ำหนาว',
  'phetchabun-43': 'น้ำตกเหวทราย น้ำหนาว',
  'phetchabun-44': 'ป่าเปลี่ยนสี น้ำหนาว',
  'phetchabun-45': 'ถ้ำใหญ่น้ำหนาว',
  'phetchabun-46': 'ถ้ำผาหงษ์ น้ำหนาว',
  'phetchabun-47': 'ภูค้อ น้ำหนาว',
  'phetchabun-48': 'จุดชมวิวเขาตะเคียนโง๊ะ',
  'phetchabun-49': 'ผาตัด เขาค้อ',
  'phetchabun-50': 'ไร่กาแฟ เขาค้อ',
  'phetchabun-51': 'ทุ่งกังหันลม เขาค้อ',
  'phetchabun-52': 'ไดโนเสาร์ เขาค้อ',
  'phetchabun-53': 'อุทยานแห่งชาติทุ่งแสลงหลวง',
  'phetchabun-54': 'ไร่ บี เอ็น',
  'phetchabun-55': 'อุทยานแห่งชาติเขาค้อ',
  'phetchabun-56': 'หอสมุดนานาชาติเขาค้อ',
  'phetchabun-57': 'อ่างเก็บน้ำรัตนัย เขาค้อ',
  'phetchabun-58': 'แก่งบางระจัน เขาค้อ',
  'phetchabun-59': 'พระตำหนักเขาค้อ',
  'phetchabun-60': 'พระบรมธาตุเจดีย์กาญจนาภิเษก เขาค้อ',
  'phetchabun-61': 'อนุสรณ์ผู้เสียสละเขาค้อ',
  'phetchabun-62': 'วัดพระธาตุผาซ่อนแก้ว',
  'phetchabun-63': 'น้ำตกศรีดิษฐ์',
  'phetchabun-64': 'ฐานอิทธิ เขาค้อ',
  'phetchabun-65': 'แก่งวังน้ำเย็น',
  'phetchabun-66': 'ทุ่งนางพญา ทุ่งแสลงหลวง',
  'phetchabun-67': 'ถ้ำผาโค้ง วังโป่ง'
};

async function fetchWikipediaImage(title) {
  try {
    const url = `https://th.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&pithumbsize=1000&format=json&redirects=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'TravelDiscoveryPhetchabunBot/1.0 (travel@my-start.local)' }
    });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data.query?.pages;
    if (pages) {
      for (const key of Object.keys(pages)) {
        if (key !== '-1' && pages[key]?.thumbnail?.source) {
          return pages[key].thumbnail.source;
        }
      }
    }
  } catch (err) {
    // ignore
  }
  return null;
}

async function fetchCommonsImage(keyword) {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(keyword)}&gsrnamespace=6&prop=imageinfo&iiprop=url&iiurlwidth=1000&format=json`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'TravelDiscoveryPhetchabunBot/1.0 (travel@my-start.local)' }
    });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data.query?.pages;
    if (pages) {
      for (const page of Object.values(pages)) {
        const title = page.title?.toLowerCase() || '';
        // Skip audio, pdf, icons, maps, svg
        if (title.endsWith('.ogg') || title.endsWith('.pdf') || title.endsWith('.svg') || title.includes('map')) continue;
        const img = page.imageinfo?.[0]?.thumburl || page.imageinfo?.[0]?.url;
        if (img) return img;
      }
    }
  } catch (err) {
    // ignore
  }
  return null;
}

async function main() {
  console.log(`Starting real image search for ${places.length} places...`);
  const results = {};

  for (let i = 0; i < places.length; i++) {
    const p = places[i];
    const customQ = customQueries[p.id] || p.name;
    let img = null;

    // Try Wikipedia direct title first
    const cleanName = p.name.split('(')[0].split(' หรือ ')[0].trim();
    img = await fetchWikipediaImage(cleanName);
    await sleep(400);

    // Try custom query on Wikipedia
    if (!img && customQ !== cleanName) {
      img = await fetchWikipediaImage(customQ);
      await sleep(400);
    }

    // Try Commons search
    if (!img) {
      img = await fetchCommonsImage(customQ);
      await sleep(400);
    }

    // Try Commons clean name
    if (!img && customQ !== cleanName) {
      img = await fetchCommonsImage(cleanName);
      await sleep(400);
    }

    results[p.id] = {
      name: p.name,
      district: p.district,
      imgUrl: img,
      found: !!img
    };
    console.log(`[${i + 1}/${places.length}] ${p.name} -> ${img ? 'FOUND' : 'MISSING'}`);
  }

  fs.writeFileSync('./scripts/image_results.json', JSON.stringify(results, null, 2));
  console.log('Results saved to ./scripts/image_results.json');
}

main();
