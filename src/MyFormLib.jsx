import {
  useRef,
  createContext,
  useContext,
  useReducer,
  useEffect,
} from 'react';

const ACTIONS = {
  FIELD_CHANGED: 'FIELD_CHANGED',
  SUBMIT: 'SUBMIT',
  SUBMIT_RESOLVED: 'SUBMIT_RESOLVED',
  SUBMIT_REJECTED: 'SUBMIT_REJECTED',
};
Object.freeze(ACTIONS);

const FormFieldsStateContext = createContext();
const FormStateContext = createContext();
const FormDispatchContext = createContext();

const formReducer = (state, action, validation) => {
  switch (action.type) {
    case ACTIONS.FIELD_CHANGED: {
      const newState = {
        ...state,
        fields: {
          ...state.fields,
          [action.field]: {
            ...state.fields[action.field],
            value: action.value,
            meta: {
              ...state.fields[action.field].meta,
              touched: true,
            },
          },
        },
        formState: {
          ...state.formState,
          isPending: false,
          isResolved: false,
          isRejected: false,
          submitError: '',
        },
      };
      const errors = validation(
        Object.values(newState.fields).reduce((acc, obj) => {
          acc[obj.name] = obj.value;
          return acc;
        }, {}),
      );

      Object.values(newState.fields).forEach((obj) => {
        newState.fields[obj.name] = {
          ...newState.fields[obj.name],
          meta: {
            ...newState.fields[obj.name].meta,
            valid: errors[obj.name] ? false : true,
            errorMsg: errors[obj.name] || '',
          },
        };
      });
      return newState;
    }
    case ACTIONS.SUBMIT: {
      const { isPending } = state.formState;
      if (isPending) {
        console.log("plz don't spam..");
        return state;
      }

      const errors = validation(
        Object.values(state.fields).reduce((acc, obj) => {
          acc[obj.name] = obj.value;
          return acc;
        }, {}),
      );

      const newFields = {};
      Object.values(state.fields).forEach((obj) => {
        newFields[obj.name] = {
          ...state.fields[obj.name],
          meta: {
            ...state.fields[obj.name].meta,
            valid: errors[obj.name] ? false : true,
            errorMsg: errors[obj.name] || '',
            touched: true,
          },
        };
      });

      return {
        ...state,
        fields: newFields,
        formState: {
          ...state.formState,
          isPending: Object.keys(errors).length ? false : true,
          isResolved: false,
          isRejected: false,
        },
      };
    }
    case ACTIONS.SUBMIT_RESOLVED: {
      const newFields = {};
      Object.values(state.fields).forEach((obj) => {
        newFields[obj.name] = {
          ...state.fields[obj.name],
          value: '',
          meta: {
            ...state.fields[obj.name].meta,
            valid: false,
            errorMsg: '',
            touched: false,
          },
        };
      });
      return {
        ...state,
        fields: newFields,
        formState: {
          isPending: false,
          isResolved: true,
          isRejected: false,
          submitError: '',
        },
      };
    }
    case ACTIONS.SUBMIT_REJECTED: {
      return {
        ...state,
        formState: {
          isPending: false,
          isResolved: false,
          isRejected: true,
          submitError: action.errorMsg,
        },
      };
    }
    default:
      throw new Error('Dispatched unknown form action', action);
  }
};

function Form({ initialValues, children, validation, onSubmit, formProps }) {
  const pendingSubmitRef = useRef(false);
  const [{ fields, formState }, dispatchFormActions] = useReducer(
    (...params) => formReducer(...params, validation),
    initialValues,
    (initValue) => {
      const fields = Object.keys(initValue).reduce((acc, key) => {
        acc[key] = {
          value: initialValues[key],
          name: key,
          meta: {
            touched: false,
            valid: false,
            errorMsg: '',
          },
        };
        return acc;
      }, {});

      return {
        fields,
        formState: {
          isPending: false,
          isResolved: false,
          isRejected: false,
          errorMsg: '',
        },
      };
    },
  );

  useEffect(() => {
    if (formState.isPending && !pendingSubmitRef.current) {
      pendingSubmitRef.current = true;
      onSubmit(
        Object.values(fields).reduce((acc, obj) => {
          acc[obj.name] = obj.value;
          return acc;
        }, {}),
      )
        .then(() => {
          pendingSubmitRef.current = false;
          dispatchFormActions({ type: ACTIONS.SUBMIT_RESOLVED });
        })
        .catch((errorMsg) => {
          pendingSubmitRef.current = false;
          dispatchFormActions({ type: ACTIONS.SUBMIT_REJECTED, errorMsg });
        });
    }
  }, [fields, formState.isPending, onSubmit]);

  return (
    <FormStateContext.Provider value={formState}>
      <FormFieldsStateContext.Provider value={fields}>
        <FormDispatchContext.Provider value={dispatchFormActions}>
          <form
            {...formProps}
            onSubmit={(e) => {
              e.preventDefault();
              dispatchFormActions({ type: ACTIONS.SUBMIT });
            }}>
            {children}
          </form>
        </FormDispatchContext.Provider>
      </FormFieldsStateContext.Provider>
    </FormStateContext.Provider>
  );
}

const useFormFieldsStateContext = () => {
  const context = useContext(FormFieldsStateContext);
  if (context === undefined) {
    throw new Error(
      'useFormFieldsStateContext must be used within a FormFieldsStateContext provider',
    );
  }
  return context;
};

const useFormStateContext = () => {
  const context = useContext(FormStateContext);
  if (context === undefined) {
    throw new Error(
      'useFormStateContext must be used within a FormStateContext provider',
    );
  }
  return context;
};

const useFormDispatchContext = () => {
  const context = useContext(FormDispatchContext);
  if (context === undefined) {
    throw new Error(
      'useFormDispatchContext must be used within a FormDispatchContext provider',
    );
  }
  return context;
};

const useFormField = (name) => {
  const dispatch = useFormDispatchContext();
  const {
    [name]: { value, meta },
  } = useFormFieldsStateContext();
  const fieldChanged = (e) =>
    dispatch({
      type: ACTIONS.FIELD_CHANGED,
      field: name,
      value: e.currentTarget.value,
    });
  return {
    name,
    value,
    onChange: fieldChanged,
    onBlur: fieldChanged,
    meta,
  };
};

const useUpdateFieldValue = () => {
  const dispatch = useFormDispatchContext();
  return (name, value) =>
    dispatch({ type: ACTIONS.FIELD_CHANGED, field: name, value: value });
};

export {
  useUpdateFieldValue,
  useFormField,
  useFormDispatchContext,
  useFormStateContext,
  Form,
};
