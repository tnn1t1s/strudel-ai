# Strudel AI - AI EDM Composition Environment

This is a fork of Strudel (https://strudel.cc/), a Tidal-based live coding environment for music, being developed into an AI-powered EDM composition tool.

## Project Overview
- **Base**: Strudel - web-based live coding environment for algorithmic music
- **Goal**: Transform into AI-assisted electronic dance music composition platform
- **Language**: JavaScript/TypeScript, uses Tidal Cycles pattern language

## ⚠️ CRITICAL: Fork Isolation Strategy

**Strudel is a VERY ACTIVE PROJECT** - 8+ commits daily. Must carefully isolate Strudel-AI changes:

### Branch Strategy
- **NEVER modify core Strudel files directly** unless absolutely necessary
- Create new files in dedicated AI directories: `src/repl/ai/`, `src/ai/`
- Isolate AI features as additive components, not modifications
- Maintain clear separation between Strudel core and AI additions

### File Organization
- AI components: `website/src/repl/ai/` 
- AI contexts: `context/`
- Training data: `training/`
- Keep AI-specific files in clearly marked directories

### Issue Labeling
- `strudel` label: Issues suitable for upstream contribution
- `strudel-ai` label: AI-specific features that won't go upstream
- `upstream-candidate` label: Potential contributions to main Strudel

### Merge Strategy
- **Regularly pull from upstream** to stay current
- **Minimize merge conflicts** by avoiding core file modifications
- **Document any core changes** thoroughly for upstream consideration
- **Test compatibility** after each upstream merge

### Code Isolation Principles
- Extend existing components rather than modify them
- Use composition over modification
- Add new UI panels/tabs rather than changing existing ones
- Keep AI features as optional overlays on core Strudel functionality

## 🔧 Build-Time Config Management

**CRITICAL**: Use build-time file swapping instead of conditional logic for configuration.

### File Structure
```
website/src/
├── config.ts          # Active config (overwritten at build time)
├── original-config.ts  # Original Strudel config (backup)
└── ai-config.ts        # AI-specific config (source)
```

### Build Scripts
- `pnpm dev` → Original Strudel mode
- `pnpm dev:ai` → AI mode (swaps config first)
- `pnpm build:ai` → AI production build
- `pnpm config:reset` → Restore original config

### Benefits
- ✅ Zero runtime conditionals
- ✅ Single source of truth per build
- ✅ Clean upstream merge compatibility
- ✅ Easy consistency management with diffs

### Pattern for Other Files
Extend this pattern to any file needing AI-specific modifications:
1. Create `original-*.ext` backup
2. Create `ai-*.ext` AI version  
3. Copy appropriate version at build time
4. Never modify the active file directly

### Astro Conventions
**CRITICAL**: Stick with Astro standards, don't reinvent things:
- Use `import.meta.env.SITE.title` not custom imports for site config
- Follow existing Astro patterns for environment variables and config access
- Check how other components access shared data before creating new patterns
- When in doubt, use Astro's built-in mechanisms over custom solutions

## Development Environment
- Use Python by sourcing `venv/bin/activate` for any Python components
- Main codebase is JavaScript/TypeScript based on Strudel
- OpenAI API keys available via `source ~/.bashrc`
- Always create PR for user with `gh pr create`
- **NEVER EVER USE CONDITIONAL HANDLING - Always plan for the working path**

## Visual Layout Problems: Logic-First Approach
- **Frame all visual layout problems as logic problems**
- Seek all information and context you can collect before acting
- Read ALL related component files completely for pattern matching
- Present recommendation to user before proceeding with changes
- Don't blame "visual constraints" - analyze code systematically

## Key Areas for AI Enhancement
- Pattern generation and suggestion
- Sample selection and arrangement
- Beat and rhythm composition
- Harmonic progression generation
- Real-time performance assistance
- Style transfer and genre adaptation

## Code Conventions
- Follow existing Strudel patterns and conventions
- Maintain compatibility with Tidal Cycles syntax where possible
- Preserve live coding workflow while adding AI capabilities

## Testing
- Check package.json for available test scripts
- Run linting and type checking before commits

## Important Notes
- This is experimental AI music composition software
- Maintain the interactive, real-time nature of the original Strudel
- Focus on enhancing creative workflow, not replacing musician input