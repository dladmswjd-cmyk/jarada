# ══════════════════════════════════════════════════════════
#  자라다(Jarada) 로컬 서버
#
#  [언제 쓰나요?]
#  파일을 그냥 더블클릭(file://)해도 대부분 잘 동작합니다.
#  그런데 학부모 탭에서 하트를 보냈는데 학생 탭에 안 뜬다면,
#  브라우저가 file:// 끼리의 통신을 막고 있는 것입니다.
#  그럴 때 이 파일을 실행하세요.
#
#  [실행 방법]
#  이 파일을 오른쪽 클릭 → "PowerShell에서 실행"
#  (또는 PowerShell 창에서:  .\서버켜기.ps1  )
#
#  [끄는 방법]
#  이 창에서 Ctrl + C
# ══════════════════════════════════════════════════════════

$port = 8000
$root = $PSScriptRoot
$url  = "http://localhost:$port/"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)

try {
    $listener.Start()
} catch {
    Write-Host ""
    Write-Host "❌ 서버를 켜지 못했습니다: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   $port 번 포트를 이미 다른 프로그램이 쓰고 있을 수 있습니다." -ForegroundColor Yellow
    Write-Host "   이 파일 위쪽의 `$port 값을 8001 등으로 바꿔보세요." -ForegroundColor Yellow
    Read-Host "`n엔터를 누르면 닫힙니다"
    exit 1
}

Write-Host ""
Write-Host "  🌱 자라다 서버가 켜졌습니다" -ForegroundColor Green
Write-Host ""
Write-Host "  시작 페이지 : $url" -ForegroundColor Cyan
Write-Host "  학생용      : ${url}student.html" -ForegroundColor Cyan
Write-Host "  학부모용    : ${url}parent.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "  ⚠️ 이 창을 닫으면 서버도 꺼집니다. 끄려면 Ctrl + C" -ForegroundColor DarkGray
Write-Host ""

Start-Process $url

# 확장자별 Content-Type (이게 맞아야 브라우저가 JS/CSS를 제대로 읽습니다)
$types = @{
    '.html' = 'text/html; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.md'   = 'text/plain; charset=utf-8'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.svg'  = 'image/svg+xml'
    '.ico'  = 'image/x-icon'
}

try {
    while ($listener.IsListening) {
        $ctx  = $listener.GetContext()
        $path = [System.Uri]::UnescapeDataString($ctx.Request.Url.LocalPath).TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($path)) { $path = 'index.html' }

        $file = Join-Path $root $path

        # 폴더 밖 파일을 요청하는 것을 막습니다 (../../ 같은 경로)
        $full = [System.IO.Path]::GetFullPath($file)
        $safe = $full.StartsWith([System.IO.Path]::GetFullPath($root), [StringComparison]::OrdinalIgnoreCase)

        if ($safe -and (Test-Path $file -PathType Leaf)) {
            $bytes = [System.IO.File]::ReadAllBytes($file)
            $ext   = [System.IO.Path]::GetExtension($file).ToLower()
            $ctype = $types[$ext]
            if (-not $ctype) { $ctype = 'application/octet-stream' }

            $ctx.Response.ContentType     = $ctype
            $ctx.Response.ContentLength64 = $bytes.Length
            $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
            Write-Host ("  200  " + $path) -ForegroundColor DarkGray
        } else {
            $ctx.Response.StatusCode = 404
            Write-Host ("  404  " + $path) -ForegroundColor DarkYellow
        }

        $ctx.Response.Close()
    }
} finally {
    $listener.Stop()
    Write-Host "`n  서버를 껐습니다." -ForegroundColor DarkGray
}
