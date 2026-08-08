$sourceRoot = ".\@"

if (-Not (Test-Path $sourceRoot)) {
    Write-Host "No @ folder found. Nothing to fix." -ForegroundColor Yellow
    exit
}

Copy-Item -Path "$sourceRoot\*" -Destination ".\src" -Recurse -Force
Remove-Item -Path $sourceRoot -Recurse -Force
Write-Host "Done. Moved into src and cleaned up." -ForegroundColor Green