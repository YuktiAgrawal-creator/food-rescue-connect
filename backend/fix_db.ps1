$pgHbaPath = "C:\Program Files\PostgreSQL\18\data\pg_hba.conf"
$backupPath = "C:\Program Files\PostgreSQL\18\data\pg_hba.conf.bak"
$psqlPath = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
$pgCtlPath = "C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe"
$serviceName = "postgresql-x64-18"

# Backup
Copy-Item -Path $pgHbaPath -Destination $backupPath -Force

# Change to trust
$content = Get-Content $pgHbaPath
$content = $content -replace "scram-sha-256", "trust"
$content = $content -replace "md5", "trust"
Set-Content -Path $pgHbaPath -Value $content

# Restart service
Restart-Service -Name $serviceName -Force
Start-Sleep -Seconds 2

# Reset password to match .env (postgres) and check/create database
& $psqlPath -U postgres -c "ALTER USER postgres PASSWORD 'postgres';"
& $psqlPath -U postgres -c "SELECT 1 FROM pg_database WHERE datname='food_rescue'" | Set-Variable -Name dbExists
if ($dbExists -match "1") {
    Write-Host "Database food_rescue already exists."
} else {
    Write-Host "Creating database food_rescue..."
    & $psqlPath -U postgres -c "CREATE DATABASE food_rescue;"
}

# Restore backup
Copy-Item -Path $backupPath -Destination $pgHbaPath -Force

# Restart service again
Restart-Service -Name $serviceName -Force
Start-Sleep -Seconds 2

Write-Host "Database password reset and service restored."
