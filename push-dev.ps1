param(
    [string]$Message
)

if (-not $Message) {
    $Message = Read-Host "Commit message"
}

if (-not $Message) {
    Write-Host "Commit message is required." -ForegroundColor Red
    exit 1
}

git add -A
git commit -m $Message

if ($LASTEXITCODE -ne 0) {
    Write-Host "Nothing to commit or commit failed." -ForegroundColor Yellow
    exit 0
}

git push origin HEAD:development

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Pushed to development." -ForegroundColor Green
} else {
    Write-Host "Push failed." -ForegroundColor Red
    exit 1
}
