# Quickstart Guide: GitHub Pages Deployment

**Feature**: 005-i-want-to  
**Date**: 2025-10-06  
**Audience**: Developers validating the deployment feature  
**Time**: ~20 minutes

## Prerequisites

Before testing, ensure you have:

- ✅ GitHub repository with main branch
- ✅ GitHub Actions enabled (Settings → Actions → Allow all actions)
- ✅ GitHub Pages enabled (Settings → Pages → Source: GitHub Actions)
- ✅ Node.js 20+ LTS installed locally
- ✅ Git configured with push access to repository

## Quick Validation Scenarios

### Scenario 1: First-Time Deployment (Happy Path)

**Goal**: Verify automatic deployment on merge to main branch

**Steps**:

1. **Enable GitHub Pages** (one-time setup):

   ```bash
   # Navigate to repository settings
   # Settings → Pages → Source → Select "GitHub Actions"
   ```

2. **Verify workflow file exists**:

   ```bash
   cat .github/workflows/deploy.yml
   # Should contain: on.push.branches: [main]
   ```

3. **Make a test change**:

   ```bash
   git checkout main
   git pull origin main
   echo "# Test deployment" >> README.md
   git add README.md
   git commit -m "Test: Trigger deployment"
   git push origin main
   ```

4. **Monitor workflow**:

   ```bash
   # Visit: https://github.com/YOUR_USERNAME/YOUR_REPO/actions
   # Expected: New workflow run appears within 10 seconds
   # Expected: Status shows "Building..." then "Deploying..."
   ```

5. **Verify deployment** (wait ~5 minutes):

   ```bash
   # Visit: https://YOUR_USERNAME.github.io/YOUR_REPO/
   # Expected: Site loads with no 404 errors
   # Expected: README change is visible (if shown on homepage)
   ```

**Success Criteria**:

- ✅ Workflow triggers automatically within 10 seconds
- ✅ Build completes in < 10 minutes
- ✅ Deployment URL returns HTTP 200
- ✅ No console errors in browser DevTools

---

### Scenario 2: Client-Side Routing Test

**Goal**: Verify 404.html fallback works for direct URL navigation

**Steps**:

1. **Build and deploy** (follow Scenario 1 if not already deployed)

2. **Test direct navigation to sub-route**:

   ```bash
   # Visit: https://YOUR_USERNAME.github.io/YOUR_REPO/progress
   # Expected: Progress page loads (not GitHub's 404 page)
   ```

3. **Verify routing behavior**:
   - Click a navigation link (e.g., "Knowledge Map" → "/knowledge-map")
   - Copy the URL from address bar
   - Open a new incognito window
   - Paste the URL directly
   - **Expected**: Page loads correctly (not 404)

4. **Check browser console**:

   ```javascript
   // Open DevTools → Console
   // Expected: No "404 Not Found" errors
   // Expected: Router navigates to correct page
   ```

**Success Criteria**:

- ✅ Direct navigation to `/progress` works
- ✅ Direct navigation to `/knowledge-map` works
- ✅ Browser history back/forward works
- ✅ No 404 errors in network tab

---

### Scenario 3: Deployment Failure Handling

**Goal**: Verify graceful failure when build breaks

**Steps**:

1. **Introduce a syntax error**:

   ```bash
   git checkout main
   git checkout -b test-build-failure
   echo "export default function Broken() { return <div>Missing closing tag" > src/app/test.tsx
   git add src/app/test.tsx
   git commit -m "Test: Intentional build failure"
   git push origin test-build-failure
   ```

2. **Create pull request**:
   - Navigate to GitHub repository
   - Create PR from `test-build-failure` → `main`
   - Wait for status checks

3. **Verify failure behavior**:

   ```bash
   # Visit: PR checks section
   # Expected: "build" check shows red X
   # Expected: PR cannot be merged (if branch protection enabled)
   ```

4. **Check deployment status**:

   ```bash
   # Visit: https://YOUR_USERNAME.github.io/YOUR_REPO/
   # Expected: Previous version still accessible
   # Expected: No broken deployment
   ```

5. **Cleanup**:

   ```bash
   git checkout main
   git branch -D test-build-failure
   git push origin --delete test-build-failure
   ```

**Success Criteria**:

- ✅ Build fails with clear error message
- ✅ Deployment does not occur
- ✅ Previous deployment remains live
- ✅ PR is blocked from merging (if branch protection enabled)

---

### Scenario 4: Manual Deployment Trigger

**Goal**: Verify workflow_dispatch allows manual deployments

**Steps**:

1. **Navigate to Actions tab**:

   ```bash
   # Visit: https://github.com/YOUR_USERNAME/YOUR_REPO/actions
   # Click: "Deploy to GitHub Pages" workflow (left sidebar)
   ```

2. **Trigger manual run**:
   - Click "Run workflow" button (top right)
   - Select branch: `main`
   - Click green "Run workflow" button

3. **Monitor execution**:

   ```bash
   # Expected: New workflow run appears immediately
   # Expected: Shows "manually triggered" in run details
   ```

4. **Verify deployment**:

   ```bash
   # Wait ~5 minutes
   # Visit: https://YOUR_USERNAME.github.io/YOUR_REPO/
   # Expected: Site is accessible (re-deployed with same content)
   ```

**Success Criteria**:

- ✅ Manual trigger button is visible
- ✅ Workflow runs successfully
- ✅ Deployment completes without errors
- ✅ No difference from automatic deployment

---

### Scenario 5: Rollback to Previous Version

**Goal**: Verify rollback process when deployment introduces a bug

**Steps**:

1. **Simulate a bad deployment**:

   ```bash
   git checkout main
   echo "console.error('Simulated bug')" >> src/app/layout.tsx
   git add src/app/layout.tsx
   git commit -m "Simulate: Production bug"
   git push origin main
   # Wait ~5 minutes for deployment
   ```

2. **Verify bug is live**:

   ```bash
   # Visit: https://YOUR_USERNAME.github.io/YOUR_REPO/
   # Open DevTools → Console
   # Expected: "Simulated bug" error appears
   ```

3. **Identify commit to rollback**:

   ```bash
   git log --oneline -5
   # Example output:
   # abc1234 Simulate: Production bug
   # def5678 Previous good commit
   ```

4. **Rollback**:

   ```bash
   git revert abc1234
   git push origin main
   # Wait ~8-10 minutes (build + deploy)
   ```

5. **Verify rollback**:

   ```bash
   # Visit: https://YOUR_USERNAME.github.io/YOUR_REPO/
   # Open DevTools → Console
   # Expected: "Simulated bug" error is gone
   ```

**Success Criteria**:

- ✅ Revert commit triggers new deployment
- ✅ Rollback completes in < 15 minutes
- ✅ Previous good version is restored
- ✅ No downtime (old version stays live during rollback)

---

## Common Issues & Troubleshooting

### Issue 1: Workflow not triggering

**Symptoms**: No workflow run appears after push to main

**Diagnosis**:

```bash
# Check workflow file exists
ls -la .github/workflows/deploy.yml

# Check Actions are enabled
# Visit: Settings → Actions → General
# Expected: "Allow all actions" is selected
```

**Solution**:

- Ensure `.github/workflows/deploy.yml` is in main branch
- Enable Actions in repository settings
- Check branch protection rules don't block Actions

---

### Issue 2: 404 on deployed site

**Symptoms**: GitHub Pages URL returns GitHub's 404 page

**Diagnosis**:

```bash
# Check GitHub Pages settings
# Visit: Settings → Pages
# Expected: Source = "GitHub Actions"
# Expected: Shows deployment URL

# Check deployment status
# Visit: Settings → Pages → "Visit site" button
```

**Solution**:

- Wait 5-10 minutes after first deployment
- Verify workflow completed successfully
- Check `basePath` in `next.config.js` matches repository name

---

### Issue 3: Client routing broken (hard refresh 404s)

**Symptoms**: Direct navigation to `/progress` shows GitHub 404

**Diagnosis**:

```bash
# Check if 404.html exists in deployment
curl -I https://YOUR_USERNAME.github.io/YOUR_REPO/404.html
# Expected: HTTP 200 OK

# Check if prepare-static.js ran
# View workflow logs → build job → "Build static site" step
# Expected: "Copying 404/index.html to 404.html"
```

**Solution**:

- Verify `scripts/prepare-static.js` exists
- Ensure `build:static` script runs in workflow
- Check `out/404.html` exists after local build

---

### Issue 4: Build timeout (>10 minutes)

**Symptoms**: Build job exceeds time limit

**Diagnosis**:

```bash
# Check workflow logs for slow steps
# Visit: Actions → Failed run → build job
# Look for steps taking > 5 minutes

# Check dependencies size
du -sh node_modules/
```

**Solution**:

- Verify npm caching is working (check "Restore cache" step)
- Check for unnecessary large dependencies
- Consider splitting build if bundle is huge (>1GB)

---

### Issue 5: Deployment succeeds but site shows old version

**Symptoms**: Changes not visible on deployed site

**Diagnosis**:

```bash
# Check cache headers
curl -I https://YOUR_USERNAME.github.io/YOUR_REPO/
# Look for: Cache-Control header

# Force refresh in browser
# Windows/Linux: Ctrl + Shift + R
# macOS: Cmd + Shift + R
```

**Solution**:

- Hard refresh browser (clear cache)
- Wait 5 minutes for CDN propagation
- Verify workflow deployed correct commit SHA (check logs)

---

## Performance Benchmarks

Based on research.md findings, expected timings:

| Operation | Cached | Cold Start | Acceptable |
|-----------|--------|------------|------------|
| **Full deployment** | 4-5 min | 7-8 min | < 10 min ✅ |
| Checkout code | 5-10 sec | 5-10 sec | < 1 min ✅ |
| Setup Node + cache | ~30 sec | ~2.5 min | < 5 min ✅ |
| npm ci | ~30 sec | ~1.5 min | < 3 min ✅ |
| next build | 2-3 min | 2-3 min | < 5 min ✅ |
| Upload artifact | ~20 sec | ~20 sec | < 1 min ✅ |
| Deploy to Pages | ~30 sec | ~30 sec | < 1 min ✅ |

**If your timings exceed these by 2x**, investigate:

- Large bundle size (check `out/` directory size)
- Slow npm registry (consider npm mirror)
- Slow GitHub Actions runners (retry during off-peak hours)

---

## Next Steps

After validating these scenarios:

1. ✅ **Enable branch protection** (Settings → Branches → main):
   - Require status checks: `build`
   - Prevent direct pushes to main

2. ✅ **Set up Dependabot** (Security → Dependabot):
   - Enable "Dependabot version updates"
   - Add `.github/dependabot.yml` for Actions

3. ✅ **Monitor deployments**:
   - Check Actions tab weekly for failures
   - Review deployment logs for warnings

4. ✅ **Share deployment URL** with stakeholders:
   - URL: `https://YOUR_USERNAME.github.io/YOUR_REPO/`
   - Expected availability: 99.9% (GitHub Pages SLA)

---

**Status**: ✅ Quickstart complete (5 validation scenarios, troubleshooting guide)  
**Time to validate**: ~20 minutes (all scenarios)  
**Next**: Update .github/copilot-instructions.md with deployment context
