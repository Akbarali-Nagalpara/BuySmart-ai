$headers = @{
    'x-rapidapi-key' = '3a6b3edc5bmsh65a49777c7ad48dp18e59ajsn1c52af95277d'
    'x-rapidapi-host' = 'real-time-amazon-data.p.rapidapi.com'
}

$url = 'https://real-time-amazon-data.p.rapidapi.com/search?query=iphone&page=1&country=IN'

Write-Host "Testing RapidAPI connection..."
Write-Host "URL: $url"
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $url -Headers $headers -Method Get -TimeoutSec 10
    Write-Host "SUCCESS - API is working!"
    Write-Host "Response data:"
    $response | ConvertTo-Json -Depth 3 | Out-String | ForEach-Object { $_.Substring(0, [Math]::Min(1000, $_.Length)) }
} catch {
    Write-Host "FAILED - API call error"
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    }
}
