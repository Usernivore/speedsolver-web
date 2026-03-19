/**
 * Psychrometric Utilities
 * Standard equations for moist air at sea level (101.325 kPa)
 * Temperatures in Celsius, Pressures in Pa
 */

const P_ATM = 101325; // Pa
const RA = 287.042; // J/(kg·K) Gas constant for dry air

// Saturation vapor pressure (Pa) vs T (Celsius)
// Using simplified Tetens equation for 0 to 50°C
export const getPws = (t: number): number => {
    return 610.78 * Math.exp((17.27 * t) / (t + 237.3));
};

// Inverse of getPws: T (Celsius) vs Pw (Pa)
export const getTdp = (pw: number): number => {
    const val = Math.log(pw / 610.78);
    return (237.3 * val) / (17.27 - val);
};

export interface PsychroResult {
    tdb: number;
    twb: number;
    tdp: number;
    rh: number; // %
    omega: number; // kg/kg
    enthalpy: number; // kJ/kg
    volume: number; // m³/kg
}

/**
 * Calculates psychrometric properties from Tdb and RH
 */
export const calcFromTdbRh = (tdb: number, rhPercent: number): PsychroResult => {
    const rh = rhPercent / 100;
    const pws = getPws(tdb);
    const pw = rh * pws;

    return finalizeProperties(tdb, pw);
};

/**
 * Calculates psychrometric properties from Tdb and Twb
 */
export const calcFromTdbTwb = (tdb: number, twb: number): PsychroResult => {
    const pwsTwb = getPws(twb);
    // Standard psychrometric constant formula
    // A = 0.00066 * (1 + 0.00115 * Twb)
    const pw = pwsTwb - 0.00066 * (1 + 0.00115 * twb) * P_ATM * (tdb - twb) / 1000;

    return finalizeProperties(tdb, pw);
};

/**
 * Calculates psychrometric properties from Tdb and Tdp
 */
export const calcFromTdbTdp = (tdb: number, tdp: number): PsychroResult => {
    const pw = getPws(tdp);
    return finalizeProperties(tdb, pw);
};

/**
 * Finishes calculation of derived properties from Tdb and Partial Pressure of Water Vapor
 */
const finalizeProperties = (tdb: number, pw: number): PsychroResult => {
    const pws = getPws(tdb);
    const rh = (pw / pws) * 100;

    // Humidity Ratio (kg/kg)
    const omega = 0.621945 * pw / (P_ATM - pw);

    // Enthalpy (kJ/kg)
    // h = 1.006 * Tdb + w * (2501 + 1.86 * Tdb)
    const enthalpy = 1.006 * tdb + omega * (2501 + 1.86 * tdb);

    // Specific Volume (m³/kg)
    // v = Ra * (Tdb+273.15) * (1 + 1.6078 * w) / Patm
    const volume = RA * (tdb + 273.15) * (1 + 1.6078 * omega) / P_ATM;

    // Dew Point
    const tdp = getTdp(pw);

    // Wet Bulb (Iterative approximation or simplified)
    // For this tool, we'll use a simplified Stull's formula for Twb estimation if inputs were not Twb
    const twb = estimateTwb(tdb, rh);

    return {
        tdb,
        twb,
        tdp,
        rh,
        omega,
        enthalpy,
        volume
    };
};

/**
 * Calculates psychrometric properties from Tdb and Omega (kg/kg)
 */
export const calcFromTdbOmega = (tdb: number, omega: number): PsychroResult => {
    const pw = (omega * P_ATM) / (0.621945 + omega);
    return finalizeProperties(tdb, pw);
};

/**
 * Calculates psychrometric properties from Tdb and h (kJ/kg)
 */
export const calcFromTdbH = (tdb: number, h: number): PsychroResult => {
    // h = 1.006 * Tdb + w * (2501 + 1.86 * Tdb)
    const omega = (h - 1.006 * tdb) / (2501 + 1.86 * tdb);
    return calcFromTdbOmega(tdb, omega);
};

/**
 * Calculates psychrometric properties from Tdb and v (m3/kg)
 */
export const calcFromTdbV = (tdb: number, v: number): PsychroResult => {
    // v = Ra * (Tdb+273.15) * (1 + 1.6078 * w) / Patm
    const factor = (v * P_ATM) / (RA * (tdb + 273.15));
    const omega = (factor - 1) / 1.6078;
    return calcFromTdbOmega(tdb, omega);
};

export const solvePsychro = (inputs: Record<string, number>): PsychroResult | null => {
    const keys = Object.keys(inputs);
    if (keys.length < 2) return null;

    const { tdb, twb, tdp, rh, omega, enthalpy, volume } = inputs;

    // Cases where Tdb is known (most common)
    if (tdb !== undefined) {
        if (rh !== undefined) return calcFromTdbRh(tdb, rh);
        if (twb !== undefined) return calcFromTdbTwb(tdb, twb);
        if (tdp !== undefined) return calcFromTdbTdp(tdb, tdp);
        if (omega !== undefined) return calcFromTdbOmega(tdb, omega / 1000); // UI uses g/kg
        if (enthalpy !== undefined) return calcFromTdbH(tdb, enthalpy);
        if (volume !== undefined) return calcFromTdbV(tdb, volume);
    }

    // Special cases without Tdb (harder, but some are solvable)
    // For this MVP, we prioritize Tdb. If no Tdb, we can't solve easily without iteration.
    return null;
};

/**
 * Stull's formula for Twb given Tdb and RH (%)
 * Precision: 0.28°C for RH 5-99% and T -20 to 50°C
 */
const estimateTwb = (tdb: number, rh: number): number => {
    return tdb * Math.atan(0.151977 * Math.pow(rh + 8.313659, 0.5))
        + Math.atan(tdb + rh)
        - Math.atan(rh - 1.676331)
        + 0.00391838 * Math.pow(rh, 1.5) * Math.atan(0.023101 * rh)
        - 4.686035;
};
