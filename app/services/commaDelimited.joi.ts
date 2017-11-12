import * as Joi from 'joi';

type JoiConstructor = (typeof Joi);
export type JoiWithCommaDelimited = JoiConstructor & {
  commaDelimited(): {
    items(params: any): Joi.Schema
  };
};

export const JoiCommaDelimited = Joi.extend({
  name: 'commaDelimited',
  base: Joi.string(),
  language: {
    items: '{{error}}',
  },
  pre(value: string, _state, _options): any {
    return value.split(',');
  },
  rules: [{
    name: 'items',
    params: {
      items: Joi.any()
    },
    validate(params: { items: Joi.Schema }, value: string[], state, options): any {
      const validation = Joi.array().items(params.items).validate(value);
      if (validation.error) {
        return this.createError('commaDelimited.items', { error: validation.error }, state, options);
      } else {
        return validation.value;
      }
    }
  }]
}) as JoiWithCommaDelimited;
