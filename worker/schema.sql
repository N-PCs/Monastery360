-- Monastery360 · Cloudflare D1 schema
-- Apply with:
--   wrangler d1 execute monastery360 --file=./schema.sql --remote

DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS archive_items;
DROP TABLE IF EXISTS tour_hotspots;
DROP TABLE IF EXISTS tour_scenes;
DROP TABLE IF EXISTS monasteries;

CREATE TABLE monasteries (
  slug         TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  local_name   TEXT,
  district     TEXT NOT NULL,
  sect         TEXT NOT NULL,
  founded      INTEGER,
  era          TEXT,
  altitude     INTEGER,
  lat          REAL NOT NULL,
  lng          REAL NOT NULL,
  cover_key    TEXT,          -- R2 object key
  summary      TEXT,
  history      TEXT,
  architecture TEXT,
  visiting     TEXT,
  nearby       TEXT,          -- JSON array
  beacon_id    TEXT
);
CREATE INDEX idx_monasteries_district ON monasteries (district);
CREATE INDEX idx_monasteries_sect ON monasteries (sect);
CREATE INDEX idx_monasteries_beacon ON monasteries (beacon_id);

CREATE TABLE tour_scenes (
  id              TEXT PRIMARY KEY,
  monastery_slug  TEXT NOT NULL REFERENCES monasteries(slug) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  panorama_key    TEXT NOT NULL, -- R2 object key of the equirectangular image
  narration       TEXT NOT NULL,
  sort_order      INTEGER DEFAULT 0
);
CREATE INDEX idx_scenes_monastery ON tour_scenes (monastery_slug);

CREATE TABLE tour_hotspots (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  scene_id   TEXT NOT NULL REFERENCES tour_scenes(id) ON DELETE CASCADE,
  pitch      REAL NOT NULL,
  yaw        REAL NOT NULL,
  label      TEXT NOT NULL,
  target_scene_id TEXT
);
CREATE INDEX idx_hotspots_scene ON tour_hotspots (scene_id);

CREATE TABLE archive_items (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  kind            TEXT NOT NULL,
  monastery_slug  TEXT REFERENCES monasteries(slug),
  era             TEXT,
  language        TEXT,
  material        TEXT,
  image_key       TEXT,        -- R2 object key
  scan_key        TEXT,        -- R2 object key of the full PDF scan
  description     TEXT,
  tags            TEXT,        -- JSON array
  embedding       TEXT         -- JSON array of floats, written by /api/admin/reindex
);
CREATE INDEX idx_archive_kind ON archive_items (kind);
CREATE INDEX idx_archive_monastery ON archive_items (monastery_slug);

CREATE TABLE events (
  id                TEXT PRIMARY KEY,
  name              TEXT NOT NULL,
  monastery_slug    TEXT REFERENCES monasteries(slug),
  start_date        TEXT NOT NULL,   -- ISO yyyy-mm-dd
  end_date          TEXT,
  category          TEXT,
  description       TEXT,
  open_to_visitors  INTEGER DEFAULT 1
);
CREATE INDEX idx_events_date ON events (start_date);

CREATE TABLE bookings (
  id          TEXT PRIMARY KEY,
  event_id    TEXT NOT NULL REFERENCES events(id),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  people      INTEGER NOT NULL DEFAULT 1,
  note        TEXT,
  created_at  TEXT NOT NULL
);
CREATE INDEX idx_bookings_event ON bookings (event_id);

-- Seed rows -----------------------------------------------------------------

INSERT INTO monasteries (slug, name, local_name, district, sect, founded, era, altitude, lat, lng, cover_key, summary, history, architecture, visiting, nearby, beacon_id) VALUES
('rumtek','Rumtek Monastery','Dharma Chakra Centre','East Sikkim','Karma Kagyu',1740,'18th century',1550,27.2885,88.5615,'covers/rumtek.jpg','The largest monastery in Sikkim and seat-in-exile of the Karmapa, celebrated for its golden stupa and ritual dance courtyard.','Originally built in the mid-18th century under the twelfth Karmapa, Rumtek was rebuilt in the 1960s as the main seat of the Karma Kagyu lineage outside Tibet.','A four-storey main shrine on a traditional Tibetan plan, with a walled courtyard for cham dances and an upper gallery of painted wooden lattice.','Open daily 06:00-18:00. Twenty-four kilometres from Gangtok by road.','["Old Rumtek Monastery","Lingdum Monastery","Ranka village"]','BCN-RTK-01'),
('pemayangtse','Pemayangtse Monastery','Perfect Sublime Lotus','West Sikkim','Nyingma',1705,'18th century',2085,27.3046,88.2513,'covers/pemayangtse.jpg','One of the oldest Nyingma monasteries in Sikkim, home to the seven-tiered wooden sculpture Zangdok Palri.','Founded by Lama Lhatsun Chempo and expanded in 1705; its head lama traditionally consecrated the Chogyals of Sikkim.','Three storeys on a ridge above the Rathong valley, the top floor holding a carved model of Guru Rinpoche''s celestial palace.','Open 07:00-17:00, two kilometres from Pelling.','["Rabdentse ruins","Pelling Skywalk","Khecheopalri Lake"]','BCN-PMY-01'),
('tashiding','Tashiding Monastery','The Devoted Central Glory','West Sikkim','Nyingma',1641,'17th century',1465,27.3094,88.2969,'covers/tashiding.jpg','Built on a heart-shaped hill between the Rathong and Rangeet rivers, considered the most sacred site in Sikkim.','Established in 1641 by Ngadak Sempa Chempo. The Bumchu ceremony has been performed here without interruption for centuries.','Whitewashed shrines and chortens on a forested ridge, ringed by carved mani stone walls and prayer flags.','Open dawn to dusk; a forty-minute uphill walk from Tashiding town.','["Hungri Monastery","Rangeet river confluence","Yuksom"]','BCN-TSD-01'),
('enchey','Enchey Monastery','The Solitary Temple','East Sikkim','Nyingma',1840,'19th century',1840,27.3389,88.6197,'covers/enchey.jpg','A two-hundred-year-old hermitage above Gangtok, believed to be protected by Khangchendzonga and Yabdean.','Blessed by Lama Druptob Karpo; the present building dates from 1909 and hosts the Chaam dance each December.','A single-storey shrine in green and red with pagoda influences, framed by tall conifers.','Open 06:00-16:00, three kilometres from central Gangtok.','["Ganesh Tok","Gangtok ropeway","Do Drul Chorten"]','BCN-ENC-01'),
('dubdi','Dubdi Monastery','The Hermit''s Cell','West Sikkim','Nyingma',1701,'18th century',2100,27.3736,88.2261,'covers/dubdi.jpg','The oldest monastery in Sikkim, raised above Yuksom shortly after the coronation of the first Chogyal.','Built in 1701 by Lhatsun Namkha Jigme, marking the beginning of institutional Buddhism in Sikkim.','A small stone-and-timber double-storey structure under dense forest canopy.','Open daylight hours; a one-hour uphill trek from Yuksom.','["Yuksom coronation throne","Kathok Lake","Norbugang Chorten"]','BCN-DBD-01'),
('phodong','Phodong Monastery','Phodong Gonpa','North Sikkim','Karma Kagyu',1740,'18th century',1370,27.4139,88.5836,'covers/phodong.jpg','One of the six most important monasteries in Sikkim, known for its restored eighteenth-century murals.','Founded under Chogyal Gyurmed Namgyal and rebuilt after earthquake damage in the early twentieth century.','A broad assembly hall with a white facade and red band, housing a well-preserved mural cycle.','Open 07:00-17:00, twenty-eight kilometres north of Gangtok.','["Labrang Monastery","Seven Sisters Waterfall","Kabi Lungchok"]','BCN-PHD-01');

INSERT INTO tour_scenes (id, monastery_slug, title, panorama_key, narration, sort_order) VALUES
('rumtek-courtyard','rumtek','Main courtyard','panoramas/rumtek-courtyard.jpg','You are standing in the great courtyard of Rumtek. Each winter this stone floor becomes the stage for the cham, the masked dance that enacts the victory of wisdom over ignorance.',0),
('rumtek-hall','rumtek','Main prayer hall','panoramas/rumtek-hall.jpg','Inside the prayer hall, rows of low benches face a gilded Shakyamuni Buddha, with butter lamps burning continuously before the altar.',1),
('pemayangtse-hall','pemayangtse','Assembly hall','panoramas/pemayangtse-hall.jpg','The assembly hall of Pemayangtse is dense with three centuries of pigment, its walls carrying the wrathful and peaceful deities of the Nyingma tradition.',0),
('tashiding-grounds','tashiding','Chorten grounds','panoramas/tashiding-grounds.jpg','The chortens of Tashiding hold the ashes of lamas and laypeople alike, with prayer flags carrying mantras above the confluence of two rivers.',0);

INSERT INTO tour_hotspots (scene_id, pitch, yaw, label, target_scene_id) VALUES
('rumtek-courtyard',-4,110,'Enter the prayer hall','rumtek-hall'),
('rumtek-courtyard',6,-60,'Lineage murals',NULL),
('rumtek-hall',-6,-140,'Back to the courtyard','rumtek-courtyard'),
('pemayangtse-hall',2,80,'Upper floor: Zangdok Palri',NULL),
('tashiding-grounds',0,150,'Bumchu shrine',NULL);

INSERT INTO archive_items (id, title, kind, monastery_slug, era, language, material, image_key, description, tags) VALUES
('arc-001','Prajnaparamita folios, gold on indigo','Manuscript','pemayangtse','18th century','Classical Tibetan','Indigo-dyed paper, gold ink','archives/arc-001.jpg','Twelve surviving folios of the Perfection of Wisdom sutra written in gold on indigo-dyed paper, bound between carved wooden covers.','["sutra","gold ink","wisdom literature","conservation"]'),
('arc-002','Wrathful deity mural, north wall','Mural','phodong','18th century','Iconographic','Mineral pigment on lime plaster','archives/arc-002.jpg','A section of the north wall cycle depicting protector deities in a ring of flame, with structural cracking from the 1934 earthquake.','["protector deity","pigment analysis","earthquake damage"]'),
('arc-003','Chogyal land grant to Tashiding','Document','tashiding','19th century','Tibetan with Lepcha annotation','Handmade paper, red seal','archives/arc-003.jpg','A royal grant of forest and cardamom land to the monastery, sealed in vermilion, with marginal annotations in Lepcha.','["royal grant","land record","Lepcha","Chogyal"]'),
('arc-004','Bumchu ritual record book','Document','tashiding','20th century','Tibetan','Ledger paper, ink','archives/arc-004.jpg','A year-by-year record of the water level observed when the sacred Bumchu vase is opened, unbroken from 1911 onward.','["Bumchu","ritual calendar","oral tradition"]'),
('arc-005','Guru Rinpoche cycle, east gallery','Mural','rumtek','20th century','Iconographic','Mineral pigment and gold leaf','archives/arc-005.jpg','The eight manifestations of Padmasambhava painted along the east gallery in the Karma Gadri style.','["Padmasambhava","Karma Gadri","gold leaf"]'),
('arc-006','Cham mask inventory, hand-illustrated','Ritual object','enchey','19th century','Tibetan','Paper, watercolour','archives/arc-006.jpg','An illustrated inventory of the masks used in the annual Chaam, listing each deity and the repairs made over decades.','["cham dance","mask","inventory","performance"]'),
('arc-007','Medical treatise on high-altitude herbs','Manuscript','dubdi','18th century','Classical Tibetan','Palm leaf, black ink','archives/arc-007.jpg','A Sowa Rigpa text cataloguing herbs gathered above three thousand metres, with dosage and seasonal collection notes.','["Sowa Rigpa","medicine","botany","ethnobotany"]'),
('arc-008','Lineage thangka, Karma Kagyu masters','Mural','phodong','19th century','Iconographic','Pigment on cotton, silk brocade mount','archives/arc-008.jpg','A lineage thangka showing successive Karmapas in descending register; infrared imaging revealed an altered underdrawing.','["thangka","lineage","infrared imaging"]');

INSERT INTO events (id, name, monastery_slug, start_date, end_date, category, description, open_to_visitors) VALUES
('evt-losar','Losar — Tibetan New Year','rumtek','2027-02-18','2027-02-20','Festival','Three days of new-year observance: butter sculpture offerings and public blessing by the resident lamas.',1),
('evt-bumchu','Bumchu — Sacred Vase Ceremony','tashiding','2027-03-02',NULL,'Ritual','The sacred vase is opened before dawn and the water level read as an omen for the coming year.',1),
('evt-sagadawa','Saga Dawa','pemayangtse','2027-05-30',NULL,'Pilgrimage','Commemoration of the birth, enlightenment and passing of the Buddha, marked by circumambulation processions.',1),
('evt-pang','Pang Lhabsol','phodong','2027-08-27',NULL,'Dance','Sikkim''s festival honouring Mount Khangchendzonga, with the warrior dance of Pangtoed performed in full armour.',1),
('evt-chaam','Enchey Chaam','enchey','2027-12-17','2027-12-18','Dance','Masked cham dance enacting the subjugation of obstructive forces, performed to cymbals and long horns.',1),
('evt-drupchen','Guru Drakmar Drupchen','dubdi','2027-04-11','2027-04-17','Ritual','A week-long intensive practice retreat centred on Guru Rinpoche; the final day is open for blessing.',0),
('evt-kagyed','Kagyed Dance','rumtek','2027-12-08',NULL,'Dance','Performed on the twenty-eighth and twenty-ninth days of the tenth Tibetan month, ending with the burning of effigies.',1);
