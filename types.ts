export enum RagaStyle {
  Hindustani = 'Hindustani',
  Carnatic = 'Carnatic',
}

export enum TimeOfDay {
  Morning = 'Early Morning',
  Day = 'Day',
  Afternoon = 'Afternoon',
  Evening = 'Evening',
  Night = 'Night',
  LateNight = 'Late Night',
  AnyTime = 'Any Time',
}

export interface Composer {
  name: string;
  bio: string;
  externalUrl?: string;
}

export interface Composition {
  name: string;
  composer: Composer;
  mediaUrl?: string;
}

export interface Raga {
  id: string;
  name: string;
  style: RagaStyle;
  thaat?: string; // For Hindustani
  melakarta?: string; // For Carnatic
  aroha: string; // Ascending notes
  avaroha: string; // Descending notes
  vadi?: string; // Dominant note
  samvadi?: string; // Sub-dominant note
  pakad?: string; // Characteristic phrase
  time: TimeOfDay;
  description: string;
  originator?: {
    name: string;
    note: string;
  };
  period?: string; // The historical period of origin
  audioUrl?: string;
  compositions?: Composition[];
}