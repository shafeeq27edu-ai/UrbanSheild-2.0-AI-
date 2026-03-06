# Bug Fix Tracker

## Build Errors Found (Next.js)

1. **Unescaped Entities in simulations page**
   - **File:** `./src/app/simulations/page.tsx`
   - **Lines:** 23:88
   - **Context:** `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.

2. **Unescaped Entities in HistoricalSimulations component**
   - **File:** `./src/components/HistoricalSimulations.tsx`
   - **Lines:** 60:102, 60:134
   - **Context:** `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.

3. **Missing Dependencies in useEffect**
   - **File:** `./src/components/map/UrbanMap.tsx`
   - **Lines:** 101:8
   - **Context:** React Hook useEffect has missing dependencies: `center`, `onMapClick`, and `riskLevel`. Either include them or remove the dependency array.

## Action Plan
- [ ] Fix unescaped entities in `src/app/simulations/page.tsx`
- [ ] Fix unescaped entities in `src/components/HistoricalSimulations.tsx`
- [ ] Resolve missing dependencies for `useEffect` in `src/components/map/UrbanMap.tsx`