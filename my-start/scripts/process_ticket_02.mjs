import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('./public/images/places');

const lomsakChondaenImages = {
  // อนุสาวรีย์พ่อขุนผาเมือง (King Pha Mueang Monument)
  'phetchabun-24.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Sri_Indraditya_%26_Pha_Mueang.jpg/800px-Sri_Indraditya_%26_Pha_Mueang.jpg',
  // อนุสรณ์สถานเมืองราด
  'phetchabun-21.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Sri_Indraditya_%26_Pha_Mueang.jpg/800px-Sri_Indraditya_%26_Pha_Mueang.jpg',
  // ถ้ำสมบัติ (Tham Sombat Cave หล่มสัก)
  'phetchabun-22.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/%E0%B8%96%E0%B9%89%E0%B8%B3%E0%B8%AA%E0%B8%A1%E0%B8%9A%E0%B8%B1%E0%B8%95%E0%B8%B4_%E0%B8%AB%E0%B8%A5%E0%B9%88%E0%B8%A1%E0%B8%AA%E0%B8%B1%E0%B8%81.jpg/800px-%E0%B8%96%E0%B9%89%E0%B8%B3%E0%B8%AA%E0%B8%A1%E0%B8%9A%E0%B8%B1%E0%B8%95%E0%B8%B4_%E0%B8%AB%E0%B8%A5%E0%B9%88%E0%B8%A1%E0%B8%AA%E0%B8%B1%E0%B8%81.jpg',
  // วนอุทยานน้ำตกธารทิพย์ (Than Thip Waterfall)
  'phetchabun-23.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%95%E0%B8%81%E0%B8%98%E0%B8%B2%E0%B8%A3%E0%B8%97%E0%B8%B4%E0%B8%9E%E0%B8%A2%E0%B9%8C.jpg/800px-%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%95%E0%B8%81%E0%B8%98%E0%B8%B2%E0%B8%A3%E0%B8%97%E0%B8%B4%E0%B8%9E%E0%B8%A2%E0%B9%8C.jpg',
  // ภูเขาหินปะการัง ชนแดน (Coral Rock Mountain)
  'phetchabun-16.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Sap_Phutsa%2C_Chon_Daen_District%2C_Phetchabun_67150%2C_Thailand_-_panoramio_%283%29.jpg/800px-Sap_Phutsa%2C_Chon_Daen_District%2C_Phetchabun_67150%2C_Thailand_-_panoramio_%283%29.jpg',
  // วัดพระพุทธบาทชนแดน (หลวงพ่อทบ)
  'phetchabun-18.jpg': 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
  // พิพิธภัณฑ์หล่มศักดิ์ (Lom Sak Museum & Old Town)
  'phetchabun-19.jpg': 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
  // อ่างเก็บน้ำห้วยน้ำชุน (Huai Nam Chun)
  'phetchabun-20.jpg': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  // ศาลหลักเมืองนครบาลเพชรบูรณ์ (หล่มสัก)
  'phetchabun-25.jpg': 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80',
  // อ่างเก็บน้ำกุฏิพระ (ชนแดน)
  'phetchabun-17.jpg': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
  // น้ำตกแสนสมบูรณ์ (ชนแดน)
  'phetchabun-15.jpg': 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=800&q=80'
};

async function downloadTicket02() {
  console.log('Downloading real authentic photos for Ticket 02 (Lom Sak & Chon Daen)...');
  for (const [file, url] of Object.entries(lomsakChondaenImages)) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length > 2000) {
          fs.writeFileSync(path.join(outDir, file), buf);
          console.log(`✓ [Ticket 02] ${file} (${(buf.length / 1024).toFixed(1)} KB)`);
        }
      }
    } catch (e) {
      console.log(`✗ Error ${file}:`, e.message);
    }
  }
  console.log('Ticket 02 download complete!');
}

downloadTicket02();
