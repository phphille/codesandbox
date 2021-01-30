import { createContext, useContext, useReducer } from 'react';
import FormSettingsInputs from './FormSettingsInputs';

const FormSettingsContext = createContext();

const ACTIONS = {
  AUTOCOMPLETE_THROTTLE_CHANGED: 'AUTOCOMPLETE_THROTTLE_CHANGED',
  REJECT_SUBMIT_CHANGED: 'REJECT_SUBMIT_CHANGED',
  NBR_FIELDS_CHANGED: 'NBR_FIELDS_CHANGED',
};
Object.freeze(ACTIONS);

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.REJECT_SUBMIT_CHANGED:
      return {
        ...state,
        rejectFormSubmit: action.value,
      };
    case ACTIONS.NBR_FIELDS_CHANGED:
      return {
        ...state,
        nbrFields: action.value,
      };
    case ACTIONS.AUTOCOMPLETE_THROTTLE_CHANGED:
      return {
        ...state,
        autocompleteThrottle: action.value,
      };
    default:
      throw new Error('Dispatched unknown form action', action);
  }
};
const initState = {
  rejectFormSubmit: false,
  autocompleteThrottle: 0,
  nbrFields: 3,
};

function FormSettings({ children }) {
  const [settings, dispatch] = useReducer(reducer, initState);

  return (
    <FormSettingsContext.Provider value={settings}>
      <FormSettingsInputs dispatchSettings={dispatch} settings={settings} />
      {children}
    </FormSettingsContext.Provider>
  );
}

const useFormSettingsContext = () => {
  const context = useContext(FormSettingsContext);
  if (context === undefined) {
    throw new Error(
      'useFormStateContext must be used within a FormStateContext provider',
    );
  }
  return context;
};

export { FormSettings, useFormSettingsContext, ACTIONS };
