# Vercel Auto Deploy (Cocos 3.8.8)

## Why this pipeline
Vercel build machines do not include Cocos Creator 3.8.8.  
This project uses a GitHub Actions Windows self-hosted runner to build `web-mobile`, then deploys that output to Vercel automatically.

## 1. Prepare self-hosted runner (Windows)
1. Install Cocos Creator 3.8.8.
2. In GitHub repo settings, create a self-hosted runner on this Windows machine.
3. Add labels: `windows`, `cocos`.

## 2. Configure GitHub Secrets
Set these in `Settings -> Secrets and variables -> Actions`:

- `COCOS_CREATOR_EXE`
  - Example: `C:\Program Files\Cocos\Creator\3.8.8\CocosCreator.exe`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## 3. First Vercel link (one-time on local machine)
Run once in project root:

```bash
vercel link
```

This generates `.vercel/project.json` locally so you can copy `ORG_ID/PROJECT_ID` into GitHub secrets.

## 4. Auto flow
Push to `master`:

1. GitHub Action builds Cocos output to `build/web-mobile`
2. Action deploys to Vercel production

Workflow file:
- `.github/workflows/deploy-vercel.yml`

## 5. Local build command
```bash
npm run build:web-mobile
```

If Cocos path is not default, set env:
```bash
set COCOS_CREATOR_EXE=C:\Path\To\CocosCreator.exe
```
