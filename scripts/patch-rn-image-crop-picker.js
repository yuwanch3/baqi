/*
 * Patch otomatis untuk react-native-image-crop-picker@0.33.4
 *
 * Masalah: library versi ini mewajibkan permission WRITE_EXTERNAL_STORAGE
 * pada openCamera() dan openPicker(). Di Android 11+ (targetSdk >= 30,
 * terutama Android 13) permission tsb TIDAK BISA di-grant, sehingga
 * checkSelfPermission() selalu DENIED -> library reject
 * "Required permission missing" -> ubah foto profil (kamera & galeri) gagal.
 *
 * Fix: samakan dengan perbaikan resmi upstream (v0.34+) -> buang
 * WRITE_EXTERNAL_STORAGE dari daftar permission yang diminta saat Android 11+.
 * Setelah itu:
 *   - Kamera hanya butuh izin CAMERA (bisa di-grant).
 *   - Galeri memakai system picker (ACTION_GET_CONTENT) yang tidak butuh izin.
 *
 * Script ini idempoten & aman: kalau node_modules belum ada atau versi library
 * berubah sehingga pola tidak ketemu, script cukup memberi peringatan dan
 * tidak menggagalkan `npm install`.
 */
const fs = require('fs');
const path = require('path');

const target = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-image-crop-picker',
  'android',
  'src',
  'main',
  'java',
  'com',
  'reactnative',
  'ivpusic',
  'imagepicker',
  'PickerModule.java'
);

const OLD_BLOCK = [
  '        List<String> missingPermissions = new ArrayList<>();',
  '',
  '        for (String permission : requiredPermissions) {',
  '            int status = ActivityCompat.checkSelfPermission(activity, permission);',
  '            if (status != PackageManager.PERMISSION_GRANTED) {',
  '                missingPermissions.add(permission);',
  '            }',
  '        }',
].join('\n');

const NEW_BLOCK = [
  '        List<String> missingPermissions = new ArrayList<>();',
  '        List<String> supportedPermissions = new ArrayList<>(requiredPermissions);',
  '',
  '        // android 11 introduced scoped storage, and WRITE_EXTERNAL_STORAGE no longer works there',
  '        if (Build.VERSION.SDK_INT > Build.VERSION_CODES.Q) {',
  '            supportedPermissions.remove(Manifest.permission.WRITE_EXTERNAL_STORAGE);',
  '        }',
  '',
  '        for (String permission : supportedPermissions) {',
  '            int status = ActivityCompat.checkSelfPermission(activity, permission);',
  '            if (status != PackageManager.PERMISSION_GRANTED) {',
  '                missingPermissions.add(permission);',
  '            }',
  '        }',
].join('\n');

function main() {
  if (!fs.existsSync(target)) {
    console.log('[patch-image-crop-picker] dilewati: node_modules/react-native-image-crop-picker belum ada.');
    return;
  }

  const src = fs.readFileSync(target, 'utf8');

  if (src.includes('supportedPermissions')) {
    console.log('[patch-image-crop-picker] sudah ter-patch, tidak ada yang dilakukan.');
    return;
  }

  if (!src.includes(OLD_BLOCK)) {
    console.warn('[patch-image-crop-picker] PERINGATAN: pola tidak ditemukan (versi library berubah?). Patch TIDAK diterapkan.');
    return;
  }

  fs.writeFileSync(target, src.replace(OLD_BLOCK, NEW_BLOCK), 'utf8');
  console.log('[patch-image-crop-picker] berhasil: WRITE_EXTERNAL_STORAGE dibuang untuk Android 11+.');
}

main();
