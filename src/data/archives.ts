import manuscript from "@/assets/archive-manuscript.jpg";
import mural from "@/assets/archive-mural.jpg";

export type ArchiveKind = "Manuscript" | "Mural" | "Document" | "Ritual object";

export interface ArchiveItem {
  id: string;
  title: string;
  kind: ArchiveKind;
  monasterySlug: string;
  era: string;
  language: string;
  material: string;
  image: string;
  description: string;
  tags: string[];
}

export const archiveItems: ArchiveItem[] = [
  {
    id: "arc-001",
    title: "Prajnaparamita folios, gold on indigo",
    kind: "Manuscript",
    monasterySlug: "pemayangtse",
    era: "18th century",
    language: "Classical Tibetan",
    material: "Indigo-dyed paper, gold ink",
    image: manuscript,
    description:
      "Twelve surviving folios of the Perfection of Wisdom sutra written in gold on indigo-dyed paper, bound between carved wooden covers. Water damage along the lower margin has been stabilised but not retouched.",
    tags: ["sutra", "gold ink", "wisdom literature", "conservation"],
  },
  {
    id: "arc-002",
    title: "Wrathful deity mural, north wall",
    kind: "Mural",
    monasterySlug: "phodong",
    era: "18th century",
    language: "Iconographic",
    material: "Mineral pigment on lime plaster",
    image: mural,
    description:
      "A section of the north wall cycle depicting protector deities in a ring of flame. Lapis, cinnabar and orpiment pigments remain vivid; the plaster shows structural cracking from the 1934 earthquake.",
    tags: ["protector deity", "pigment analysis", "earthquake damage"],
  },
  {
    id: "arc-003",
    title: "Chogyal land grant to Tashiding",
    kind: "Document",
    monasterySlug: "tashiding",
    era: "19th century",
    language: "Tibetan with Lepcha annotation",
    material: "Handmade paper, red seal",
    image: manuscript,
    description:
      "A royal grant of forest and cardamom land to the monastery, sealed in vermilion. Marginal annotations in Lepcha record a later boundary dispute settled by village elders.",
    tags: ["royal grant", "land record", "Lepcha", "Chogyal"],
  },
  {
    id: "arc-004",
    title: "Bumchu ritual record book",
    kind: "Document",
    monasterySlug: "tashiding",
    era: "20th century",
    language: "Tibetan",
    material: "Ledger paper, ink",
    image: manuscript,
    description:
      "A year-by-year record of the water level observed when the sacred Bumchu vase is opened, together with the interpretation announced to pilgrims. An unbroken series from 1911 onward.",
    tags: ["Bumchu", "ritual calendar", "oral tradition"],
  },
  {
    id: "arc-005",
    title: "Guru Rinpoche cycle, east gallery",
    kind: "Mural",
    monasterySlug: "rumtek",
    era: "20th century",
    language: "Iconographic",
    material: "Mineral pigment and gold leaf",
    image: mural,
    description:
      "The eight manifestations of Padmasambhava painted along the east gallery, executed by artists trained in the Karma Gadri style after the monastery's reconstruction.",
    tags: ["Padmasambhava", "Karma Gadri", "gold leaf"],
  },
  {
    id: "arc-006",
    title: "Cham mask inventory, hand-illustrated",
    kind: "Ritual object",
    monasterySlug: "enchey",
    era: "19th century",
    language: "Tibetan",
    material: "Paper, watercolour",
    image: manuscript,
    description:
      "An illustrated inventory of the masks used in the annual Chaam, listing each deity, the dancer's rank, and the papier-mache repairs made in successive decades.",
    tags: ["cham dance", "mask", "inventory", "performance"],
  },
  {
    id: "arc-007",
    title: "Medical treatise on high-altitude herbs",
    kind: "Manuscript",
    monasterySlug: "dubdi",
    era: "18th century",
    language: "Classical Tibetan",
    material: "Palm leaf, black ink",
    image: manuscript,
    description:
      "A Sowa Rigpa text cataloguing herbs gathered above three thousand metres, with dosage notes and seasonal collection windows still recognised by local practitioners.",
    tags: ["Sowa Rigpa", "medicine", "botany", "ethnobotany"],
  },
  {
    id: "arc-008",
    title: "Lineage thangka, Karma Kagyu masters",
    kind: "Mural",
    monasterySlug: "phodong",
    era: "19th century",
    language: "Iconographic",
    material: "Pigment on cotton, silk brocade mount",
    image: mural,
    description:
      "A lineage thangka showing successive Karmapas in descending register, its silk mount replaced twice. Infrared imaging revealed an underdrawing that differs from the finished composition.",
    tags: ["thangka", "lineage", "infrared imaging"],
  },
];

export const archiveKinds: ArchiveKind[] = [
  "Manuscript",
  "Mural",
  "Document",
  "Ritual object",
];
