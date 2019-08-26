import { StatedInterceptor, EffectContext, NextCaller } from 'stated-bean';

import { getMetadataStorage } from '../metadata';
import { FormModel, _addError, _clearErrors } from '../core/FormModel';

export class FormValidateInterceptor implements StatedInterceptor {
  async stateInit(context: EffectContext, next: NextCaller) {
    const bean = context.bean;
    const { target, name } = context.fieldMeta;
    const fieldMeta = getMetadataStorage().getField(target, name);

    if (fieldMeta !== undefined && bean instanceof FormModel) {
      bean.setFormField(name, fieldMeta.schema);
    }
    await next();
  }

  async stateChange(context: EffectContext, next: NextCaller) {
    await next();

    const bean = context.bean;
    const { target, name } = context.fieldMeta;
    const fieldMeta = getMetadataStorage().getField(target, name);
    if (fieldMeta !== undefined && bean instanceof FormModel) {
      const formField = bean.getFormField(name);
      if (formField !== undefined && fieldMeta.option.validOnChange) {
        try {
          bean[_clearErrors](name);
          await fieldMeta.schema.validate(context.getValue(), {
            abortEarly: false,
          });
        } catch (e) {
          console.log('yup error', e);
          bean[_addError](name, e);
        }
      }
    }
  }
}
