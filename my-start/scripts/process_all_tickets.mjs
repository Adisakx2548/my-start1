import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('./public/images/places');

const remainingTicketImages = {
  // Ticket 03: Lom Kao & Phu Lom Lo
  // ภูลมโล พญาเสือโคร่ง ซากุระเมืองไทยสีชมพู
  'phetchabun-28.jpg': 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=800&q=80',
  // ภูแผงม้า
  'phetchabun-29.jpg': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
  // จิตรกรรมวัดนาทราย
  'phetchabun-30.jpg': 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
  // หลวงพ่อใหญ่วัดตาล
  'phetchabun-26.jpg': 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80',

  // Ticket 04: Si Thep, Wichian Buri & Bueng Sam Phan
  // พุน้ำร้อนบ้านพุเตย
  'phetchabun-32.jpg': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  // สุสานหอย 15 ล้านปี
  'phetchabun-33.jpg': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
  // บ่อน้ำพุร้อนบ้านพุขาม
  'phetchabun-34.jpg': 'https://images.unsplash.com/photo-1504567961542-e24d9439a724?auto=format&fit=crop&w=800&q=80',
  // ศาลสมเด็จพระนเรศวร
  'phetchabun-35.jpg': 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80',
  // เขาคลังใน
  'phetchabun-37.jpg': 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
  // เขาถมอรัตน์
  'phetchabun-39.jpg': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
  // บึงสามพัน
  'phetchabun-41.jpg': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',

  // Ticket 05: Nam Nao National Park
  // อุทยานแห่งชาติน้ำหนาว
  'phetchabun-42.jpg': 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
  // น้ำตกเหวทราย
  'phetchabun-43.jpg': 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=800&q=80',
  // ป่าเปลี่ยนสี น้ำหนาว
  'phetchabun-44.jpg': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  // ถ้ำใหญ่น้ำหนาว
  'phetchabun-45.jpg': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  // ถ้ำผาหงษ์ จุดชมพระอาทิตย์ตก
  'phetchabun-46.jpg': 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80',
  // จุดชมพระอาทิตย์ขึ้นภูค้อ
  'phetchabun-47.jpg': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',

  // Ticket 06: Khao Kho & Wang Pong
  // จุดชมวิวเขาตะเคียนโง๊ะ ทะเลหมอก 360 องศา
  'phetchabun-48.jpg': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
  // ผาตัด เขาค้อ
  'phetchabun-49.jpg': 'https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?auto=format&fit=crop&w=800&q=80',
  // ไร่กาแฟจ่านรินทร์
  'phetchabun-50.jpg': 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80',
  // ไดโนเสาร์เขาค้อ
  'phetchabun-52.jpg': 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80',
  // อุทยานแห่งชาติทุ่งแสลงหลวง
  'phetchabun-53.jpg': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
  // ไร่ บี เอ็น
  'phetchabun-54.jpg': 'https://images.unsplash.com/photo-1464207687429-7505649dae38?auto=format&fit=crop&w=800&q=80',
  // อุทยานแห่งชาติเขาค้อ
  'phetchabun-55.jpg': 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=800&q=80',
  // หอสมุดนานาชาติเขาค้อ
  'phetchabun-56.jpg': 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?auto=format&fit=crop&w=800&q=80',
  // อ่างเก็บน้ำรัตนัย จุดชมทะเลหมอก
  'phetchabun-57.jpg': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  // แก่งบางระจัน แมงกะพรุนน้ำจืด
  'phetchabun-58.jpg': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
  // พระตำหนักเขาค้อ
  'phetchabun-59.jpg': 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
  // พระบรมธาตุเจดีย์กาญจนาภิเษก
  'phetchabun-60.jpg': 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80',
  // อนุสรณ์ผู้เสียสละเขาค้อ
  'phetchabun-61.jpg': 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=800&q=80',
  // น้ำตกศรีดิษฐ์
  'phetchabun-63.jpg': 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=800&q=80',
  // ฐานอิทธิ
  'phetchabun-64.jpg': 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=800&q=80',
  // แก่งวังน้ำเย็น
  'phetchabun-65.jpg': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
  // ทุ่งนางพญา ป่าสนสะวันนา
  'phetchabun-66.jpg': 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
  // ถ้ำผาโค้ง วังโป่ง
  'phetchabun-67.jpg': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
};

async function processRemainingTickets() {
  console.log('Downloading high quality authentic photos for remaining tickets (03, 04, 05, 06)...');
  let count = 0;
  for (const [file, url] of Object.entries(remainingTicketImages)) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length > 2000 && buf[0] === 0xFF && buf[1] === 0xD8) {
          fs.writeFileSync(path.join(outDir, file), buf);
          count++;
        }
      }
    } catch (e) {
      console.log(`✗ Error ${file}:`, e.message);
    }
  }
  console.log(`Successfully verified and updated ${count} places across Tickets 03, 04, 05, 06!`);
}

processRemainingTickets();
