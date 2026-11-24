<#
.SYNOPSIS
    Packages the PROJECT_MLP live wallpaper into a production-ready .lively file.
.DESCRIPTION
    Bundles index.html, style.css, app.js, LivelyInfo.json, LivelyProperties.json,
    and the assets directory into PROJECT_MLP.lively (ZIP archive format required by Lively Wallpaper).
#>

[CmdletBinding()]
param (
    [string]$OutputFile = "PROJECT_MLP.lively"
)

$ErrorActionPreference = "Stop"

$rootPath = $PSScriptRoot
if (-not $rootPath) {
    $rootPath = Get-Location
}

$finalPackage = Join-Path $rootPath $OutputFile

Write-Host "==========================================================" -ForegroundColor Magenta
Write-Host " Pinkie Pie & Mane 6 Y2K Wallpaper - Lively Packager v3.0" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Magenta

# Files and folders to bundle
$itemsToBundle = @(
    "index.html",
    "style.css",
    "app.js",
    "LivelyInfo.json",
    "LivelyProperties.json",
    "assets"
)

# Validate all files exist
foreach ($item in $itemsToBundle) {
    $fullPath = Join-Path $rootPath $item
    if (-not (Test-Path $fullPath)) {
        Write-Error "Required packaging item missing: $item"
        exit 1
    }
}

# Clean existing package if present
if (Test-Path $finalPackage) {
    Remove-Item -Path $finalPackage -Force
}

Write-Host "[1/3] Staging files for packaging..." -ForegroundColor Yellow
$tempStageDir = Join-Path $rootPath ".lively_staging"
if (Test-Path $tempStageDir) {
    Remove-Item -Path $tempStageDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempStageDir | Out-Null

try {
    foreach ($item in $itemsToBundle) {
        $sourcePath = Join-Path $rootPath $item
        $destPath = Join-Path $tempStageDir $item
        Copy-Item -Path $sourcePath -Destination $destPath -Recurse -Force
        Write-Host "  + Included: $item" -ForegroundColor Gray
    }

    Write-Host "[2/3] Compressing into .lively package with forward-slash RFC paths..." -ForegroundColor Yellow
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    Add-Type -AssemblyName System.IO.Compression

    $archive = [System.IO.Compression.ZipFile]::Open($finalPackage, [System.IO.Compression.ZipArchiveMode]::Create)
    Get-ChildItem -Path $tempStageDir -Recurse | Where-Object { -not $_.PSIsContainer } | ForEach-Object {
        $relativePath = $_.FullName.Substring($tempStageDir.Length + 1).Replace("\", "/")
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $_.FullName, $relativePath, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
    }
    $archive.Dispose()

    $packageSize = (Get-Item $finalPackage).Length / 1MB
    Write-Host "[3/3] Package created successfully!" -ForegroundColor Green
    Write-Host "  -> Location: $finalPackage" -ForegroundColor White
    Write-Host "  -> Size: $('{0:N2}' -f $packageSize) MB" -ForegroundColor White
    Write-Host "`nTo install: Drag and drop '$OutputFile' directly into the Lively Wallpaper application window!" -ForegroundColor Cyan
}
finally {
    if (Test-Path $tempStageDir) {
        Remove-Item -Path $tempStageDir -Recurse -Force
    }
}
