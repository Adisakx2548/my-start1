import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const distinctMap = {
  11: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=85',
  28: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=1200&q=85',
  29: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
  30: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=85',
  31: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
  32: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
  35: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=85',
  38: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85',
  40: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=85',
  42: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85',
  43: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1200&q=85',
  44: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=1200&q=85',
  47: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=85',
  57: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=85',
  60: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=85',
  63: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=85',
  65: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=85',
  66: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1200&q=85',
  67: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85',
};

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error('Failed ' + res.status + ' for ' + url);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
}

async function run() {
  for (const [id, url] of Object.entries(distinctMap)) {
    const dest = path.join('public/images/places', 'phetchabun-' + id + '.jpg');
    process.stdout.write(`Downloading distinct image for place ${id}... `);
    await download(url, dest);
    console.log('OK');
  }

  console.log('\n--- Verifying zero hash collisions across all 67 files ---');
  const hashes = new Map();
  let collisions = 0;
  for (let i = 1; i <= 67; i++) {
    const file = path.join('public/images/places', 'phetchabun-' + i + '.jpg');
    if (fs.existsSync(file)) {
      const h = crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex');
      if (hashes.has(h)) {
        console.error(`COLLISION: phetchabun-${i} matches phetchabun-${hashes.get(h)}`);
        collisions++;
      } else {
        hashes.set(h, i);
      }
    } else {
      console.error(`MISSING: phetchabun-${i}.jpg`);
      collisions++;
    }
  }

  if (collisions === 0) {
    console.log('SUCCESS! ALL 67 PLACES HAVE 100% DISTINCT, UNIQUE IMAGES!');
  } else {
    console.log(`Failed with ${collisions} collisions.`);
  }
}

run().catch(console.error);
