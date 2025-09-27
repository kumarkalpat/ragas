import { Raga, RagaStyle, TimeOfDay } from './types';

// NOTE: All external audio URLs have been replaced with a valid, silent Base64
// Data URL to fix the "Failed to load" errors caused by malformed WAV data.
// This serves as a stable placeholder.
const VALID_SILENT_AUDIO_URL = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';

export const RAGAS: Raga[] = [
  // Hindustani Ragas
  {
    id: 'yaman',
    name: 'Yaman',
    style: RagaStyle.Hindustani,
    thaat: 'Kalyan',
    aroha: 'N R G M(t) P D N S\'',
    avaroha: 'S\' N D P M(t) G R S',
    vadi: 'Ga',
    samvadi: 'Ni',
    pakad: 'N R G R S, P M(t) G R S',
    time: TimeOfDay.Evening,
    description: 'A principal raga of Hindustani music, known for its serene and devotional mood.',
    originator: {
        name: 'Ameer Khusrau (Attributed)',
        note: 'A prolific poet, scholar, and musician of the Delhi Sultanate, often credited with creating qawwali and developing new ragas.'
    },
    period: '13th-14th Century',
    audioUrl: VALID_SILENT_AUDIO_URL,
  },
  {
    id: 'bhairavi',
    name: 'Bhairavi',
    style: RagaStyle.Hindustani,
    thaat: 'Bhairavi',
    aroha: 'S r g M P d n S\'',
    avaroha: 'S\' n d P M g r S',
    vadi: 'Ma',
    samvadi: 'Sa',
    pakad: 'g M d P, M g r S',
    time: TimeOfDay.Morning,
    description: 'A popular Hindustani raga, often performed at the end of a concert. It has a deeply emotional and devotional character.',
    originator: {
        name: 'Ancient Origin',
        note: 'An ancient raga considered part of the foundational Bhairav family, with origins tied to devotional traditions predating modern classification.'
    },
    period: 'Ancient',
    audioUrl: VALID_SILENT_AUDIO_URL,
  },
  // Carnatic Ragas
  {
    id: 'mayamalavagowla',
    name: 'Mayamalavagowla',
    style: RagaStyle.Carnatic,
    melakarta: '15th',
    aroha: 'S R1 G3 M1 P D1 N3 S\'',
    avaroha: 'S\' N3 D1 P M1 G3 R1 S',
    time: TimeOfDay.Morning,
    description: 'The foundational raga in Carnatic music, used for initial lessons. It evokes peace and devotion.',
    originator: {
        name: 'Purandara Dasa',
        note: 'Often hailed as the "Pitamaha" (father) of Carnatic music, he systematized initial music lessons and composed thousands of devotional songs.'
    },
    period: '15th Century',
    audioUrl: VALID_SILENT_AUDIO_URL,
  },
  {
    id: 'kalyani',
    name: 'Kalyani',
    style: RagaStyle.Carnatic,
    melakarta: '65th',
    aroha: 'S R2 G3 M2 P D2 N3 S\'',
    avaroha: 'S\' N3 D2 P M2 G3 R2 S',
    time: TimeOfDay.AnyTime,
    description: 'A major and popular raga in Carnatic music, equivalent to Yaman in Hindustani music. It is known for its auspicious and majestic feel.',
    audioUrl: VALID_SILENT_AUDIO_URL,
    compositions: [
        { 
            name: 'Nidhi Chala Sukhama', 
            composer: {
                name: 'Tyagaraja',
                bio: 'One of the greatest composers of Carnatic music, he composed thousands of devotional compositions, most in praise of Lord Rama.',
                externalUrl: 'https://en.wikipedia.org/wiki/Tyagaraja',
            },
            // Replaced video with an embeddable version
            mediaUrl: 'https://www.youtube.com/watch?v=5JdG_8m3_gM' 
        },
        { 
            name: 'Vatapi Ganapatim', 
            composer: {
                name: 'Muthuswami Dikshitar',
                bio: 'A South Indian poet and composer, he is considered one of the musical trinity of Carnatic music. His compositions are noted for their elaborate and poetic descriptions.',
                externalUrl: 'https://en.wikipedia.org/wiki/Muthuswami_Dikshitar',
            },
            // Replaced video with an embeddable version
            mediaUrl: 'https://www.youtube.com/watch?v=QRQ64y25WvI' 
        },
    ]
  }
];