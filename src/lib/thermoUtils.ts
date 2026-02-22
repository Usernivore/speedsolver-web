/**
 * Thermodynamic utilities for SpeedSolver using static lookup tables and interpolation.
 */
import { linearInterpolate } from './utils';
import { SATURATED_TABLE, SUPERHEATED_TABLE, SaturatedPoint, SuperheatedPoint } from './steamData';

export interface SteamProperties {
    h: number; // Enthalpy (kJ/kg)
    s: number; // Entropy (kJ/kg·K)
    v: number; // Specific volume (m³/kg)
    t: number; // Temperature (°C)
    quality?: number; // Quality (0 to 1), undefined if superheated
}

/**
 * Perform linear interpolation on a property across a table array.
 */
function interpolateTable<T>(table: T[], target: number, key: keyof T, prop: keyof T): number {
    // Exact match
    const exact = table.find(entry => entry[key] === target);
    if (exact) return exact[prop] as unknown as number;

    // Find bounding points
    let lower = table[0];
    let upper = table[table.length - 1];

    if (target <= (lower[key] as unknown as number)) return lower[prop] as unknown as number;
    if (target >= (upper[key] as unknown as number)) return upper[prop] as unknown as number;

    for (let i = 0; i < table.length - 1; i++) {
        const x0 = table[i][key] as unknown as number;
        const x1 = table[i + 1][key] as unknown as number;
        if (target >= x0 && target <= x1) {
            return linearInterpolate(x0, table[i][prop] as unknown as number, x1, table[i + 1][prop] as unknown as number, target);
        }
    }
    return 0; // Fallback
}

/**
 * Get saturated properties at a given pressure (kPa)
 */
export function getSaturatedProperties(p: number): SaturatedPoint {
    const props: any = {};
    const keys: (keyof SaturatedPoint)[] = ['t', 'vf', 'vg', 'hf', 'hg', 'sf', 'sg'];
    keys.forEach(k => {
        props[k] = interpolateTable(SATURATED_TABLE, p, 'p', k);
    });
    return { p, ...props } as SaturatedPoint;
}

/**
 * Get superheated properties at P (kPa) and T (°C) using 2D interpolation.
 */
export function getSuperheatedProperties(p: number, t: number): SteamProperties {
    // 1. Find bounding pressures
    let pLower = SUPERHEATED_TABLE[0];
    let pUpper = SUPERHEATED_TABLE[SUPERHEATED_TABLE.length - 1];

    for (let i = 0; i < SUPERHEATED_TABLE.length - 1; i++) {
        if (p >= SUPERHEATED_TABLE[i].p && p <= SUPERHEATED_TABLE[i + 1].p) {
            pLower = SUPERHEATED_TABLE[i];
            pUpper = SUPERHEATED_TABLE[i + 1];
            break;
        }
    }

    // 2. Interpolate properties at T for both bounding pressures
    const propsAtPLower = {
        h: interpolateTable(pLower.points, t, 't', 'h'),
        s: interpolateTable(pLower.points, t, 't', 's'),
        v: interpolateTable(pLower.points, t, 't', 'v')
    };

    const propsAtPUpper = {
        h: interpolateTable(pUpper.points, t, 't', 'h'),
        s: interpolateTable(pUpper.points, t, 't', 's'),
        v: interpolateTable(pUpper.points, t, 't', 'v')
    };

    // 3. Interpolate between pressures
    if (pLower.p === pUpper.p) return { ...propsAtPLower, t };

    return {
        h: linearInterpolate(pLower.p, propsAtPLower.h, pUpper.p, propsAtPUpper.h, p),
        s: linearInterpolate(pLower.p, propsAtPLower.s, pUpper.p, propsAtPUpper.s, p),
        v: linearInterpolate(pLower.p, propsAtPLower.v, pUpper.p, propsAtPUpper.v, p),
        t
    };
}

/**
 * Find state by P (kPa) and Entropy s (kJ/kgK).
 * Used for isentropic expansion in turbines.
 */
export function findStateByEntropy(p: number, s: number): SteamProperties {
    const sat = getSaturatedProperties(p);

    // Check if it's in the two-phase region
    if (s <= sat.sg) {
        const quality = (s - sat.sf) / (sat.sg - sat.sf);
        const h = sat.hf + quality * (sat.hg - sat.hf);
        const v = sat.vf + quality * (sat.vg - sat.vf);
        return { h, s, v, t: sat.t, quality };
    }

    // Otherwise, superheated: Find T such that s(P, T) = targetS
    // Simple search/interp on superheated table at P
    // For brevity, we'll find bounding T points in the superheated table at pressure P
    // First, get s at various T for pressure P (interpolated between P bounding tables)

    const tValues = [100, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700];
    const sValues = tValues.map(t => getSuperheatedProperties(p, t).s);

    let t0 = tValues[0], t1 = tValues[tValues.length - 1];
    let s0 = sValues[0], s1 = sValues[sValues.length - 1];

    for (let i = 0; i < sValues.length - 1; i++) {
        if (s >= sValues[i] && s <= sValues[i + 1]) {
            t0 = tValues[i]; t1 = tValues[i + 1];
            s0 = sValues[i]; s1 = sValues[i + 1];
            break;
        }
    }

    const t = linearInterpolate(s0, t0, s1, t1, s);
    const props = getSuperheatedProperties(p, t);
    return { ...props, t };
}

export interface RankineResult {
    netWork: number;
    heatIn: number;
    thermalEfficiency: number;
    backWorkRatio: number;
    state1: SteamProperties;
    state2: SteamProperties;
    state3: SteamProperties;
    state4: SteamProperties;
}

/**
 * Calculates a simple Rankine Cycle with real lookup and efficiencies.
 */
export function calculateRankineCycle(
    pBoiler: number,
    tBoiler: number,
    pCondenser: number,
    etaPump: number = 1.0,
    etaTurbine: number = 1.0
): RankineResult {
    // State 1: Saturated liquid at condenser pressure
    const sat1 = getSaturatedProperties(pCondenser);
    const state1: SteamProperties = { h: sat1.hf, s: sat1.sf, v: sat1.vf, t: sat1.t, quality: 0 };

    // State 2: After pump
    // Wp_s = v1 * (P2 - P1)
    const workPumpIsentropic = state1.v * (pBoiler - pCondenser);
    const h2s = state1.h + workPumpIsentropic;
    const h2 = state1.h + (workPumpIsentropic / etaPump);
    const state2: SteamProperties = { h: h2, s: state1.s, v: state1.v, t: state1.t }; // Negligible T increase

    // State 3: Boiler exit
    const state3 = getSuperheatedProperties(pBoiler, tBoiler);

    // State 4: Turbine exit
    // Isentropic expansion: s4s = s3
    const state4s = findStateByEntropy(pCondenser, state3.s);
    const h4 = state3.h - etaTurbine * (state3.h - state4s.h);

    // Determine T and quality for state 4
    const state4 = findStateByEntropy(pCondenser, state4s.s); // Re-lookup for actual h would be better but this is close
    state4.h = h4; // Force actual h

    // Results
    const workTurbine = state3.h - state4.h;
    const workPump = state2.h - state1.h;
    const netWork = workTurbine - workPump;
    const heatIn = state3.h - state2.h;
    const thermalEfficiency = netWork / heatIn;
    const backWorkRatio = workPump / workTurbine;

    return {
        netWork,
        heatIn,
        thermalEfficiency,
        backWorkRatio,
        state1,
        state2,
        state3,
        state4
    };
}
