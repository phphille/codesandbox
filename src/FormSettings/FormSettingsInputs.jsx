import { ACTIONS } from './FormSettings';

import './FormSettingsInputs.scss';

const nbrFieldsOptions = [
  { value: 3, text: '3️⃣' },
  { value: 4, text: '4️⃣' },
];
function FormSettingsInputs({ dispatchSettings, settings }) {
  return (
    <div className="FormSettings-wrapper">
      <div className="FormSettings-container">
        <div className="FormSettings-radios-container">
          {nbrFieldsOptions.map(({ value, text }) => (
            <div key={value} className="FormSettings-radio-wrapper">
              <input
                id={`formsettings_nbr_fields_${value}`}
                className="FormSettings-input"
                type="radio"
                name="nbrFields"
                checked={settings.nbrFields === value}
                value={value}
                onChange={() =>
                  dispatchSettings({
                    type: ACTIONS.NBR_FIELDS_CHANGED,
                    value: value,
                  })
                }
              />
              <label
                htmlFor={`formsettings_nbr_fields_${value}`}
                className="FormSettings-label FormSettings-label-radio">
                <span className="FormSettings-emoji">{text}</span>
                fields
              </label>
            </div>
          ))}
        </div>
        <div className="FormSettings-checkbox-wrapper">
          <input
            id="formsettings_reject_submit"
            className="FormSettings-input"
            type="checkbox"
            name="reject"
            checked={settings.rejectFormSubmit}
            value={settings.rejectFormSubmit}
            onChange={(e) =>
              dispatchSettings({
                type: ACTIONS.REJECT_SUBMIT_CHANGED,
                value: e.currentTarget.checked,
              })
            }
          />
          <label
            htmlFor="formsettings_reject_submit"
            className="FormSettings-label FormSettings-label-checkbox">
            Reject submit{' '}
            <span className="FormSettings-emoji">
              {settings.rejectFormSubmit ? '❗' : '❓'}
            </span>
          </label>
        </div>
        <label
          htmlFor="formsettings_autocomplete_throttle"
          className="FormSettings-label">
          Throttle autocomplete (s){' '}
          <span className="FormSettings-emoji FormSettings-emoji-snail">
            🐌
          </span>
          <input
            id="formsettings_autocomplete_throttle"
            className="FormSettings-input"
            name="throttle"
            type="number"
            defaultValue={settings.autocompleteThrottle}
            onChange={(e) => {
              const value = e.currentTarget.value;
              if (/^$|^[1-9]{1}[0-9]{0,}$/.test(value)) {
                dispatchSettings({
                  type: ACTIONS.AUTOCOMPLETE_THROTTLE_CHANGED,
                  value: value ? parseInt(value, 10) : 0,
                });
              }
            }}
          />
        </label>
      </div>
    </div>
  );
}

export default FormSettingsInputs;
