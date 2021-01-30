import './ButtonText.scss';

function ButtonText({ type, children, ...rest }) {
  return (
    <button {...rest} type={type} className="ButtonText">
      {children}
    </button>
  );
}

export default ButtonText;
