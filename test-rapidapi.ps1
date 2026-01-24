$headers = @{
    'x-rapidapi-key' = '3a6b3edc5bmsh65a49777c7ad48dp18e59ajsn1c52af95277d'
    'x-rapidapi-host' = 'real-time-amazon-data.p.rapidapi.com'
}

$url = 'https://real-time-amazon-data.p.rapidapi.com/search?query=iphone&page=1&country=IN'

Write-Host "Testing RapidAPI connection..."
Write-Host "URL: $url"
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri $url -Headers $headers -Method Get -TimeoutSec 10 -UseBasicParsing
    Write-Host "✓ SUCCESS!"
    Write-Host "Status Code: $($response.StatusCode)"
    Write-Host ""
    Write-Host "Response (first 1000 chars):"
    $contentLength = [Math]::Min(1000, $response.Content.Length)
    Write-Host $response.Content.Substring(0, $contentLength)
} catch {
    Write-Host "✗ FAILED!"
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $reader.BaseStream.Position = 0
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response Body: $responseBody"
        } catch {
            Write-Host "Could not read response body"
        }
    }
}
