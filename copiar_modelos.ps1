# ════════════════════════════════════════════
# copiar_modelos.ps1
# Copia las imágenes de modelos generadas al proyecto PoloMamá
# ════════════════════════════════════════════

$srcDir  = "C:\Users\ANTHONY\.gemini\antigravity\brain\ce44d119-84d2-482a-a46d-169cda1fd36e"
$destDir = "C:\Users\ANTHONY\tienda de ropa\assets\images"

# Crear carpeta si no existe
New-Item -ItemType Directory -Force -Path $destDir | Out-Null
Write-Host "📁 Carpeta destino: $destDir"

# Mapa: archivo origen → nombre destino
$files = @{
    "model_polo_floral_1778726483996.png"   = "model_polo_floral.png"
    "model_polo_corazon_1778726835678.png"  = "model_polo_corazon.png"
    "model_polo_mariposa_1778726907612.png" = "model_polo_mariposa.png"
    "model_polo_amor_1778726978899.png"     = "model_polo_amor.png"
    "model_polo_rosas_1778727070162.png"    = "model_polo_rosas.png"
    "model_polo_family_1778727082696.png"   = "model_polo_family.png"
}

$ok = 0
foreach ($src in $files.Keys) {
    $srcPath  = Join-Path $srcDir $src
    $destPath = Join-Path $destDir $files[$src]
    if (Test-Path $srcPath) {
        Copy-Item $srcPath $destPath -Force
        Write-Host "  ✅ $($files[$src])"
        $ok++
    } else {
        Write-Host "  ⚠️  No encontrado: $src" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "══════════════════════════════"
Write-Host "✔ $ok de $($files.Count) imágenes copiadas."
Write-Host "Abre index.html en el navegador para ver el catálogo con slider."
Write-Host "══════════════════════════════"
