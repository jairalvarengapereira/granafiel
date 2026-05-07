# Ponto de Continuação - Granafiel
## Problema Atual
- APK mobile com tela branca
- Saldo não considera despesas pendentes (precisa estar correto)
## Código Fonte (CORRETO - já está no GitHub)
- Commit: ce2d858
- Arquivos: src/pages/Dashboard.tsx e Comparison.tsx
- Lógica: só desconta despesas com status === 'pago'
---
## PASSOS PARA EXECUTAR:
### Passo 1 - Build Web
npm run build
### Passo 2 - Copiar para Android (IMPORTANTE!)
Copy-Item -Path "dist\*" -Destination "Granafiel-Android\app\src\main\assets\public\dist" -Recurse -Force
### Passo 3 - Build APK (SEM clean!)
Set-Location "Granafiel-Android"
$env:JAVA_HOME="C:\Program Files\Java\jdk-21.0.10"
.\gradlew.bat assembleDebug
### Passo 4 - Copiar APK final
Copy-Item "Granafiel-Android\app\build\outputs\apk\debug\app-debug.apk" "Granafiel-Android\Granafiel.apk" -Force
---
## REGRA CRITICA:
- NAO USAR "clean" no gradlew!
- Usar apenas "assembleDebug" (incremental)