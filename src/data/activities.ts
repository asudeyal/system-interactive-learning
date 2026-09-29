import type { ActivityDefinition } from '../types'

export const activities: ActivityDefinition[] = [
  {
    id: 'system-anatomy',
    title: 'Sistem Anatomisi',
    shortTitle: 'Anatomi',
    description: 'Amaç, bileşen, ilişki, sınır, çevre, arayüz, girdi ve çıktıyı doğru konumlandır.',
    recommendedAfter: 'Slayt 16 sonrası',
    maxScore: 100,
    accent: '#2563eb',
  },
  {
    id: 'relationship-network',
    title: 'İlişki Ağını Kur',
    shortTitle: 'İlişki Ağı',
    description: 'Sistem öğeleri arasındaki neden-sonuç ilişkilerini ve etki yönünü modelle.',
    recommendedAfter: 'Slayt 26–28 sonrası',
    maxScore: 120,
    accent: '#7c3aed',
  },
  {
    id: 'system-boundary',
    title: 'Sistem Sınırını Belirle',
    shortTitle: 'Sistem Sınırı',
    description: 'Sistem, çevre ve etkilenebilir çevre arasındaki sınırı belirle.',
    recommendedAfter: 'Slayt 33–41 sonrası',
    maxScore: 100,
    accent: '#059669',
  },
  {
    id: 'system-flow',
    title: 'Sistemi Kur ve Çalıştır',
    shortTitle: 'Sistem Akışı',
    description: 'Alt sistemleri yerleştir, akışı kur ve sistemin çalışma zincirini tamamla.',
    recommendedAfter: 'Slayt 44–47 sonrası',
    maxScore: 150,
    accent: '#ea580c',
  },
]

export const getActivity = (id?: string | null) =>
  activities.find((activity) => activity.id === id)
