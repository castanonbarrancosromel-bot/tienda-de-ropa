# ═══════════════════════════════════════════════════════
#  copiar_modelos.ps1
#  Copia TODAS las imágenes del catálogo PoloMamá:
#    · Fotos de modelos (model_polo_*.png)
#    · Fotos de prendas (polo_*.png)
# ═══════════════════════════════════════════════════════

$src  = "C:\Users\ANTHONY\.gemini\antigravity\brain\ce44d119-84d2-482a-a46d-169cda1fd36e"
$dest = "C:\Users\ANTHONY\tienda de ropa\assets\images"

# Crear carpeta destino
New-Item -ItemType Directory -Force -Path $dest | Out-Null
Write-Host ""
Write-Host "══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  PoloMamá — Copiando imágenes del catálogo" -ForegroundColor Cyan
Write-Host "══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# ── Mapa: nombre-origen (sin extensión) → nombre-destino ──
$images = @{
  # Fotos de MODELOS
  "model_polo_floral_1778726483996"    = "model_polo_floral.png"
  "model_polo_corazon_1778726835678"   = "model_polo_corazon.png"
  "model_polo_mariposa_1778726907612"  = "model_polo_mariposa.png"
  "model_polo_amor_1778726978899"      = "model_polo_amor.png"
  "model_polo_rosas_1778727070162"     = "model_polo_rosas.png"
  "model_polo_family_1778727082696"    = "model_polo_family.png"
  # Fotos de PRENDAS
  "polo_floral_1778790053763"          = "polo_floral.png"
  "polo_corazon_1778790094385"         = "polo_corazon.png"
  "polo_mariposa_1778790106577"        = "polo_mariposa.png"
  "polo_amor_1778790147862"            = "polo_amor.png"
  "polo_rosas_1778790418864"           = "polo_rosas.png"
  "polo_family_1778790467920"          = "polo_family.png"
  # LOGO Y BANNER
  "hero_banner_mj_1778803637117"       = "hero_banner_mj.png"
}

$ok   = 0
$fail = 0

foreach ($key in $images.Keys) {
  $srcFile  = Join-Path $src  "$key.png"
  $destFile = Join-Path $dest $images[$key]

  if (Test-Path $srcFile) {
    Copy-Item $srcFile $destFile -Force
    Write-Host "  ✅ $($images[$key])" -ForegroundColor Green
    $ok++
  } else {
    Write-Host "  ⚠️  No encontrado: $key.png" -ForegroundColor Yellow
    $fail++
  }
}

Write-Host ""
Write-Host "══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ✔  $ok imágenes copiadas  |  ✗ $fail no encontradas" -ForegroundColor Cyan
Write-Host "══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Abre index.html en tu navegador y recarga (F5)" -ForegroundColor White
Write-Host "  para ver el catálogo con imágenes reales." -ForegroundColor White
Write-Host ""
