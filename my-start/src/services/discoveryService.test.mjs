import test from 'node:test';
import assert from 'node:assert/strict';
import { PlaceDiscoveryService, filterPlaces } from './discoveryService.ts';

test('PlaceDiscoveryService loads Phetchabun places', () => {
  const service = new PlaceDiscoveryService('phetchabun');
  const places = service.getPlaces();
  assert.ok(places.length > 50, `Expected >50 places, got ${places.length}`);

  // Coordinate integrity test
  for (const place of places) {
    assert.ok(
      place.coordinates.lat >= 15.0 && place.coordinates.lat <= 17.5,
      `Lat out of range for ${place.name}: ${place.coordinates.lat}`
    );
    assert.ok(
      place.coordinates.lng >= 100.0 && place.coordinates.lng <= 102.0,
      `Lng out of range for ${place.name}: ${place.coordinates.lng}`
    );
  }
});

test('filterPlaces by district', () => {
  const service = new PlaceDiscoveryService('phetchabun');
  const khaoKhoPlaces = service.getPlaces({ district: 'เขาค้อ' });
  assert.ok(khaoKhoPlaces.length > 0, 'Expected places in เขาค้อ');
  for (const place of khaoKhoPlaces) {
    assert.equal(place.district, 'เขาค้อ');
  }
});

test('filterPlaces by multi-district selection', () => {
  const service = new PlaceDiscoveryService('phetchabun');
  const places = service.getPlaces({ districts: ['เขาค้อ', 'หล่มเก่า'] });
  assert.ok(places.length > 0, 'Expected places in เขาค้อ or หล่มเก่า');
  for (const place of places) {
    assert.ok(
      place.district === 'เขาค้อ' || place.district === 'หล่มเก่า',
      `Unexpected district: ${place.district}`
    );
  }
  const hasKhaoKho = places.some((p) => p.district === 'เขาค้อ');
  const hasLomKao = places.some((p) => p.district === 'หล่มเก่า');
  assert.ok(hasKhaoKho && hasLomKao, 'Should contain places from both districts');
});

test('getDistrictCounts returns accurate place counts per district', () => {
  const service = new PlaceDiscoveryService('phetchabun');
  const counts = service.getDistrictCounts('phetchabun');
  assert.ok(counts.length >= 10, 'Expected at least 10 districts in Phetchabun');
  
  const allMeta = counts.find((c) => c.name === 'ทั้งหมด');
  assert.ok(allMeta && allMeta.count > 50, 'Total count should match total places');

  const khaoKhoMeta = counts.find((c) => c.name === 'เขาค้อ');
  assert.ok(khaoKhoMeta && khaoKhoMeta.count > 0, 'Khao Kho should have count > 0');
});

test('filterPlaces by minimum rating', () => {
  const service = new PlaceDiscoveryService('phetchabun');
  const topRated = service.getPlaces({ minRating: 4.8 });
  assert.ok(topRated.length > 0, 'Expected top rated places');
  for (const place of topRated) {
    assert.ok(place.rating >= 4.8, `Place ${place.name} has rating ${place.rating} < 4.8`);
  }
});

test('filterPlaces by category', () => {
  const service = new PlaceDiscoveryService('phetchabun');
  const mountainPlaces = service.getPlaces({ category: 'mountain_view' });
  assert.ok(mountainPlaces.length > 0, 'Expected mountain_view places');
  for (const place of mountainPlaces) {
    assert.equal(place.category, 'mountain_view');
  }
});

test('filterPlaces by keyword search', () => {
  const service = new PlaceDiscoveryService('phetchabun');
  const results = service.getPlaces({ searchKeyword: 'ผาซ่อนแก้ว' });
  assert.ok(results.length >= 1, 'Expected at least 1 result for ผาซ่อนแก้ว');
  const found = results.some(
    (p) => p.name.includes('ผาซ่อนแก้ว') || p.description.includes('ผาซ่อนแก้ว')
  );
  assert.ok(found, 'Should find place containing ผาซ่อนแก้ว');
});

test('getPlaceById works correctly', () => {
  const service = new PlaceDiscoveryService('phetchabun');
  const places = service.getPlaces();
  const first = places[0];
  const fetched = service.getPlaceById(first.id);
  assert.equal(fetched?.id, first.id);
  assert.equal(fetched?.name, first.name);
});

test('deep module test: accepts injected dataset for isolated testing', () => {
  const mockPlaces = [
    {
      id: 'mock-1',
      name: 'จุดชมวิวดอยจำลอง',
      provinceId: 'test_province',
      district: 'เมืองทดสอบ',
      category: 'mountain_view',
      categoryLabel: 'ยอดดอย',
      description: 'สถานที่ทดสอบหมอกสวยงาม',
      coordinates: { lat: 16.0, lng: 101.0 },
      rating: 4.8,
      isFeatured: true,
      imageUrl: 'https://example.com/img.jpg',
      highlights: ['ทะเลหมอก', 'พระอาทิตย์ขึ้น'],
    },
  ];

  const mockProvinces = [
    {
      id: 'test_province',
      nameTh: 'จังหวัดทดสอบ',
      nameEn: 'Test Province',
      center: { lat: 16.0, lng: 101.0 },
      zoom: 10,
      districts: ['ทั้งหมด', 'เมืองทดสอบ'],
      description: 'คำอธิบายสำหรับทดสอบ',
      coverImage: 'https://example.com/cover.jpg',
    },
  ];

  const testService = new PlaceDiscoveryService(
    'test_province',
    { test_province: mockPlaces },
    mockProvinces
  );

  const places = testService.getPlaces();
  assert.equal(places.length, 1);
  assert.equal(places[0].name, 'จุดชมวิวดอยจำลอง');
  assert.equal(testService.getDistricts('test_province').length, 2);
  assert.equal(testService.getActiveProvince().nameTh, 'จังหวัดทดสอบ');
});
