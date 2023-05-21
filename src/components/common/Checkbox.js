import React, { useEffect, useRef } from "react";
import { PropTypes } from "prop-types";

export const CHECKED = 1;
export const UNCHECKED = 2;
export const INDETERMINATE = -1;

const Checkbox = (props) => {
  const { status, labelClassName, children, ...otherProps } = props;
  const checkRef = useRef();

  useEffect(() => {
    checkRef.current.checked = status === CHECKED;
    checkRef.current.indeterminate = status === INDETERMINATE;
  }, [status]);
  return (
    <label className={labelClassName}>
      <input type="checkbox" ref={checkRef} {...otherProps} />
      {children}
    </label>
  );
};

Checkbox.propTypes = {
  status: PropTypes.oneOf([CHECKED, UNCHECKED, INDETERMINATE]).isRequired,
  labelClassName: PropTypes.string,
};

export default Checkbox;
