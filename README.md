# SystemLab Live

Sistem Analizi ve Tasarımı dersi için canlı, puanlı ve modüler sınıf etkileşim platformu.

## Şu an çalışan prototip

- Öğretmen panelinden 6 haneli session oluşturma
- Aynı tarayıcının farklı sekmelerinde canlı session senkronizasyonu
- Öğrenci için session kodu + nickname ile katılım
- Öğretmenin interaction açıp kapatması
- Öğrenci ekranının aktif interaction'a otomatik geçmesi
- Dört farklı interaction prototipi
- Puanların session'a yazılması
- Canlı leaderboard
- Telefon ve projektör ekranlarına uyumlu responsive arayüz

> Mevcut realtime altyapı localStorage + BroadcastChannel ile bir **lokal demo** olarak çalışır. Farklı telefonlardan aynı session'a katılım için bir sonraki aşamada Supabase Realtime bağlanacaktır.

## Interaction'lar

1. **Sistemin Anatomisini Kur** — kavram kartlarını sistem diyagramındaki bölgelere yerleştirme
2. **İlişki Ağını Kur ve Çalıştır** — nedensel ilişkilerde + / − etki belirleme ve davranış simülasyonu
3. **Sistem Sınırını Belirle** — sistem / etkilenebilir çevre / dış çevre sınıflandırması
4. **Sistemi Kur ve Çalıştır** — alt sistemleri doğru akış sırasına koyma ve sipariş token animasyonu

## Lokal çalıştırma

```bash
npm install
npm run dev
```

Tarayıcıda:

- Ana sayfa: `http://localhost:5173/`
- Öğretmen: `http://localhost:5173/teacher`
- Öğrenci katılımı: `http://localhost:5173/join`

### Lokal canlı demo testi

1. `/teacher` sekmesinde **Yeni session oluştur**.
2. Session kodunu kopyala.
3. Aynı tarayıcıda yeni sekmede `/join` aç.
4. Kodu ve bir grup adı gir.
5. Teacher sekmesinden bir interaction başlat.
6. Student sekmesinin otomatik değiştiğini doğrula.
7. Interaction'ı tamamla; puanın teacher leaderboard'una geldiğini gör.

## Üretim mimarisi

```text
PowerPoint / ders anlatımı
        ↓
Teacher Dashboard
        ↓
Session + Active Activity
        ↓
Supabase Realtime
        ↓
Student phones
        ↓
Activity Engine
        ↓
Submission / Score
        ↓
Live Leaderboard
```

## Supabase için planlanan tablolar

- `sessions`
- `participants`
- `submissions`

SQL taslağı `supabase/schema.sql` altında tutulur.

## Ortam değişkenleri

`.env.example` dosyasını `.env.local` olarak kopyalayın:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Sonraki teknik adımlar

- Supabase proje ve RLS politikalarını aktive etmek
- Lokal session adapter'ını Supabase adapter ile değiştirmek
- gerçek QR üretimi
- Interaction 2'yi React Flow node-edge editörüne yükseltmek
- Interaction 3'e mobil uyumlu polygon/sınır çizimi eklemek
- Interaction 4'te hata noktası ve alternatif akış senaryoları eklemek
- Vercel deploy ve sınıf cihazlarıyla yük testi
