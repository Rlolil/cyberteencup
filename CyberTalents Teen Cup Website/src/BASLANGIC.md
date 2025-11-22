# 🚀 Sürətli Başlanğıc - CyberTalents Teen Cup

Sistemə xoş gəlmisiniz! Bu təlimat sizə sistemin işə salınması üçün lazım olan addımları göstərir.

## 📋 Addım-addım Təlimat

### 1️⃣ İlk Admin Hesabını Yaradın

Sistem ilk dəfə açılanda admin hesabı yoxdur. Yaratmaq üçün iki üsul var:

#### Üsul A: Browser Console (Ən Asan)

1. Browser açın və F12 basın (Console açılacaq)
2. Aşağıdakı kodu kopyalayıb Console-a yapışdırın:

```javascript
// Əvvəlcə project məlumatlarını əldə edin
const projectId = 'YOUR_PROJECT_ID'; // /utils/supabase/info.tsx faylından
const publicAnonKey = 'YOUR_ANON_KEY'; // /utils/supabase/info.tsx faylından

// Admin yaradın
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
.then(data => {
  console.log('✅ Admin uğurla yaradıldı!', data);
  alert('Admin yaradıldı! Email: admin@cybertalents.az, Şifrə: admin123456');
})
.catch(err => {
  console.error('❌ Xəta:', err);
  alert('Xəta baş verdi: ' + err.message);
});
```

3. Enter basın və nəticəni gözləyin
4. Uğurlu mesaj gördükdən sonra səhifəni yeniləyin

#### Üsul B: Postman və ya Curl

```bash
curl -X POST \
  https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-e5b94f28/admin/signup \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -d '{
    "email": "admin@cybertalents.az",
    "password": "admin123456",
    "name": "Admin İstifadəçi"
  }'
```

### 2️⃣ Admin Panelə Daxil Olun

1. Ana səhifədə sağ yuxarı küncdə **"Admin"** düyməsinə klikləyin
2. Giriş məlumatlarınızı daxil edin:
   - Email: `admin@cybertalents.az`
   - Şifrə: `admin123456`
3. **"Daxil Ol"** düyməsinə basın

### 3️⃣ Test Komandası Əlavə Edin

İki üsulla komanda əlavə edə bilərsiniz:

#### A. Qeydiyyat Səhifəsindən (İstifadəçi perspektivi):

1. Ana səhifədə **"Qeydiyyat"** düyməsinə klikləyin
2. Formanı doldurun:
   - **Komanda Adı**: CyberHawks
   - **Region**: Bakı
   - **Email**: cyberhawks@test.az
   - **Şifrə**: test123456
   - **Şifrə Təkrarı**: test123456
3. Komanda üzvlərini əlavə edin:
   - **Ad, Soyad**: Rəşad Məmmədov
   - **Yaş**: 16
   - **Email**: reshad@test.az
   - **Telefon**: +994 50 123 45 67
4. **"Qeydiyyatdan Keç"** düyməsinə basın

#### B. Admin Paneldən (Admin perspektivi):

1. Admin Panel → **"Komandalar"** tab
2. Komanda məlumatlarını redaktə edin
3. Statusu dəyişin: **Seçilib** və ya **Finalçı**

### 4️⃣ Nəticələri Əlavə Edin

1. Admin Panel → **"Nəticələr"** tab
2. Komanda seçin və **"Redaktə Et"** düyməsinə basın
3. Hər mərhələ üçün balları daxil edin:
   - **Mərhələ 1**: Bal: 85, Vaxt: 110
   - **Mərhələ 2**: Bal: 90, Vaxt: 115
   - **Mərhələ 3**: Bal: 95, Vaxt: 160
4. **"Yadda Saxla"** düyməsinə basın
5. Ümumi bal avtomatik hesablanacaq: **270 bal**

### 5️⃣ Nəticələrə Baxın

1. Ana səhifədə **"Nəticələr"** düyməsinə klikləyin
2. Lider lövhəni görün
3. Mərhələlər arasında keçid edin:
   - Ümumi Siyahı
   - Onlayn Seçim İmtahanı
   - Əyani İmtahan
   - Praktiki Yarış

## 🎯 Əsas Səhifələr

### 📱 İstifadəçilər üçün:

- **Əsas Səhifə**: Müsabiqə haqqında ümumi məlumat
- **Komandalar**: Bütün komandaların siyahısı və axtarış
- **Nəticələr**: Lider lövhə və mərhələ nəticələri
- **Əlaqə**: Bizimlə əlaqə forması
- **Qeydiyyat**: Komanda qeydiyyatı

### 🔐 Adminlər üçün:

- **Komandalar**: Komandaları idarə edin (CRUD)
- **Nəticələr**: Mərhələ nəticələrini daxil edin
- **Mesajlar**: Əlaqə mesajlarına baxın
- **Statistika**: Analitika və hesabatlar

## 💡 Faydalı Məsləhətlər

### Komanda Qeydiyyatı:
- Ən azı 1 üzv əlavə etmək məcburidir
- Email və şifrə giriş üçün istifadə olunur
- Logo yükləmək ixtiyaridir

### Nəticələr:
- Hər mərhələ üçün ayrıca bal və vaxt daxil edin
- Ümumi bal avtomatik hesablanır
- Tamamlanmamış mərhələlər "—" kimi göstərilir

### Admin Panel:
- Admin yalnız autentifikasiya ilə daxil ola bilər
- Bütün dəyişikliklər dərhal yadda saxlanır
- Mesajları "oxundu" qeyd etməyi unutmayın

## 🔄 Demo Məlumatlar

Daha çox test məlumatı üçün `DEMO_DATA.md` faylına baxın. Orada:
- 6 nümunə komanda
- Hər komanda üçün nəticələr
- Əlaqə mesajları
- Region və status bölgüsü

## ❗ Ümumi Problemlər

### Problem: "Unauthorized" xətası
**Həll**: Admin hesabından çıxıb yenidən daxil olun

### Problem: Komanda görünmür
**Həll**: Səhifəni yeniləyin (F5)

### Problem: Nəticələr yenilənmir
**Həll**: Admin paneldən "Yadda Saxla" düyməsinə basdığınızdan əmin olun

### Problem: Logo yüklənmir
**Həll**: Fayl ölçüsünün 2MB-dan kiçik olduğundan əmin olun

## 📊 Sistem Məlumatları

- **Mərhələlər**: 3 mərhələ (2h, 2h, 3h)
- **Statuslar**: İştirakçı, Seçilib, Finalçı
- **Regionlar**: 14 region (Bakı, Gəncə, və s.)
- **Dil**: Azərbaycan dili

## 🎨 İnterfeys

- Yüngül kibertəma dizayn
- Mavi (#00d4ff) aksent rəngləri
- Responsive (mobil, tablet, desktop)
- Animasiyalı keçidlər

## 📞 Kömək Lazımdır?

1. `README.md` - Tam sistem dokumentasiyası
2. `SETUP_INSTRUCTIONS.md` - Ətraflı quraşdırma
3. `DEMO_DATA.md` - Test məlumatları

## ✅ Yoxlama Siyahısı

İlk dəfə işə salarkən:

- [ ] Admin hesabı yaradıldı
- [ ] Admin panelə daxil olundu
- [ ] Test komandası əlavə edildi
- [ ] Nəticələr daxil edildi
- [ ] Lider lövhə yoxlandı
- [ ] Əlaqə forması test edildi
- [ ] Mobil görünüş yoxlandı

Hamısını bitirdikdən sonra sistem istifadəyə hazırdır! 🎉

---

**Uğurlar!** Müsabiqəniz uğurlu keçsin! 🚀
