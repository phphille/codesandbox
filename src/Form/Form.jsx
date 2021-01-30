import { useMemo } from 'react';
import { Form as MyFormLibForm } from '../MyFormLib';
import Input from '../Common/Input/Input';
import useFetchFormMeta from './useFetchFormMeta';
import FormEmailSuggestion from './FormEmailSuggestion';
import ButtonPrimary from '../Common/ButtonPrimary';
import { useFormSettingsContext } from '../FormSettings';
import FormStateInfo from './FormStateInfo';

import './Form.scss';

function FormSetup({ formMetaId, formMetaFields = {}, children }) {
  const { rejectFormSubmit } = useFormSettingsContext();
  const initialValues = useMemo(
    () =>
      Object.keys(formMetaFields).reduce((acc, fieldName) => {
        acc[fieldName] =
          formMetaFields[formMetaFields[fieldName].name].initialValue;
        return acc;
      }, {}),
    [formMetaFields],
  );

  return formMetaId ? (
    <MyFormLibForm
      key={formMetaId}
      formProps={{
        className: 'Form',
      }}
      onSubmit={(values) => {
        console.log('Submitting values', values);
        return new Promise((resolve, rejected) => {
          setTimeout(
            () => (rejectFormSubmit ? rejected('submit rejected') : resolve()),
            2000,
          );
        });
      }}
      initialValues={initialValues}
      validation={(values) => {
        const errors = {};
        Object.keys(formMetaFields).forEach((fieldName) => {
          const { required, regex, flags, regexErrorMsg } = formMetaFields[
            fieldName
          ];
          const value = String(values[fieldName]).trim();
          const regExp = regex ? new RegExp(regex, flags) : null;

          if (required && !value) {
            errors[fieldName] = 'Required';
          } else if (regex && !regExp.test(value)) {
            errors[fieldName] = regexErrorMsg;
          }
        });

        return errors;
      }}>
      {children}
    </MyFormLibForm>
  ) : null;
}

function Form() {
  const [{ isPending, isResolved }, formMeta] = useFetchFormMeta();

  if (isPending) {
    return 'LOADING .... 🥱';
  }

  if (isResolved && formMeta) {
    const { id: formMetaId, fields: formMetaFields } = formMeta;
    return (
      <FormSetup formMetaId={formMetaId} formMetaFields={formMetaFields}>
        {formMetaFields &&
          Object.keys(formMetaFields).map((fieldName) => {
            const { label, name, id, type, required } = formMetaFields[
              fieldName
            ];
            return (
              <Input
                key={id}
                label={label}
                name={name}
                id={id}
                type={type}
                required={required}
                fieldInfo={
                  type === 'email' ? <FormEmailSuggestion name={name} /> : null
                }
              />
            );
          })}
        <FormStateInfo />
        <ButtonPrimary>
          send
          <svg
            className="Form-svg"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16">
            <path
              className="Form-path"
              fillRule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </ButtonPrimary>
      </FormSetup>
    );
  }
}

export default Form;
