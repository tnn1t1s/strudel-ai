# Open Source Contribution Workflow

This document outlines the workflow for maintaining Strudel-AI as a specialized fork while contributing back to the upstream Strudel project.

## Fork Strategy Overview

Strudel-AI maintains a "specialized enhancement layer" on top of core Strudel:
- **Upstream**: tidalcycles/strudel (original project)
- **Our Fork**: tnn1t1s/strudel-ai (AI-enhanced version)
- **Current Status**: 17 commits ahead, 0 commits behind ✅

## Daily Upstream Sync Workflow

Keep your fork current with upstream changes:

```bash
# 1. Fetch latest upstream changes
git fetch https://github.com/tidalcycles/strudel.git main:upstream-main

# 2. Merge upstream into your main branch
git checkout main
git merge upstream-main

# 3. Resolve any conflicts (should be minimal due to isolation strategy)
# 4. Push to your fork
git push origin main
```

**Expected Result**: Stays 0 commits behind, commits ahead increases with your new features.

## Contributing Back to Upstream

When you have commits that would benefit the broader Strudel community:

### 1. Create a Clean Branch from Upstream

```bash
git checkout -b feature-for-upstream upstream-main
```

### 2. Cherry-Pick Specific Commits

```bash
# Pick individual commits that are suitable for upstream
git cherry-pick <commit-hash>

# For multiple commits:
git cherry-pick <commit-1> <commit-2> <commit-3>
```

### 3. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature-for-upstream

# Create PR to tidalcycles/strudel using GitHub CLI or web interface
gh pr create --repo tidalcycles/strudel --title "Your Feature Title" --body "Description"
```

## What to Contribute Upstream

### ✅ Good Candidates for Upstream
- **Bug fixes**: Core functionality improvements
- **Performance optimizations**: General speed/memory improvements  
- **Documentation updates**: Non-AI specific docs
- **General UX improvements**: Broadly useful features
- **Test additions**: Core functionality testing
- **Build system improvements**: Non-AI specific tooling

### ❌ Keep in Your Fork
- **AI-specific features**: Chat interface, AI providers, etc.
- **AI configuration**: Settings, API keys, AI-related UI
- **AI dependencies**: LangChain, AI provider packages
- **Strudel-AI branding**: Logos, names, AI-specific copy
- **AI build scripts**: AI-specific dev/build commands

## Fork Isolation Benefits

Our isolation strategy makes this workflow smooth:

1. **Minimal merge conflicts**: Build-time swapping keeps changes isolated
2. **Clean cherry-picking**: Non-AI commits are easy to identify and extract
3. **Upstream compatibility**: Regular merges keep us current
4. **Selective contribution**: Can contribute valuable improvements without AI complexity

## Example Contribution Workflow

```bash
# You fixed a bug in the pattern parser (commit abc123)
git checkout -b fix-pattern-parser upstream-main
git cherry-pick abc123

# Clean up commit message if needed
git commit --amend

# Push and create PR
git push origin fix-pattern-parser
gh pr create --repo tidalcycles/strudel --title "Fix pattern parsing edge case"
```

## Monitoring Fork Health

**Healthy fork metrics:**
- ✅ **0 commits behind**: You're current with upstream
- ✅ **N commits ahead**: Your enhancement layer is growing
- ✅ **Clean merges**: Isolation strategy prevents conflicts
- ✅ **Regular syncs**: Daily/weekly upstream integration

**Warning signs:**
- ❌ **Commits behind**: Need to sync upstream
- ❌ **Merge conflicts**: Isolation strategy may need adjustment
- ❌ **Stale fork**: Haven't synced in weeks/months

## Benefits of This Approach

1. **Community Contribution**: Give back useful improvements to Strudel
2. **Reputation Building**: Establish yourself as a valuable contributor
3. **Upstream Awareness**: Stay connected with project direction
4. **Code Quality**: Upstream review improves your code
5. **Feature Parity**: Ensure AI features work with latest Strudel

This workflow enables you to maintain a specialized AI fork while being a good open source citizen and contributing back to the broader community.