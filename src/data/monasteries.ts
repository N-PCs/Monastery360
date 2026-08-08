import panoRumtek from "@/assets/pano-rumtek.jpg";
import panoPemayangtse from "@/assets/pano-pemayangtse.jpg";
import panoTashiding from "@/assets/pano-tashiding.jpg";
import heroMonastery from "@/assets/hero-monastery.jpg";

export type District = "East Sikkim" | "West Sikkim" | "North Sikkim" | "South Sikkim";
export type Sect = "Karma Kagyu" | "Nyingma" | "Kagyu" | "Gelug";

export interface TourScene {
  id: string;
  title: string;
  image: string;
  narration: string;
  hotspots: { pitch: number; yaw: number; label: string; sceneId?: string }[];
}

export interface Monastery {
  slug: string;
  name: string;
  localName: string;
  district: District;
  sect: Sect;
  founded: number;
  era: "17th century" | "18th century" | "19th century" | "20th century";
  altitude: number;
  lat: number;
  lng: number;
  cover: string;
  summary: string;
  history: string;
  architecture: string;
  visiting: string;
  nearby: string[];
  beaconId: string;
  scenes: TourScene[];
}

export const monasteries: Monastery[] = [
  {
    slug: "rumtek",
    name: "Rumtek Monastery",
    localName: "Dharma Chakra Centre",
    district: "East Sikkim",
    sect: "Karma Kagyu",
    founded: 1740,
    era: "18th century",
    altitude: 1550,
    lat: 27.2885,
    lng: 88.5615,
    cover: heroMonastery,
    summary:
      "The largest monastery in Sikkim and seat-in-exile of the Karmapa, celebrated for its golden stupa and its ritual dance courtyard.",
    history:
      "Originally built in the mid-18th century under the twelfth Karmapa, Rumtek fell into ruin before being rebuilt in the 1960s as the main seat of the Karma Kagyu lineage outside Tibet. Its reliquary hall holds the golden stupa containing the relics of the sixteenth Karmapa, along with sacred objects carried across the Himalaya during the exodus of 1959.",
    architecture:
      "A four-storey main shrine built on a traditional Tibetan plan: a walled courtyard for cham dances, a colonnade of red-lacquered pillars, and an upper gallery of painted wooden lattice. The interior is covered in murals of the Kagyu lineage masters, with silk thangkas suspended from the ceiling beams.",
    visiting:
      "Open daily 06:00-18:00. Photography is permitted in the courtyard but not inside the reliquary hall. Twenty-four kilometres from Gangtok by road, roughly an hour of switchbacks.",
    nearby: ["Old Rumtek Monastery", "Lingdum Monastery", "Ranka village"],
    beaconId: "BCN-RTK-01",
    scenes: [
      {
        id: "courtyard",
        title: "Main courtyard",
        image: panoRumtek,
        narration:
          "You are standing in the great courtyard of Rumtek. Each winter this stone floor becomes the stage for the cham, the masked dance that enacts the victory of wisdom over ignorance. The prayer wheels along the colonnade are turned clockwise by every visitor who passes.",
        hotspots: [
          { pitch: -4, yaw: 110, label: "Enter the prayer hall", sceneId: "hall" },
          { pitch: 6, yaw: -60, label: "Lineage murals" },
        ],
      },
      {
        id: "hall",
        title: "Main prayer hall",
        image: panoPemayangtse,
        narration:
          "Inside the prayer hall, rows of low benches face a gilded Shakyamuni Buddha. Butter lamps burn continuously before the altar, and the ceiling above you carries mandalas repainted by hand every generation.",
        hotspots: [{ pitch: -6, yaw: -140, label: "Back to the courtyard", sceneId: "courtyard" }],
      },
    ],
  },
  {
    slug: "pemayangtse",
    name: "Pemayangtse Monastery",
    localName: "Perfect Sublime Lotus",
    district: "West Sikkim",
    sect: "Nyingma",
    founded: 1705,
    era: "18th century",
    altitude: 2085,
    lat: 27.3046,
    lng: 88.2513,
    cover: panoPemayangtse,
    summary:
      "One of the oldest and most premier Nyingma monasteries in Sikkim, home to the seven-tiered wooden sculpture Zangdok Palri.",
    history:
      "Founded by Lama Lhatsun Chempo and later expanded in 1705, Pemayangtse was reserved for ta-tshang, monks of pure Tibetan lineage. Its head lama traditionally consecrated the Chogyals, the kings of Sikkim, giving the monastery a political weight matched by no other in the region.",
    architecture:
      "Three storeys on a ridge overlooking the Rathong valley. The uppermost floor holds Zangdok Palri, a painted wooden model of Guru Rinpoche's celestial palace, carved single-handedly over five years by a late head lama.",
    visiting:
      "Open 07:00-17:00. Located two kilometres from Pelling; the ruins of Rabdentse, the second capital of Sikkim, are a short forest walk away.",
    nearby: ["Rabdentse ruins", "Pelling Skywalk", "Khecheopalri Lake"],
    beaconId: "BCN-PMY-01",
    scenes: [
      {
        id: "hall",
        title: "Assembly hall",
        image: panoPemayangtse,
        narration:
          "The assembly hall of Pemayangtse is dense with three centuries of pigment. Every column is wrapped in painted cloth, and the walls carry the wrathful and peaceful deities of the Nyingma tradition.",
        hotspots: [{ pitch: 2, yaw: 80, label: "Upper floor: Zangdok Palri" }],
      },
    ],
  },
  {
    slug: "tashiding",
    name: "Tashiding Monastery",
    localName: "The Devoted Central Glory",
    district: "West Sikkim",
    sect: "Nyingma",
    founded: 1641,
    era: "17th century",
    altitude: 1465,
    lat: 27.3094,
    lng: 88.2969,
    cover: panoTashiding,
    summary:
      "Built on a heart-shaped hill between the Rathong and Rangeet rivers, considered the most sacred site in Sikkim.",
    history:
      "Established in 1641 by Ngadak Sempa Chempo, one of the three lamas who consecrated the first Chogyal. Pilgrims hold that the mere sight of Tashiding's hill cleanses sin. The Bumchu ceremony, in which a sacred vase of water is opened to foretell the coming year, has been performed here without interruption for centuries.",
    architecture:
      "A modest cluster of whitewashed shrines and chortens on a forested ridge, ringed by mani stone walls carved with scripture and by long lines of prayer flags anchored to the pines.",
    visiting:
      "Open dawn to dusk. Reached by a forty-minute uphill walk from Tashiding town; wear proper shoes in monsoon.",
    nearby: ["Hungri Monastery", "Rangeet river confluence", "Yuksom"],
    beaconId: "BCN-TSD-01",
    scenes: [
      {
        id: "grounds",
        title: "Chorten grounds",
        image: panoTashiding,
        narration:
          "The chortens of Tashiding hold the ashes of lamas and laypeople alike. Prayer flags carry mantras into the wind above the confluence of two rivers, and on a clear morning Kanchenjunga stands directly ahead of you.",
        hotspots: [{ pitch: 0, yaw: 150, label: "Bumchu shrine" }],
      },
    ],
  },
  {
    slug: "enchey",
    name: "Enchey Monastery",
    localName: "The Solitary Temple",
    district: "East Sikkim",
    sect: "Nyingma",
    founded: 1840,
    era: "19th century",
    altitude: 1840,
    lat: 27.3389,
    lng: 88.6197,
    cover: panoRumtek,
    summary:
      "A two-hundred-year-old hermitage above Gangtok, believed to be protected by the deities Khangchendzonga and Yabdean.",
    history:
      "The site was blessed by Lama Druptob Karpo, a tantric master said to have flown to the ridge. The present building dates from 1909, raised in the reign of Chogyal Sidkeong Tulku, and the monastery remains the venue of the Chaam dance each December.",
    architecture:
      "A single-storey Chinese-pagoda-influenced shrine in green and red, framed by tall conifers, with murals of the guardian deities flanking the entrance porch.",
    visiting:
      "Open 06:00-16:00, three kilometres from central Gangtok and walkable from the ropeway.",
    nearby: ["Ganesh Tok", "Gangtok ropeway", "Do Drul Chorten"],
    beaconId: "BCN-ENC-01",
    scenes: [
      {
        id: "grounds",
        title: "Temple forecourt",
        image: panoTashiding,
        narration:
          "Enchey sits in solitude above the noise of Gangtok. The forecourt is quiet except for the wind in the conifers and the low sound of the morning recitation drifting from the shrine.",
        hotspots: [],
      },
    ],
  },
  {
    slug: "dubdi",
    name: "Dubdi Monastery",
    localName: "The Hermit's Cell",
    district: "West Sikkim",
    sect: "Nyingma",
    founded: 1701,
    era: "18th century",
    altitude: 2100,
    lat: 27.3736,
    lng: 88.2261,
    cover: panoTashiding,
    summary:
      "The oldest monastery in Sikkim, raised above Yuksom shortly after the coronation of the first Chogyal.",
    history:
      "Built in 1701 by Lhatsun Namkha Jigme, Dubdi marks the beginning of institutional Buddhism in Sikkim. It stands a steep hour above Yuksom, the coronation throne of the first Chogyal, and is still used as a retreat.",
    architecture:
      "A small stone-and-timber double-storey structure with a gently sloped roof, ringed by prayer flags and moss-covered chortens under dense forest canopy.",
    visiting:
      "Open daylight hours. A one-hour uphill trek from Yuksom through cardamom fields and forest.",
    nearby: ["Yuksom coronation throne", "Kathok Lake", "Norbugang Chorten"],
    beaconId: "BCN-DBD-01",
    scenes: [
      {
        id: "grounds",
        title: "Forest approach",
        image: panoTashiding,
        narration:
          "Dubdi is reached on foot. Under the canopy the light turns green, and the last stretch opens onto a small stone shrine that has watched over Sikkim since 1701.",
        hotspots: [],
      },
    ],
  },
  {
    slug: "phodong",
    name: "Phodong Monastery",
    localName: "Phodong Gonpa",
    district: "North Sikkim",
    sect: "Karma Kagyu",
    founded: 1740,
    era: "18th century",
    altitude: 1370,
    lat: 27.4139,
    lng: 88.5836,
    cover: panoRumtek,
    summary:
      "One of the six most important monasteries in Sikkim, known for its restored eighteenth-century murals.",
    history:
      "Founded during the reign of Chogyal Gyurmed Namgyal, Phodong was rebuilt in the early twentieth century after earthquake damage. Its mural cycle is among the best-preserved in the state and has been the subject of ongoing conservation work.",
    architecture:
      "A broad assembly hall with a bright white facade and red band, over a hundred monks in residence, and an inner sanctum whose walls carry restored painted narratives of the Kagyu masters.",
    visiting:
      "Open 07:00-17:00, twenty-eight kilometres north of Gangtok on the North Sikkim highway.",
    nearby: ["Labrang Monastery", "Seven Sisters Waterfall", "Kabi Lungchok"],
    beaconId: "BCN-PHD-01",
    scenes: [
      {
        id: "hall",
        title: "Assembly hall",
        image: panoPemayangtse,
        narration:
          "Phodong's assembly hall holds some of the finest surviving eighteenth-century murals in Sikkim, recovered pigment by pigment over years of patient conservation.",
        hotspots: [],
      },
    ],
  },
];

export function getMonastery(slug: string): Monastery | undefined {
  return monasteries.find((m) => m.slug === slug);
}

export const districts: District[] = [
  "East Sikkim",
  "West Sikkim",
  "North Sikkim",
  "South Sikkim",
];

export const sects: Sect[] = ["Nyingma", "Karma Kagyu", "Kagyu", "Gelug"];
