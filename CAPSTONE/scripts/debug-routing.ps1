$ErrorActionPreference = "Stop"

$checks = @(
    @{ Name = "Ingress sandbox health"; Method = "GET"; Url = "http://localhost/api/sandbox/health"; Body = $null },
    @{ Name = "Vite sandbox health"; Method = "GET"; Url = "http://localhost:5173/api/sandbox/health"; Body = $null },
    @{ Name = "Vite project list"; Method = "GET"; Url = "http://localhost:5173/api/sandbox/project"; Body = $null },
    @{ Name = "Vite project create"; Method = "POST"; Url = "http://localhost:5173/api/sandbox/project"; Body = @{ title = "routing-debug" } }
)

foreach ($check in $checks) {
    try {
        $params = @{
            Uri = $check.Url
            Method = $check.Method
            UseBasicParsing = $true
        }

        if ($check.Body) {
            $params.ContentType = "application/json"
            $params.Body = $check.Body | ConvertTo-Json -Compress
        }

        $response = Invoke-WebRequest @params
        Write-Host "[OK] $($check.Name): $($response.StatusCode)" -ForegroundColor Green
    } catch {
        $status = $_.Exception.Response.StatusCode.value__
        Write-Host "[FAIL] $($check.Name): $status $($_.Exception.Message)" -ForegroundColor Red
    }
}
