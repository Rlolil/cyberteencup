# CyberTalents Teen Cup - Quraşdırma Təlimatları

## 🎯 Sistem Haqqında

CyberTalents Teen Cup kibertəhlükəsizlik müsabiqəsi üçün tam funksional veb tətbiq sistemi. 
Bütün interfeys Azərbaycan dilindədir və yüngül, minimal kibertəma dizayna malikdir.

## 📋 Əsas Xüsusiyyətlər

### Frontend Səhifələr:
- ✅ **Əsas Səhifə** - Hero banner, xüsusiyyətlər, mərhələlər
- ✅ **Komandalar** - Bütün komandaların siyahısı və filtrlər
- ✅ **Komanda Profili** - Detallı komanda məlumatları və nəticələr
- ✅ **Nəticələr** - Lider lövhə (ümumi və mərhələlər üzrə)
- ✅ **Əlaqə** - Əlaqə forması və məlumatlar
- ✅ **Qeydiyyat** - Komanda qeydiyyatı forması
- ✅ **Admin Panel** - Tam idarəetmə paneli

### Backend Funksiyalar:
- ✅ Admin autentifikasiyası
- ✅ Komanda qeydiyyatı və idarəetməsi
- ✅ Komanda üzvlərinin əlavə edilməsi
- ✅ Nəticələrin yenilənməsi (3 mərhələ)
- ✅ Əlaqə mesajlarının saxlanması
- ✅ Statistika və hesabatlar
- ✅ Fayl yükləmə (logo üçün)

### Mərhələlər:
1. **Onlayn Seçim İmtahanı** - 2 saat
2. **Əyani İmtahan** - 2 saat  
3. **Praktiki Yarış** - 3 saat

## 🚀 İlk Admin Hesabı Yaradılması

Admin panelə daxil olmaq üçün ilk admin hesabını yaratmalısınız:

### Üsul 1: API vasitəsilə (Postman, curl və s.)

```bash
POST https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-e5b94f28/admin/signup
Content-Type: application/json
Authorization: Bearer YOUR_ANON_KEY

{
  "email": "admin@cybertalents.az",
  "password": "admin123456",
  "name": "Admin"
}
```

### Üsul 2: Browser Console vasitəsilə

1. Brauzer konsulunu açın (F12)
2. Aşağıdakı kodu yapışdırıb çalışdırın:

```javascript
const projectId = 'YOUR_PROJECT_ID'; // info.tsx faylından
const publicAnonKey = 'YOUR_ANON_KEY'; // info.tsx faylından

fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e5b94f28/admin/signup`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`
  },
  body: JSON.stringify({
    email: 'admin@cybertalents.az',
    password: 'admin123456',
    name: 'Admin İstifadəçi'
  })
})
.then(r => r.json())
.then(data => console.log('Admin yaradıldı:', data))
.catch(err => console.error('Xəta:', err));
```

## 🎮 Admin Panelin İstifadəsi

1. Ana səhifədə **"Admin"** düyməsinə klikləyin
2. Yaratdığınız admin email və şifrə ilə daxil olun
3. Admin paneldə aşağıdakıları edə bilərsiniz:

### Komandalar Tab:
- Komandaları redaktə edin (ad, region, status)
- Komandaları silin
- Status dəyişin: İştirakçı, Seçilib, Finalçı

### Nəticələr Tab:
- Hər komanda üçün 3 mərhələnin nəticələrini daxil edin
- Bal və vaxt əlavə edin
- Ümumi bal avtomatik hesablanır

### Mesajlar Tab:
- Əlaqə formalarından gələn mesajları oxuyun
- Mesajları "oxundu" qeyd edin

### Statistika Tab:
- Ümumi komanda sayı
- Region üzrə bölgü
- Orta bal
- Oxunmamış mesajlar

## 📊 Məlumat Strukturu

### Komanda:
```typescript
{
  id: string
  name: string         // Komanda adı
  region: string       // Bakı, Gəncə, və s.
  email: string        // Giriş üçün
  logo: string | null  // Logo URL
  status: string       // İştirakçı, Seçilib, Finalçı
  createdAt: string
}
```

### Komanda Üzvü:
```typescript
{
  id: string
  teamId: string
  name: string
  age: number | null
  email: string | null
  phone: string | null
}
```

### Nəticələr:
```typescript
{
  teamId: string
  stage1: { score: number, time: number, completed: boolean }
  stage2: { score: number, time: number, completed: boolean }
  stage3: { score: number, time: number, completed: boolean }
  totalScore: number  // Avtomatik hesablanır
}
```

## 🎨 Dizayn Xüsusiyyətləri

- ✅ Yüngül kibertəma
- ✅ Mavi-boz rəng palitrası (#00d4ff, #6ee7ff)
- ✅ Minimal və təmiz interfeys
- ✅ Grid arxaplan naxışları
- ✅ Glow effektləri
- ✅ Animasiyalar
- ✅ Responsive dizayn (mobil, tablet, desktop)

## 🔒 Təhlükəsizlik

- ⚠️ **ÖNƏMLİ:** Bu sistem prototip məqsədlidir
- ⚠️ Real istehsal üçün əlavə təhlükəsizlik tədbirləri lazımdır
- ⚠️ Şəxsi məlumatların toplanması tövsiyə edilmir
- ⚠️ Admin şifrələrini güclü saxlayın

## 🧪 Test Məlumatları

Sistemin test edilməsi üçün:

1. Bir neçə komanda qeydiyyatdan keçirin
2. Admin paneldən nəticələri əlavə edin
3. Lider lövhəni yoxlayın
4. Əlaqə formasını test edin

## 📞 Dəstək

Əlaqə məlumatları (faylda dəyişdirin):
- Email: info@cybertalents.az
- Tel: +994 12 345 67 89
- Ünvan: Bakı, Azərbaycan

## 🎯 Sonrakı Addımlar

1. ✅ Admin hesabı yaradın
2. ✅ Test komandaları əlavə edin
3. ✅ Nəticələri daxil edin
4. ✅ Dizaynı yoxlayın
5. ✅ Mobil responsivelliyi test edin

Uğurlar! 🚀
