# 🛡️ CyberTalents Teen Cup - Kibertəhlükəsizlik Müsabiqəsi

Gənclərin kibertəhlükəsizlik bacarıqlarını inkişaf etdirən milli müsabiqə platforması.

## 🌟 Xüsusiyyətlər

### 🎨 Dizayn
- **Yüngül Kibertəma**: Ağ/boz arxaplan, mavi (#00d4ff) aksent rəngləri
- **Minimal İnterfeys**: Təmiz, diqqəti yayındırmayan dizayn
- **Rəqəmsal Naxışlar**: İncə grid arxaplanlar və glow effektləri
- **Tam Responsive**: Mobil, tablet və desktop dəstəyi
- **Azərbaycan Dili**: Bütün interfeys Azərbaycan dilində

### 📄 Səhifələr

#### 1. Əsas Səhifə (`HomePage`)
- Hero banner və müsabiqə adı
- Əsas düymələr: Komandalar, Nəticələr, Əlaqə, Qeydiyyat
- Kibertəma grid arxaplan
- Müsabiqə xüsusiyyətləri və mərhələləri
- Animasiyalı elementlər

#### 2. Komandalar (`TeamsPage`)
- Bütün komandaların siyahısı
- Axtarış və filtrlər (region, status)
- Komanda kartları (ad, logo, region, status)
- Komanda profilinə keçid

#### 3. Komanda Profili (`TeamProfilePage`)
- Komanda banneri və logo
- Üzv siyahısı (ad, yaş, email, telefon)
- Mərhələlər üzrə ballar:
  - Onlayn Seçim İmtahanı (2 saat)
  - Əyani İmtahan (2 saat)
  - Praktiki Yarış (3 saat)
- Status: İştirakçı, Seçilib, Finalçı
- Ümumi bal

#### 4. Nəticələr (`ResultsPage`)
- Lider lövhə layoutu
- Tab sistemli görünüş:
  - Ümumi siyahı
  - Mərhələ 1 nəticələri
  - Mərhələ 2 nəticələri
  - Mərhələ 3 nəticələri
- Reytinq, bal, vaxt, ümumi bal
- Top 3 üçün medal ikonaları

#### 5. Əlaqə (`ContactPage`)
- Əlaqə forması (ad, email, telefon, mesaj)
- Validasiya
- Email, telefon, ünvan məlumatları
- Kibertəma dizayn ikonaları

#### 6. Qeydiyyat (`RegistrationPage`)
- Komanda qeydiyyat forması
- Komanda məlumatları:
  - Komanda adı
  - Region (Bakı, Gəncə, və s.)
  - Email və şifrə
- Üzv məlumatları:
  - Ad, soyad
  - Yaş
  - Email
  - Telefon
- Çoxlu üzv əlavə etmə
- Validasiya və xəta idarəetməsi

#### 7. Admin Panel (`AdminPanel`)
- Admin autentifikasiyası
- 4 əsas tab:
  - **Komandalar**: CRUD əməliyyatları
  - **Nəticələr**: Mərhələ nəticələrini dəyiş
  - **Mesajlar**: Əlaqə mesajları
  - **Statistika**: Analitika və hesabatlar

### 🗄️ Backend API

#### Autentifikasiya
- `POST /admin/signup` - Admin qeydiyyatı
- `POST /team/signup` - Komanda qeydiyyatı
- Supabase Auth inteqrasiyası

#### Komanda İdarəetməsi
- `GET /teams` - Bütün komandalar
- `GET /team/:id` - Komanda detayları
- `POST /admin/team/create` - Komanda yarat (admin)
- `PUT /admin/team/:id` - Komanda yenilə (admin)
- `DELETE /admin/team/:id` - Komanda sil (admin)

#### Üzv İdarəetməsi
- `POST /admin/team/:teamId/member` - Üzv əlavə et (admin)
- `DELETE /admin/team/:teamId/member/:memberId` - Üzv sil (admin)

#### Nəticələr
- `GET /results` - Bütün nəticələr
- `PUT /admin/results/:teamId` - Nəticələri yenilə (admin)

#### Əlaqə
- `POST /contact` - Mesaj göndər
- `GET /admin/messages` - Mesajları gör (admin)
- `PUT /admin/message/:id/read` - Oxundu qeyd et (admin)

#### Statistika
- `GET /admin/stats` - Sistem statistikası (admin)

#### Fayl Yükləmə
- `POST /admin/upload-logo` - Logo yüklə (admin)
- Supabase Storage istifadə olunur

### 🗃️ Məlumat Bazası

#### KV Store Cədvəlləri:
- `team:{id}` - Komanda məlumatları
- `team_member:{teamId}:{memberId}` - Üzv məlumatları
- `results:{teamId}` - Nəticələr (3 mərhələ)
- `admin:{id}` - Admin məlumatları
- `message:{id}` - Əlaqə mesajları

#### Nəticə Strukturu:
```javascript
{
  teamId: string,
  stage1: { score: number, time: number, completed: boolean },
  stage2: { score: number, time: number, completed: boolean },
  stage3: { score: number, time: number, completed: boolean },
  totalScore: number // Avtomatik hesablanır
}
```

### 🎯 Müsabiqə Mərhələləri

1. **Onlayn Seçim İmtahanı**
   - Müddət: 2 saat
   - Nəzəri biliklərin yoxlanılması
   - Onlayn platformada

2. **Əyani İmtahan**
   - Müddət: 2 saat
   - Komanda qərarları
   - Strateji təhlil

3. **Praktiki Yarış**
   - Müddət: 3 saat
   - CTF (Capture The Flag) format
   - Real dünya ssenarilərı

### 🎨 Rəng Palitrası

```css
/* Əsas rənglər */
--color-cyber-blue: #00d4ff
--color-cyber-blue-light: #6ee7ff
--color-cyber-blue-dark: #0099cc

/* Arxaplan */
--color-background: #ffffff
--color-background-secondary: #f9fafb

/* Boz tonlar */
--color-gray-50 to --color-gray-900

/* Glow effektləri */
--shadow-cyber-sm: 0 2px 8px rgba(0, 212, 255, 0.1)
--shadow-cyber: 0 4px 16px rgba(0, 212, 255, 0.15)
--shadow-cyber-lg: 0 8px 32px rgba(0, 212, 255, 0.2)
```

## 📁 Fayl Strukturu

```
/
├── App.tsx                      # Əsas tətbiq komponenti
├── components/
│   ├── Layout.tsx               # Ümumi layout və naviqasiya
│   ├── HomePage.tsx             # Əsas səhifə
│   ├── TeamsPage.tsx            # Komandalar siyahısı
│   ├── TeamProfilePage.tsx      # Komanda profili
│   ├── ResultsPage.tsx          # Nəticələr lövhəsi
│   ├── ContactPage.tsx          # Əlaqə səhifəsi
│   ├── RegistrationPage.tsx     # Qeydiyyat forması
│   ├── AdminLogin.tsx           # Admin girişi
│   ├── AdminPanel.tsx           # Admin panel
│   └── ui/                      # Shadcn UI komponentləri
├── utils/
│   ├── api.tsx                  # API funksiyaları
│   └── supabase/
│       ├── client.tsx           # Supabase client
│       └── info.tsx             # Konfiqurasiya
├── supabase/functions/server/
│   ├── index.tsx                # Backend server
│   └── kv_store.tsx             # KV database utility
├── styles/
│   └── globals.css              # Qlobal stillər və tema
├── SETUP_INSTRUCTIONS.md        # Quraşdırma təlimatı
└── README.md                    # Bu fayl
```

## 🚀 Quraşdırma

Detallı təlimat üçün `SETUP_INSTRUCTIONS.md` faylına baxın.

### Sürətli Başlanğıc:

1. **Admin hesabı yaradın:**
```bash
# API vasitəsilə
POST /make-server-e5b94f28/admin/signup
{
  "email": "admin@cybertalents.az",
  "password": "admin123456",
  "name": "Admin"
}
```

2. **Admin panelə daxil olun:**
   - "Admin" düyməsinə klikləyin
   - Email və şifrə ilə giriş edin

3. **Komandalar əlavə edin:**
   - Qeydiyyat səhifəsindən və ya
   - Admin paneldən əl ilə

4. **Nəticələri əlavə edin:**
   - Admin Panel → Nəticələr
   - Hər mərhələ üçün bal və vaxt daxil edin

## 🔒 Təhlükəsizlik Qeydləri

⚠️ **ÖNƏMLİ:**
- Bu sistem prototip və demo məqsədlidir
- Real istehsal üçün əlavə təhlükəsizlik tədbirləri tələb olunur
- Şəxsi məlumatların toplanması tövsiyə edilmir
- Güclü şifrələr istifadə edin

## 📱 Responsive Dizayn

- **Mobil** (< 640px): Tam funksionallıq
- **Tablet** (640px - 1024px): Optimallaşdırılmış layout
- **Desktop** (> 1024px): Tam görünüş

## 🎯 Texnologiyalar

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS v4.0
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Backend**: Supabase Edge Functions (Deno + Hono)
- **Database**: Supabase KV Store
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage

## 📊 Xüsusiyyətlər

✅ Tam funksional backend  
✅ Autentifikasiya və avtorizasiya  
✅ CRUD əməliyyatları  
✅ Fayl yükləmə  
✅ Real-time məlumat  
✅ Responsive dizayn  
✅ Animasiyalar  
✅ Axtarış və filtrlər  
✅ Statistika və hesabatlar  
✅ Azərbaycan dili dəstəyi  

## 🎨 Dizayn Prinsipləri

- Minimal və təmiz
- Yüngül kibertəma (qaranlıq deyil!)
- İnce rəqəmsal elementlər
- Diqqəti yayındırmayan
- İstifadəçi dostu
- Peşəkar görünüş

## 📞 Əlaqə

- **Email**: info@cybertalents.az
- **Tel**: +994 12 345 67 89
- **Ünvan**: Bakı, Azərbaycan

---

**CyberTalents Teen Cup** - Gələcəyin kibertəhlükəsizlik mütəxəssislərini yetişdirir! 🚀
