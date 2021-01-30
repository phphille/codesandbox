import { useState, useRef, useEffect } from 'react';
import { useFormField, useUpdateFieldValue } from '../MyFormLib';
import ButtonText from '../Common/ButtonText';
import { useFormSettingsContext } from '../FormSettings';

import './FormEmailSuggestion.scss';

function FormEmailSuggestion({ name }) {
  const timeoutTimer = useRef(null);
  const abortController = useRef(null);
  const prevEmail = useRef();
  const [suggestions, setSuggestions] = useState({ email: '', options: [] });
  const { autocompleteThrottle } = useFormSettingsContext();
  const updateEmail = useUpdateFieldValue();
  const {
    meta: { valid: emailValid },
    value: email,
  } = useFormField(name);

  useEffect(() => {
    clearTimeout(timeoutTimer.current);
    if (abortController.current && abortController.current.abort) {
      abortController.current.abort();
    }

    if (email && emailValid && prevEmail.current !== email) {
      timeoutTimer.current = setTimeout(() => {
        abortController.current = new AbortController();
        const signal = abortController.current.signal;
        fetch(
          `https://www.carpetvista.se/ajax/check-email/${email}?delay=${autocompleteThrottle}`,
          { signal },
        )
          .then((res) => res.json())
          .then((data) => {
            prevEmail.current = email;
            const domains =
              !data.exactMatch && data.output
                ? data.output.slice(0, 2).map((item) => item.domain)
                : [];
            setSuggestions({
              email: email,
              options: data.exactMatch ? [] : domains,
            });
          })
          .catch((err) => {
            console.log('err', err);
          });
      }, 400);
    }
  }, [autocompleteThrottle, email, emailValid, prevEmail]);

  if (
    email &&
    emailValid &&
    suggestions.email === email &&
    suggestions.options.length
  ) {
    return (
      <div className="FormEmailSuggestion">
        Did you mean{' '}
        {suggestions.options
          .map((suggestion) => (
            <ButtonText
              key={suggestion}
              type="button"
              onClick={() =>
                updateEmail(name, `${email.replace(/(@.+)/, '')}@${suggestion}`)
              }>
              {`${email.replace(/(@.+)/, '')}@${suggestion}`}
            </ButtonText>
          ))
          .reduce((prev, curr) => [prev, ' or ', curr])}
        ?
      </div>
    );
  }
  return null;
}

export default FormEmailSuggestion;
