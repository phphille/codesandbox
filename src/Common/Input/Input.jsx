import { useFormField } from '../../MyFormLib';

import './Input.scss';

function Input({ name, id, label, fieldInfo = null }) {
  const { meta, ...props } = useFormField(name);

  return (
    <div className="Input-container">
      <label {...props} className="Input-label">
        {label}
      </label>
      <input
        {...props}
        id={id}
        className={`Input ${
          meta.touched && !meta.valid ? 'Input-invalid' : ''
        }`}
      />
      {meta.touched && meta.errorMsg && (
        <div className="Input-error-msg">{meta.errorMsg}</div>
      )}
      {fieldInfo}
    </div>
  );
}

export default Input;
