import { useState, useCallback, useRef } from "react";

export default function useForm({ initialValues, validate }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const refsMap = useRef({});

  const register = useCallback((name) => {
    return {
      name,
      value: values[name] ?? "",
      onChange: (e) => {
        const val = e.target.value;
        setValues((prev) => ({ ...prev, [name]: val }));
        if (errors[name]) {
          setErrors((prev) => {
            const next = { ...prev };
            delete next[name];
            return next;
          });
        }
      },
      ref: (el) => {
        if (el) refsMap.current[name] = el;
      },
    };
  }, [values, errors]);

  const handleSubmit = useCallback(
    (onSubmit, onError) => (e) => {
      e.preventDefault();
      const nextErrors = validate ? validate(values) : {};
      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        if (typeof onError === "function") {
          onError(nextErrors);
        }
        return;
      }
      onSubmit(values);
    },
    [values, validate]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return { values, errors, register, handleSubmit, resetForm };
}