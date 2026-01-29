import { generateQuestion, TopicSchema } from './questionGenerator';

const schema: TopicSchema = {
    "meta": {
        "topic_id": "termo_internal_energy",
        "topic_name": "Energía Interna (U) y Grados de Libertad",
        "difficulty": "Medium",
        "version": "1.0"
    },
    "constants": {
        "R_joules": 8.314,
        "abs_zero": 273.15
    },
    "variable_ranges": {
        "moles_n": { "min": 0.5, "max": 4.0, "decimals": 2, "unit": "mol" },
        "temperature_initial_C": { "min": 25, "max": 100, "decimals": 0, "unit": "°C" },
        "temperature_final_C": { "min": 150, "max": 300, "decimals": 0, "unit": "°C" },
        "U_joules": { "min": 0, "max": 1000000, "decimals": 0, "unit": "J" },
        "delta_U_joules": { "min": 0, "max": 1000000, "decimals": 0, "unit": "J" }
    },
    "scenarios": [
        {
            "id": "calc_U_total",
            "template": "Calcule la energía interna total ($U$) almacenada en ${moles_n} moles de un gas **${gas_type_label}** a una temperatura de ${temperature_initial_C}°C.",
            "variables_special": {
                "gas_type": [
                    { "label": "Monoatómico (Helio)", "f": 3 },
                    { "label": "Diatómico (Nitrógeno)", "f": 5 }
                ]
            },
            "target_variable": "U_joules",
            "solver_logic": {
                "temp_K": "val_temperature_initial_C + 273.15",
                "formula": "(val_gas_type.f / 2) * val_moles_n * 8.314 * temp_K"
            },
            "explanation_template": "1. Identificar grados de libertad ($f$) para gas ${val_gas_type.label}: $f={val_gas_type.f}$. \n 2. Convertir T a Kelvin: $T = {val_temperature_initial_C} + 273.15 = {temp_K} K$. \n 3. Usar fórmula de Energía Interna: $$U = \\frac{f}{2}nRT$$ \n 4. Sustituir: $$U = \\frac{{val_gas_type.f}}{2}({val_moles_n})(8.314)({temp_K})$$ \n 5. Resultado: **{correct_answer} J**",
            "distractor_logic": [
                { "type": "wrong_f", "note": "Usó f incorrecto", "formula": "((val_gas_type.f == 3 ? 5 : 3) / 2) * val_moles_n * 8.314 * temp_K" }
            ]
        }
    ]
};

const question = generateQuestion(schema);
console.log(JSON.stringify(question, null, 2));
