import './ButtonPrimary.scss';

function ButtonPrimary({ type, children, ...rest }) {
  return (
    <button {...rest} type={type} className="ButtonPrimary">
      {children}
    </button>
  );
}
export default ButtonPrimary;
