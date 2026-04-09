# تأهّب - Offline Emergency Relay MVP

MVP هاكاثون كامل يتكوّن من:

- `mobile`: تطبيق Expo + React Native + TypeScript
- `server`: خادم Express + TypeScript
- `dashboard`: لوحة متابعة React + Vite

## الفكرة

ينشئ المستخدم بلاغ طوارئ حتى عند انقطاع الإنترنت، ثم يُخزَّن محليًا ويُمرَّر بين أجهزة قريبة ضمن Mesh simulation، ثم يُرفع إلى الخادم لاحقًا عند توفر الاتصال.

## بنية المشروع

```text
.
├─ mobile/
├─ server/
└─ dashboard/
```

## التثبيت

من الجذر:

```powershell
npm.cmd install
```

## تشغيل الخادم

```powershell
cd server
npm.cmd run dev
```

الخادم يعمل افتراضيًا على:

```text
http://localhost:4000
```

## تشغيل لوحة التحكم

```powershell
cd dashboard
Copy-Item .env.example .env -Force
npm.cmd install
npm.cmd run dev
```

تعمل افتراضيًا على:

```text
http://localhost:5173
```

## تشغيل تطبيق الجوال

```powershell
cd mobile
Copy-Item .env.example .env -Force
npm.cmd install
npm.cmd run start
```

إذا كنت تستخدم جهازًا فعليًا مع Expo، عدّل المتغير التالي داخل `mobile/.env` إلى عنوان IP المحلي للخادم:

```text
EXPO_PUBLIC_API_BASE_URL=http://YOUR_LOCAL_IP:4000
```

وللوحة التحكم:

```text
VITE_API_BASE_URL=http://localhost:4000
```

## سيناريو العرض

1. افتح التطبيق من `mobile`
2. اجعل حالة الشبكة "غير متصل" من الصفحة الرئيسية
3. أنشئ بلاغًا من شاشة الإنشاء
4. من شاشة الحالة اضغط:
   - `بدء البحث عن أجهزة قريبة`
   - `محاكاة العثور على جهاز`
   - `تمرير البلاغ`
5. اضغط `محاكاة وجود إنترنت`
6. اضغط `رفع البلاغ للسيرفر`
7. افتح `dashboard` وستجد البلاغ داخل غرفة العمليات

## أبرز الملفات

- [mobile/App.tsx](/c:/Users/mohlb/Downloads/TAAHAB/mobile/App.tsx)
- [mobile/src/services/alertService.ts](/c:/Users/mohlb/Downloads/TAAHAB/mobile/src/services/alertService.ts)
- [mobile/src/services/meshService.ts](/c:/Users/mohlb/Downloads/TAAHAB/mobile/src/services/meshService.ts)
- [mobile/src/services/syncService.ts](/c:/Users/mohlb/Downloads/TAAHAB/mobile/src/services/syncService.ts)
- [server/server.ts](/c:/Users/mohlb/Downloads/TAAHAB/server/server.ts)
- [server/controllers/alertsController.ts](/c:/Users/mohlb/Downloads/TAAHAB/server/controllers/alertsController.ts)
- [dashboard/src/App.tsx](/c:/Users/mohlb/Downloads/TAAHAB/dashboard/src/App.tsx)
