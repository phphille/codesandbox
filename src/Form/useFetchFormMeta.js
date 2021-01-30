import { useReducer, useEffect, useRef } from 'react';
import { useFormSettingsContext } from '../FormSettings';
import fourFields from '../ExternalMetaFormFields/four-fields.json';
import threeFields from '../ExternalMetaFormFields/three-fields.json';

const ACTIONS = {
  FETCH: 'FETCH',
  NEW_FORM_META: 'NEW_FORM_META',
};
Object.freeze(ACTIONS);

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.FETCH:
      return {
        ...state,
        fetchState: {
          isPending: true,
          isResolved: false,
          isRejected: false,
          submitError: '',
        },
      };
    case ACTIONS.NEW_FORM_META:
      return {
        ...state,
        formMeta: action.data,
        fetchState: {
          isPending: false,
          isResolved: true,
          isRejected: false,
          submitError: '',
        },
      };
    default:
      throw new Error('Dispatched unknown form action', action);
  }
};

function useFetchFormMeta() {
  const timeoutTimer = useRef();
  const { nbrFields } = useFormSettingsContext();
  const [{ fetchState, formMeta }, dispatch] = useReducer(reducer, {
    fetchState: {
      isPending: true,
      isResolved: false,
      isRejected: false,
      submitError: '',
    },
    formMeta: null,
  });

  useEffect(() => {
    dispatch({ type: ACTIONS.FETCH });
    clearTimeout(timeoutTimer.current);
    timeoutTimer.current = setTimeout(() => {
      dispatch({
        type: ACTIONS.NEW_FORM_META,
        data: nbrFields === 3 ? threeFields : fourFields,
      });
    }, 1000);
  }, [nbrFields]);

  return [fetchState, formMeta];
}

export default useFetchFormMeta;
