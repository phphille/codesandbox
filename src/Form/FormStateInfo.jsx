import { useFormStateContext } from '../MyFormLib';

import './FormStateInfo.scss';

function FormStateInfo() {
  const {
    isPending,
    isResolved,
    isRejected,
    submitError,
  } = useFormStateContext();
  if (isPending) return <div>LOADING .....</div>;

  if (isRejected) return <div className="Form-error-msg">{submitError}</div>;
  if (isResolved) return <div className="Form-success-msg">Success!</div>;

  return null;
}

export default FormStateInfo;
