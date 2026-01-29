import { generateQuestion, TopicSchema } from './questionGenerator';

const schema: TopicSchema = {
    "meta": { "topic_id": "test", "topic_name": "test", "difficulty": "Easy", "version": "1.0" },
    "constants": {},
    "variable_ranges": { "x": { "min": 1, "max": 1, "decimals": 0, "unit": "u" } },
    "scenarios": [
        {
            "id": "test",
            "template": "Test ${gas_type_label}",
            "variables_special": {
                "gas_type": [{ "label": "G", "f": 3 }]
            },
            "target_variable": "x",
            "solver_logic": {
                "ans": "val_gas_type.f * 10"
            },
            "distractor_logic": [],
            "explanation_template": "Ans: {ans}"
        }
    ]
};

const question = generateQuestion(schema);
console.log(JSON.stringify(question, null, 2));
