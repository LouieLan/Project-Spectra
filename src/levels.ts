import { LevelData } from './types';

export const LEVELS: LevelData[] = [
  // ==========================================
  // LEVEL 1: CAHAYA TUNGGAL (THE ORIGIN)
  // Konsep: Pengenalan kontrol pergerakan & lompatan dasar yang bersih.
  // Karakter: Putih (Chr_Putih).
  // Arsitektur: 1 Lantai dasar mulus tanpa rintangan.
  // ==========================================
  {
    id: 1,
    name: 'Level_1',
    title: 'Cahaya Tunggal',
    stageLabel: 'LEVEL 1',
    width: 1200,
    height: 720,
    playerStart: { x: 90, y: 570 },
    platforms: [
      { x: 0, y: 620, width: 1200, height: 100 },
    ],
    portals: [],
    spikes: [],
    items: [
      { id: 'l1_itm_white1', x: 340, y: 580, width: 22, height: 22, warnaDibutuhkan: 'white', collected: false },
      { id: 'l1_itm_white2', x: 620, y: 580, width: 22, height: 22, warnaDibutuhkan: 'white', collected: false },
      { id: 'l1_itm_white3', x: 900, y: 580, width: 22, height: 22, warnaDibutuhkan: 'white', collected: false },
    ],
    finishZone: { x: 1060, y: 492, width: 96, height: 128 },
  },

  // ==========================================
  // LEVEL 2: DINDING PEMISAH (ARCH OVERPASS)
  // Konsep: Pengenalan dasar portal pemisah & jembatan lengkung atas.
  // Murni berfokus pada mekanisme pemisahan, kembali menembus portal, dan jembatan penyeberangan.
  // Tanpa duri atau hurdle buatan agar pemain memahami logika dasar portal dengan santai.
  // ==========================================
  {
    id: 2,
    name: 'Level_2',
    title: 'Dinding Pemisah',
    stageLabel: 'LEVEL 2',
    width: 1250,
    height: 720,
    playerStart: { x: 80, y: 570 },
    platforms: [
      // Lantai dasar solid
      { x: 0, y: 620, width: 1250, height: 100 },
      // Tangga naik kiri
      { x: 230, y: 560, width: 70, height: 16 },
      // Jembatan lengkung atas melompati Portal -R (clearance 64px di atas portal)
      { x: 330, y: 484, width: 220, height: 16 },
      // Tangga turun kanan
      { x: 580, y: 550, width: 70, height: 16 },
    ],
    portals: [
      { id: 'l2_p_red', type: 'red', x: 420, y: 548, width: 36, height: 72, label: '-R' },
    ],
    items: [
      { id: 'l2_itm_red', x: 120, y: 580, width: 20, height: 20, warnaDibutuhkan: 'red', collected: false },
      { id: 'l2_itm_cyan', x: 820, y: 580, width: 20, height: 20, warnaDibutuhkan: 'cyan', collected: false },
    ],
    spikes: [],
    finishZone: { x: 1080, y: 492, width: 96, height: 128 },
  },

  // ==========================================
  // LEVEL 3: SINKRONISASI JURANG (THE SPIKE GAP)
  // Konsep: Jurang duri nyata di antara bilik dan penahan hurdle untuk desinkronisasi.
  // Hijau tertahan di hurdle kiri sementara Magenta melompati jurang duri bolak-balik.
  // ==========================================
  {
    id: 3,
    name: 'Level_3',
    title: 'Sinkronisasi Jurang',
    stageLabel: 'LEVEL 3',
    width: 1300,
    height: 720,
    playerStart: { x: 80, y: 570 },
    platforms: [
      // Lantai Kiri
      { x: 0, y: 620, width: 580, height: 100 },
      // Hurdle penahan di bilik kiri
      { x: 150, y: 565, width: 18, height: 55, isHurdle: true },
      // Tangga & Jembatan bypass atas Portal -G
      { x: 230, y: 568, width: 60, height: 16 },
      { x: 300, y: 504, width: 160, height: 16 },

      // Batu Pijakan di tengah jurang duri
      { x: 625, y: 570, width: 70, height: 16 },

      // Lantai Kanan
      { x: 740, y: 620, width: 560, height: 100 },
    ],
    portals: [
      { id: 'l3_p_green', type: 'green', x: 360, y: 548, width: 36, height: 72, label: '-G' },
    ],
    items: [
      { id: 'l3_itm_green', x: 80, y: 580, width: 20, height: 20, warnaDibutuhkan: 'green', collected: false },
      { id: 'l3_itm_magenta', x: 960, y: 580, width: 20, height: 20, warnaDibutuhkan: 'magenta', collected: false },
    ],
    spikes: [
      // Duri di dasar jurang
      { x: 585, y: 608, width: 150, height: 12 },
    ],
    finishZone: { x: 1140, y: 492, width: 96, height: 128 },
  },

  // ==========================================
  // LEVEL 4: RESONANSI BIRU & KUNING (DUAL-ELEVATION BALCONY)
  // Konsep: Arsitektur dua tingkat vertikal (Balkon Atas vs Terowongan Bawah).
  // Biru melintasi Balkon Atas, sementara Kuning melintasi Terowongan Bawah.
  // ==========================================
  {
    id: 4,
    name: 'Level_4',
    title: 'Resonansi Biru & Kuning',
    stageLabel: 'LEVEL 4',
    width: 1360,
    height: 720,
    playerStart: { x: 80, y: 570 },
    platforms: [
      // Lantai Dasar Bawah Solid
      { x: 0, y: 620, width: 1360, height: 100 },

      // Tangga ganda naik ke Balkon Atas
      { x: 170, y: 568, width: 60, height: 16 },
      { x: 250, y: 524, width: 60, height: 16 },

      // Balkon Atas Panjang (ketinggian 480, headroom bawah 124px)
      { x: 330, y: 480, width: 680, height: 16 },

      // Hurdle penahan di Balkon Atas (menahan Biru saat Kuning melompati duri bawah)
      { x: 580, y: 425, width: 18, height: 55, isHurdle: true },

      // Tangga turun di ujung kanan Balkon
      { x: 1040, y: 550, width: 60, height: 16 },
    ],
    portals: [
      { id: 'l4_p_blue', type: 'blue', x: 360, y: 548, width: 36, height: 72, label: '-B' },
    ],
    items: [
      { id: 'l4_itm_yellow', x: 640, y: 580, width: 20, height: 20, warnaDibutuhkan: 'yellow', collected: false },
      { id: 'l4_itm_blue', x: 780, y: 440, width: 20, height: 20, warnaDibutuhkan: 'blue', collected: false },
      { id: 'l4_itm_white', x: 1160, y: 580, width: 20, height: 20, warnaDibutuhkan: 'white', collected: false },
    ],
    spikes: [
      // Duri di lantai dasar bawah (dilompati oleh Kuning)
      { x: 740, y: 608, width: 44, height: 12 },
    ],
    finishZone: { x: 1230, y: 492, width: 96, height: 128 },
  },

  // ==========================================
  // LEVEL 5: PERMEABILITAS SPEKTRAL (THE GHOST PASS)
  // Konsep: Dua Portal Berjejer (-B dan -R). Warna sekunder menembus portal tanpa komponennya.
  // - White masuk -B -> Biru (Bilik 1), Kuning (Bilik 2).
  // - Kuning masuk -R -> Merah (Bilik 2), Hijau (Bilik 3).
  // - Merah tidak punya Biru -> Bebas menembus Portal -B ke kiri menemui Biru -> MAGENTA!
  // - Magenta melompat ke pedestal mengambil Item Magenta!
  // - Magenta dan Hijau menyatu jadi PUTIH!
  // ==========================================
  {
    id: 5,
    name: 'Level_5',
    title: 'Permeabilitas Spektral',
    stageLabel: 'LEVEL 5',
    width: 1360,
    height: 720,
    playerStart: { x: 80, y: 570 },
    platforms: [
      { x: 0, y: 620, width: 1360, height: 100 },
      // Pedestal Magenta di Bilik 1
      { x: 100, y: 530, width: 90, height: 16 },
      // Tangga step 1
      { x: 230, y: 568, width: 60, height: 16 },
      // Jembatan bypass atas Portal -B (headroom 116px)
      { x: 310, y: 504, width: 160, height: 16 },
      // Hurdle penahan di Bilik 2 (ruang lega 110px setelah portal)
      { x: 570, y: 565, width: 18, height: 55, isHurdle: true },
      // Tangga step 2
      { x: 660, y: 568, width: 60, height: 16 },
      // Jembatan bypass atas Portal -R
      { x: 740, y: 504, width: 160, height: 16 },
    ],
    portals: [
      { id: 'l5_p_blue', type: 'blue', x: 390, y: 548, width: 36, height: 72, label: '-B' },
      { id: 'l5_p_red', type: 'red', x: 820, y: 548, width: 36, height: 72, label: '-R' },
    ],
    items: [
      { id: 'l5_itm_blue', x: 60, y: 580, width: 20, height: 20, warnaDibutuhkan: 'blue', collected: false },
      { id: 'l5_itm_magenta', x: 135, y: 490, width: 20, height: 20, warnaDibutuhkan: 'magenta', collected: false },
      { id: 'l5_itm_red', x: 500, y: 580, width: 20, height: 20, warnaDibutuhkan: 'red', collected: false },
      { id: 'l5_itm_green', x: 980, y: 580, width: 20, height: 20, warnaDibutuhkan: 'green', collected: false },
    ],
    spikes: [],
    finishZone: { x: 1220, y: 492, width: 96, height: 128 },
  },

  // ==========================================
  // LEVEL 6: DUA TINGKAT ASIMETRIS (STEPPING ISLANDS)
  // Konsep: Rel atas terbagi menjadi 3 pulau apung berjarak, lantai bawah bergelombang.
  // - White masuk Portal -G -> Hijau (lantai bawah), Magenta (rel atas).
  // - Magenta melompati pulau apung di atas, sementara Hijau melompati duri di bawah.
  // - Menggunakan jeda hurdle untuk menyinkronkan pendaratan.
  // ==========================================
  {
    id: 6,
    name: 'Level_6',
    title: 'Dua Tingkat Asimetris',
    stageLabel: 'LEVEL 6',
    width: 1360,
    height: 720,
    playerStart: { x: 80, y: 570 },
    platforms: [
      { x: 0, y: 620, width: 1360, height: 100 },
      // Hurdle penahan di bilik awal lantai bawah
      { x: 140, y: 565, width: 18, height: 55, isHurdle: true },
      // Step naik ke Pulau 1
      { x: 230, y: 565, width: 60, height: 16 },

      // Tiga Pulau Apung Atas (Stepping Islands)
      // Pulau 1 (Melintasi di atas Portal -G pada x=360)
      { x: 310, y: 490, width: 170, height: 16 },
      // Hurdle penahan di lantai bawah
      { x: 520, y: 565, width: 18, height: 55, isHurdle: true },
      // Pulau 2 (Tengah)
      { x: 540, y: 470, width: 180, height: 16 },
      // Hurdle penahan di Pulau 2 atas
      { x: 630, y: 415, width: 18, height: 55, isHurdle: true },
      // Pulau 3 (Kanan)
      { x: 780, y: 490, width: 170, height: 16 },

      // Tangga turun kanan
      { x: 1010, y: 555, width: 60, height: 16 },
    ],
    portals: [
      { id: 'l6_p_green', type: 'green', x: 360, y: 548, width: 36, height: 72, label: '-G' },
    ],
    items: [
      { id: 'l6_itm_green', x: 420, y: 580, width: 20, height: 20, warnaDibutuhkan: 'green', collected: false },
      { id: 'l6_itm_magenta', x: 590, y: 430, width: 20, height: 20, warnaDibutuhkan: 'magenta', collected: false },
      { id: 'l6_itm_white', x: 1140, y: 580, width: 20, height: 20, warnaDibutuhkan: 'white', collected: false },
    ],
    spikes: [
      { x: 750, y: 608, width: 44, height: 12 },
    ],
    finishZone: { x: 1220, y: 492, width: 96, height: 128 },
  },

  // ==========================================
  // LEVEL 7: MENARA TIGA SPEKTRA (THE VERTICAL SPIRE)
  // Konsep: Pemanjatan vertikal menara puncak (y=370) dengan formasi pilar gantung.
  // - Portal -R di bawah memisahkan Merah (dasar) dan Cyan (naik).
  // - Portal -B di mezanin memisahkan Biru (tengah) dan Hijau (puncak spire).
  // - Hijau turun menjemput Merah menjadi Kuning, lalu menyatu dengan Biru jadi Putih!
  // ==========================================
  {
    id: 7,
    name: 'Level_7',
    title: 'Menara Tiga Spektra',
    stageLabel: 'LEVEL 7',
    width: 1380,
    height: 720,
    playerStart: { x: 80, y: 570 },
    platforms: [
      // Lantai dasar
      { x: 0, y: 620, width: 1380, height: 100 },
      // Hurdle dasar
      { x: 140, y: 565, width: 18, height: 55, isHurdle: true },
      // Tangga step ke Mezanin 1
      { x: 230, y: 565, width: 60, height: 16 },

      // Mezanin 1 (Bilik Biru, melintasi di atas Portal -R pada x=360)
      { x: 310, y: 510, width: 230, height: 16 },
      // Hurdle di Mezanin 1
      { x: 450, y: 455, width: 18, height: 55, isHurdle: true },

      // Pilar Pemanjatan Spire (melintasi di atas Portal -B pada x=640)
      { x: 580, y: 440, width: 160, height: 16 },
      { x: 780, y: 370, width: 180, height: 16 }, // Puncak Spire
      // Tangga turun kanan dari Spire
      { x: 1000, y: 440, width: 70, height: 16 },
      { x: 1100, y: 530, width: 70, height: 16 },
    ],
    portals: [
      { id: 'l7_p_red', type: 'red', x: 360, y: 548, width: 36, height: 72, label: '-R' },
      { id: 'l7_p_blue', type: 'blue', x: 640, y: 548, width: 36, height: 72, label: '-B' },
    ],
    items: [
      { id: 'l7_itm_red', x: 90, y: 580, width: 20, height: 20, warnaDibutuhkan: 'red', collected: false },
      { id: 'l7_itm_blue', x: 480, y: 580, width: 20, height: 20, warnaDibutuhkan: 'blue', collected: false },
      { id: 'l7_itm_green', x: 860, y: 330, width: 20, height: 20, warnaDibutuhkan: 'green', collected: false },
      { id: 'l7_itm_yellow', x: 1050, y: 580, width: 20, height: 20, warnaDibutuhkan: 'yellow', collected: false },
    ],
    spikes: [
      { x: 880, y: 608, width: 44, height: 12 },
    ],
    finishZone: { x: 1240, y: 492, width: 96, height: 128 },
  },

  // ==========================================
  // LEVEL 8: ALKIMIA CYAN & JURANG KEMBAR (THE DUAL CHASM SKYBRIDGE)
  // Konsep: Jurang duri di tengah membelah dunia; Jembatan langit gantung di atasnya.
  // - Penguraian Merah, Hijau, Biru.
  // - Hijau dan Biru bertemu di Jembatan Langit (Skybridge) bersatu menjadi CYAN!
  // - Cyan melompat mengambil item di atas jurang lalu bersatu dengan Merah jadi Putih.
  // ==========================================
  {
    id: 8,
    name: 'Level_8',
    title: 'Sintesis Cyan',
    stageLabel: 'LEVEL 8',
    width: 1420,
    height: 720,
    playerStart: { x: 80, y: 570 },
    platforms: [
      // Sayap Kiri
      { x: 0, y: 620, width: 500, height: 100 },
      // Hurdle di Sayap Kiri
      { x: 140, y: 565, width: 18, height: 55, isHurdle: true },
      // Step naik ke Skybridge
      { x: 230, y: 565, width: 60, height: 16 },
      { x: 310, y: 515, width: 110, height: 16 },

      // Batu pijakan di dalam jurang tengah
      { x: 590, y: 565, width: 70, height: 16 },

      // Jembatan Langit Gantung (Skybridge Altar Cyan)
      { x: 480, y: 470, width: 280, height: 16 },

      // Sayap Kanan
      { x: 740, y: 620, width: 680, height: 100 },
      // Tangga & Bypass atas Portal -G di Sayap Kanan
      { x: 770, y: 565, width: 60, height: 16 },
      { x: 840, y: 504, width: 160, height: 16 },
    ],
    portals: [
      { id: 'l8_p_red', type: 'red', x: 360, y: 548, width: 36, height: 72, label: '-R' },
      { id: 'l8_p_green', type: 'green', x: 910, y: 548, width: 36, height: 72, label: '-G' },
    ],
    items: [
      { id: 'l8_itm_red', x: 90, y: 580, width: 20, height: 20, warnaDibutuhkan: 'red', collected: false },
      { id: 'l8_itm_green', x: 780, y: 580, width: 20, height: 20, warnaDibutuhkan: 'green', collected: false },
      { id: 'l8_itm_cyan', x: 610, y: 430, width: 20, height: 20, warnaDibutuhkan: 'cyan', collected: false },
      { id: 'l8_itm_blue', x: 1020, y: 580, width: 20, height: 20, warnaDibutuhkan: 'blue', collected: false },
      { id: 'l8_itm_white', x: 1180, y: 580, width: 20, height: 20, warnaDibutuhkan: 'white', collected: false },
    ],
    spikes: [
      // Jurang duri di dasar antara x=500 dan x=740 (kecuali pijakan)
      { x: 500, y: 608, width: 85, height: 12 },
      { x: 665, y: 608, width: 75, height: 12 },
    ],
    finishZone: { x: 1280, y: 492, width: 96, height: 128 },
  },

  // ==========================================
  // LEVEL 9: BENTENG SIMETRIS (OPPOSING BASTIONS)
  // Konsep: Dua sayap berlawanan bertemu di Altar Pusat Megah (y=490).
  // - Portal -R di sayap kiri, Portal -B di sayap kanan.
  // - Menggabungkan Merah (kiri) dan Biru (kanan) menjadi MAGENTA di puncak Altar!
  // ==========================================
  {
    id: 9,
    name: 'Level_9',
    title: 'Gerbang Berlawanan',
    stageLabel: 'LEVEL 9',
    width: 1440,
    height: 720,
    playerStart: { x: 80, y: 570 },
    platforms: [
      { x: 0, y: 620, width: 1440, height: 100 },
      // Hurdle sayap kiri
      { x: 140, y: 565, width: 18, height: 55, isHurdle: true },
      // Tangga naik kiri
      { x: 230, y: 565, width: 60, height: 16 },
      { x: 310, y: 510, width: 120, height: 16 },

      // Altar Pusat Megah (Tempat Lahir Magenta)
      { x: 560, y: 490, width: 280, height: 16 },
      // Hurdle suci di atas Altar
      { x: 690, y: 435, width: 18, height: 55, isHurdle: true },

      // Tangga turun kanan
      { x: 960, y: 510, width: 120, height: 16 },
      { x: 1100, y: 565, width: 60, height: 16 },
      // Hurdle sayap kanan
      { x: 1200, y: 565, width: 18, height: 55, isHurdle: true },
    ],
    portals: [
      { id: 'l9_p_red', type: 'red', x: 360, y: 548, width: 36, height: 72, label: '-R' },
      { id: 'l9_p_blue', type: 'blue', x: 1040, y: 548, width: 36, height: 72, label: '-B' },
    ],
    items: [
      { id: 'l9_itm_red', x: 90, y: 580, width: 20, height: 20, warnaDibutuhkan: 'red', collected: false },
      { id: 'l9_itm_green', x: 480, y: 580, width: 20, height: 20, warnaDibutuhkan: 'green', collected: false },
      { id: 'l9_itm_magenta', x: 620, y: 450, width: 20, height: 20, warnaDibutuhkan: 'magenta', collected: false },
      { id: 'l9_itm_blue', x: 1120, y: 580, width: 20, height: 20, warnaDibutuhkan: 'blue', collected: false },
    ],
    spikes: [
      { x: 1240, y: 608, width: 44, height: 12 },
    ],
    finishZone: { x: 1320, y: 492, width: 96, height: 128 },
  },

  // ==========================================
  // LEVEL 10: GRAVITASI SILANG (CRISS-CROSS CATWALKS)
  // Konsep: Jalur zigzag bertingkat saling silang (Catwalk Bawah y=520, Catwalk Atas y=440).
  // - Pemain melompat dari Catwalk Bawah ke Catwalk Atas di titik temu silang.
  // - Karakter di bawah dan di atas menghadapi ritme duri bergantian dengan presisi tinggi.
  // ==========================================
  {
    id: 10,
    name: 'Level_10',
    title: 'Inversi Rel Kembar',
    stageLabel: 'LEVEL 10',
    width: 1420,
    height: 720,
    playerStart: { x: 80, y: 570 },
    platforms: [
      { x: 0, y: 620, width: 1420, height: 100 },
      // Hurdle penahan awal di lantai
      { x: 140, y: 565, width: 18, height: 55, isHurdle: true },
      // Step naik ke Catwalk Bawah
      { x: 220, y: 568, width: 60, height: 16 },

      // Catwalk Bawah (Tingkat 1, melintasi di atas Portal -G pada x=340)
      { x: 300, y: 520, width: 360, height: 16 },
      // Hurdle di Catwalk Bawah
      { x: 480, y: 465, width: 18, height: 55, isHurdle: true },

      // Catwalk Atas (Tingkat 2, gap vertikal 80px dari Catwalk Bawah di titik x=620..660)
      { x: 620, y: 440, width: 380, height: 16 },
      // Hurdle penahan di Catwalk Atas
      { x: 760, y: 385, width: 18, height: 55, isHurdle: true },

      // Hurdle di Lantai Dasar Bawah
      { x: 720, y: 565, width: 18, height: 55, isHurdle: true },

      // Tangga turun kanan dari Catwalk Atas
      { x: 1020, y: 500, width: 60, height: 16 },
      { x: 1100, y: 560, width: 60, height: 16 },
    ],
    portals: [
      { id: 'l10_p_green', type: 'green', x: 340, y: 548, width: 36, height: 72, label: '-G' },
    ],
    items: [
      { id: 'l10_itm_green', x: 430, y: 580, width: 20, height: 20, warnaDibutuhkan: 'green', collected: false },
      { id: 'l10_itm_magenta', x: 900, y: 400, width: 20, height: 20, warnaDibutuhkan: 'magenta', collected: false },
      { id: 'l10_itm_white', x: 1190, y: 580, width: 20, height: 20, warnaDibutuhkan: 'white', collected: false },
    ],
    spikes: [
      { x: 830, y: 428, width: 40, height: 12 }, // Duri di Catwalk Atas
      { x: 940, y: 608, width: 44, height: 12 }, // Duri di lantai dasar
    ],
    finishZone: { x: 1280, y: 492, width: 96, height: 128 },
  },

  // ==========================================
  // LEVEL 11: KUIL ZIGZAG TIGA FASA (THE ZIGZAG ASCENDANCE)
  // Konsep: Tangga piramida zigzag 3 lantai (Dasar y=620 -> Tengah y=510 -> Puncak y=400).
  // Karakter harus berpindah arah secara cerdas sebelum meluncur turun ke sisi kanan.
  // ==========================================
  {
    id: 11,
    name: 'Level_11',
    title: 'Piramida Tiga Fasa',
    stageLabel: 'LEVEL 11',
    width: 1440,
    height: 720,
    playerStart: { x: 80, y: 570 },
    platforms: [
      { x: 0, y: 620, width: 1440, height: 100 },
      // Hurdle lantai dasar
      { x: 140, y: 565, width: 18, height: 55, isHurdle: true },
      // Tangga ke Lantai 2
      { x: 220, y: 565, width: 60, height: 16 },

      // Lantai 2 (Mezanin Tengah, melintasi di atas Portal -R pada x=340)
      { x: 300, y: 510, width: 360, height: 16 },
      // Hurdle penahan di Lantai 2
      { x: 450, y: 455, width: 18, height: 55, isHurdle: true },

      // Tangga ke Lantai 3
      { x: 670, y: 460, width: 60, height: 16 },

      // Lantai 3 (Puncak Kuil, melintasi penuh di atas Portal -B pada x=720)
      { x: 710, y: 400, width: 330, height: 16 },

      // Pijakan turun kanan
      { x: 1070, y: 465, width: 60, height: 16 },
      { x: 1150, y: 540, width: 60, height: 16 },
    ],
    portals: [
      { id: 'l11_p_red', type: 'red', x: 340, y: 548, width: 36, height: 72, label: '-R' },
      { id: 'l11_p_blue', type: 'blue', x: 720, y: 548, width: 36, height: 72, label: '-B' },
    ],
    items: [
      { id: 'l11_itm_red', x: 90, y: 580, width: 20, height: 20, warnaDibutuhkan: 'red', collected: false },
      { id: 'l11_itm_blue', x: 400, y: 470, width: 20, height: 20, warnaDibutuhkan: 'blue', collected: false },
      { id: 'l11_itm_green', x: 860, y: 360, width: 20, height: 20, warnaDibutuhkan: 'green', collected: false },
      { id: 'l11_itm_cyan', x: 1010, y: 580, width: 20, height: 20, warnaDibutuhkan: 'cyan', collected: false },
    ],
    spikes: [
      { x: 910, y: 608, width: 44, height: 12 },
    ],
    finishZone: { x: 1280, y: 492, width: 96, height: 128 },
  },

  // ==========================================
  // LEVEL 12: TRINITAS ALKIMIA SEKUNDER (SECONDARY CRUCIBLE)
  // Konsep: Tiga altar megah untuk sintesis ketiga sekunder (Kuning y=510, Cyan y=440, Magenta y=510).
  // - Kuning lahir dari Merah + Hijau di Altar 1.
  // - Cyan lahir dari Hijau + Biru di Altar Puncak 2.
  // - Magenta lahir dari Merah + Biru di Altar 3.
  // ==========================================
  {
    id: 12,
    name: 'Level_12',
    title: 'Trinitas Sekunder',
    stageLabel: 'LEVEL 12',
    width: 1460,
    height: 720,
    playerStart: { x: 80, y: 570 },
    platforms: [
      { x: 0, y: 620, width: 1460, height: 100 },
      // Hurdle 1
      { x: 150, y: 565, width: 18, height: 55, isHurdle: true },
      // Tangga & Bypass Portal -R
      { x: 230, y: 565, width: 60, height: 16 },
      { x: 300, y: 504, width: 150, height: 16 },

      // Altar 1 (Kuning)
      { x: 480, y: 510, width: 140, height: 16 },

      // Altar 2 (Puncak Cyan)
      { x: 690, y: 440, width: 180, height: 16 },
      // Hurdle di Altar Puncak
      { x: 770, y: 385, width: 18, height: 55, isHurdle: true },

      // Altar 3 (Magenta) & Bypass Portal -G (mulai dari 870 agar melintasi Portal -G pada x=910)
      { x: 870, y: 510, width: 230, height: 16 },

      // Tangga turun kanan
      { x: 1140, y: 565, width: 60, height: 16 },
    ],
    portals: [
      { id: 'l12_p_red', type: 'red', x: 380, y: 548, width: 36, height: 72, label: '-R' },
      { id: 'l12_p_green', type: 'green', x: 910, y: 548, width: 36, height: 72, label: '-G' },
    ],
    items: [
      { id: 'l12_itm_yellow', x: 550, y: 470, width: 20, height: 20, warnaDibutuhkan: 'yellow', collected: false },
      { id: 'l12_itm_cyan', x: 730, y: 400, width: 20, height: 20, warnaDibutuhkan: 'cyan', collected: false },
      { id: 'l12_itm_magenta', x: 1010, y: 470, width: 20, height: 20, warnaDibutuhkan: 'magenta', collected: false },
      { id: 'l12_itm_white', x: 1260, y: 580, width: 20, height: 20, warnaDibutuhkan: 'white', collected: false },
    ],
    spikes: [
      { x: 1170, y: 608, width: 44, height: 12 },
    ],
    finishZone: { x: 1340, y: 492, width: 96, height: 128 },
  },

  // ==========================================
  // LEVEL 13: LABIRIN KINETIK (FLOATING PILLAR HOPS)
  // Konsep: Jurang dengan 3 Pilar Apung Terpisah (Pillar Hops) yang menguji ketepatan lompatan ritmis.
  // Karakter harus melompat dari satu pilar ke pilar lain di atas jurang duri.
  // ==========================================
  {
    id: 13,
    name: 'Level_13',
    title: 'Labirin Kinetik',
    stageLabel: 'LEVEL 13',
    width: 1460,
    height: 720,
    playerStart: { x: 80, y: 570 },
    platforms: [
      // Bilik 1 Lantai
      { x: 0, y: 620, width: 450, height: 100 },
      // Hurdle 1
      { x: 150, y: 565, width: 18, height: 55, isHurdle: true },
      // Step & Bypass Portal -B
      { x: 220, y: 565, width: 60, height: 16 },
      { x: 300, y: 504, width: 150, height: 16 },

      // Tiga Pilar Apung (Pillar Hops) di Bilik Tengah
      { x: 530, y: 540, width: 80, height: 80 },
      { x: 670, y: 480, width: 110, height: 140 }, // Pilar Tengah Kuning
      { x: 830, y: 540, width: 80, height: 80 },

      // Bilik 3 Lantai
      { x: 970, y: 620, width: 490, height: 100 },
      // Step & Bypass Portal -R
      { x: 910, y: 565, width: 50, height: 16 },
      { x: 950, y: 504, width: 150, height: 16 },
    ],
    portals: [
      { id: 'l13_p_blue', type: 'blue', x: 360, y: 548, width: 36, height: 72, label: '-B' },
      { id: 'l13_p_red', type: 'red', x: 970, y: 548, width: 36, height: 72, label: '-R' },
    ],
    items: [
      { id: 'l13_itm_blue', x: 90, y: 580, width: 20, height: 20, warnaDibutuhkan: 'blue', collected: false },
      { id: 'l13_itm_yellow', x: 715, y: 440, width: 20, height: 20, warnaDibutuhkan: 'yellow', collected: false },
      { id: 'l13_itm_red', x: 1080, y: 580, width: 20, height: 20, warnaDibutuhkan: 'red', collected: false },
      { id: 'l13_itm_white', x: 1250, y: 580, width: 20, height: 20, warnaDibutuhkan: 'white', collected: false },
    ],
    spikes: [
      // Duri di jurang antara pilar (jarak aman dari spawn portal)
      { x: 475, y: 608, width: 45, height: 12 },
      { x: 615, y: 608, width: 50, height: 12 },
      { x: 785, y: 608, width: 40, height: 12 },
      { x: 1140, y: 608, width: 44, height: 12 },
    ],
    finishZone: { x: 1340, y: 492, width: 96, height: 128 },
  },

  // ==========================================
  // LEVEL 14: KATEDRAL TIGA GERBANG (TRIPLE DOMED ARCHES)
  // Konsep: Tiga portal primer (-R, -G, -B) dengan gerbang lengkung bertingkat berjenjang.
  // Pemain harus mengarahkan ketiga warna primer melintasi kubah gerbang masing-masing.
  // ==========================================
  {
    id: 14,
    name: 'Level_14',
    title: 'Tiga Gerbang Spektrum',
    stageLabel: 'LEVEL 14',
    width: 1560,
    height: 720,
    playerStart: { x: 80, y: 570 },
    platforms: [
      { x: 0, y: 620, width: 1560, height: 100 },

      // Bilik 1 (-R)
      { x: 180, y: 565, width: 18, height: 55, isHurdle: true },
      { x: 260, y: 565, width: 60, height: 16 },
      { x: 330, y: 500, width: 160, height: 16 },

      // Bilik 2 (-G)
      { x: 570, y: 565, width: 18, height: 55, isHurdle: true },
      { x: 660, y: 565, width: 60, height: 16 },
      { x: 730, y: 480, width: 160, height: 16 },

      // Bilik 3 (-B)
      { x: 960, y: 565, width: 18, height: 55, isHurdle: true },
      { x: 1030, y: 540, width: 60, height: 16 },
      { x: 1100, y: 475, width: 170, height: 16 },

      // Altar Kemenangan Akhir
      { x: 1330, y: 540, width: 110, height: 16 },
    ],
    portals: [
      { id: 'l14_p_red', type: 'red', x: 410, y: 548, width: 36, height: 72, label: '-R' },
      { id: 'l14_p_green', type: 'green', x: 800, y: 548, width: 36, height: 72, label: '-G' },
      { id: 'l14_p_blue', type: 'blue', x: 1150, y: 548, width: 36, height: 72, label: '-B' },
    ],
    items: [
      { id: 'l14_itm_red', x: 120, y: 580, width: 20, height: 20, warnaDibutuhkan: 'red', collected: false },
      { id: 'l14_itm_green', x: 600, y: 580, width: 20, height: 20, warnaDibutuhkan: 'green', collected: false },
      { id: 'l14_itm_blue', x: 980, y: 580, width: 20, height: 20, warnaDibutuhkan: 'blue', collected: false },
      { id: 'l14_itm_white', x: 1375, y: 500, width: 20, height: 20, warnaDibutuhkan: 'white', collected: false },
    ],
    spikes: [
      { x: 1260, y: 608, width: 44, height: 12 },
    ],
    finishZone: { x: 1440, y: 492, width: 96, height: 128 },
  },

  // ==========================================
  // LEVEL 15: SINGULARITAS MAHA AGUNG (THE OPUS FINALE: LIGHT CATHEDRAL)
  // Konsep: Epilog karya agung perpaduan seluruh mekanisme dalam Kuil Katedral Cahaya:
  // - Sintesis lengkap 6 warna spektrum (Red, Green, Blue -> Yellow, Cyan, Magenta -> Pure White).
  // - Podium Altar Maha Puncak di ketinggian y=390 yang menopang Gerbang Kemenangan Terakhir!
  // ==========================================
  {
    id: 15,
    name: 'Level_15',
    title: 'Singularitas Agung Spektrum',
    stageLabel: 'LEVEL 15 (GRAND FINALE)',
    width: 1600,
    height: 720,
    playerStart: { x: 80, y: 570 },
    platforms: [
      // Lantai Katedral Cahaya Solid
      { x: 0, y: 620, width: 1600, height: 100 },

      // Sayap Barat (Bilik Red & Yellow)
      { x: 130, y: 565, width: 18, height: 55, isHurdle: true },
      { x: 190, y: 565, width: 60, height: 16 },
      { x: 260, y: 490, width: 170, height: 16 },
      { x: 380, y: 435, width: 18, height: 55, isHurdle: true },

      // Nave Pusat (Bilik Green & Blue)
      { x: 530, y: 565, width: 18, height: 55, isHurdle: true },
      { x: 590, y: 565, width: 60, height: 16 },
      { x: 660, y: 480, width: 170, height: 16 },

      // Tangga Agung Menuju Altar Kemenangan (Sayap Timur)
      { x: 940, y: 560, width: 70, height: 16 },
      { x: 1040, y: 500, width: 80, height: 16 },
      { x: 1150, y: 440, width: 80, height: 16 },

      // Podium Altar Maha Puncak Kemenangan (ketinggian y=390)
      { x: 1260, y: 390, width: 270, height: 230 },
    ],
    portals: [
      { id: 'l15_p_red', type: 'red', x: 320, y: 548, width: 36, height: 72, label: '-R' },
      { id: 'l15_p_green', type: 'green', x: 720, y: 548, width: 36, height: 72, label: '-G' },
    ],
    items: [
      { id: 'l15_itm_red', x: 70, y: 580, width: 20, height: 20, warnaDibutuhkan: 'red', collected: false },
      { id: 'l15_itm_green', x: 510, y: 580, width: 20, height: 20, warnaDibutuhkan: 'green', collected: false },
      { id: 'l15_itm_yellow', x: 310, y: 450, width: 20, height: 20, warnaDibutuhkan: 'yellow', collected: false },
      { id: 'l15_itm_blue', x: 740, y: 440, width: 20, height: 20, warnaDibutuhkan: 'blue', collected: false },
      { id: 'l15_itm_cyan', x: 880, y: 580, width: 20, height: 20, warnaDibutuhkan: 'cyan', collected: false },
      { id: 'l15_itm_white', x: 1300, y: 350, width: 20, height: 20, warnaDibutuhkan: 'white', collected: false },
    ],
    spikes: [
      { x: 430, y: 608, width: 40, height: 12 },
      { x: 1060, y: 608, width: 50, height: 12 },
    ],
    // Gerbang Finish di atas Podium Altar (y: 262 + 128 = 390)
    finishZone: { x: 1360, y: 262, width: 96, height: 128 },
  },
];
