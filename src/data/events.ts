export interface CulturalEvent {
  id: string;
  name: string;
  monasterySlug: string;
  date: string;
  endDate?: string;
  category: "Festival" | "Ritual" | "Dance" | "Pilgrimage";
  description: string;
  openToVisitors: boolean;
}

export const culturalEvents: CulturalEvent[] = [
  {
    id: "evt-losar",
    name: "Losar — Tibetan New Year",
    monasterySlug: "rumtek",
    date: "2027-02-18",
    endDate: "2027-02-20",
    category: "Festival",
    description:
      "Three days of new-year observance: butter sculpture offerings, the sweeping of the old year from the courtyard, and public blessing by the resident lamas.",
    openToVisitors: true,
  },
  {
    id: "evt-bumchu",
    name: "Bumchu — Sacred Vase Ceremony",
    monasterySlug: "tashiding",
    date: "2027-03-02",
    category: "Ritual",
    description:
      "The sacred vase is opened before dawn and the water level read as an omen for the coming year. Pilgrims receive a spoonful of the holy water.",
    openToVisitors: true,
  },
  {
    id: "evt-sagadawa",
    name: "Saga Dawa",
    monasterySlug: "pemayangtse",
    date: "2027-05-30",
    category: "Pilgrimage",
    description:
      "Commemoration of the birth, enlightenment and passing of the Buddha, marked by circumambulation processions carrying scripture through the town.",
    openToVisitors: true,
  },
  {
    id: "evt-pang",
    name: "Pang Lhabsol",
    monasterySlug: "phodong",
    date: "2027-08-27",
    category: "Dance",
    description:
      "Sikkim's own festival honouring Mount Khangchendzonga as guardian deity, with the warrior dance of Pangtoed performed in full armour.",
    openToVisitors: true,
  },
  {
    id: "evt-chaam",
    name: "Enchey Chaam",
    monasterySlug: "enchey",
    date: "2027-12-17",
    endDate: "2027-12-18",
    category: "Dance",
    description:
      "Masked cham dance enacting the subjugation of obstructive forces, performed to cymbals and long horns in the temple forecourt.",
    openToVisitors: true,
  },
  {
    id: "evt-drupchen",
    name: "Guru Drakmar Drupchen",
    monasterySlug: "dubdi",
    date: "2027-04-11",
    endDate: "2027-04-17",
    category: "Ritual",
    description:
      "A week-long intensive practice retreat centred on Guru Rinpoche. The final day is open to lay visitors for blessing.",
    openToVisitors: false,
  },
  {
    id: "evt-kagyed",
    name: "Kagyed Dance",
    monasterySlug: "rumtek",
    date: "2027-12-08",
    category: "Dance",
    description:
      "Performed on the twenty-eighth and twenty-ninth days of the tenth Tibetan month, ending with the burning of effigies that carry away the year's negativity.",
    openToVisitors: true,
  },
];
