import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

//Main: 113, 0, 176 purple
//Secondary: 255, 211, 0 yellow

//Adding styling to change if its the username submission or messaging bar
const StyledForm = styled.form`
  width: 100%;
  height: 100%;
  display: grid;
`;

const StyledInput = styled.input`
  grid-column: 1;
  font-size: 1.5em;
  border: 2px solid rgba(179, 46, 252, 0);
  border-radius: ${props => (props.login ? "15px" : "0px")};
  padding: 5px;
  transition: 0.5s;
  color: rgba(10,10,10,0.8);
  background-color: rgba(245,245,245,1);
  &:focus {
    outline: none;
    border: 2px solid rgba(179, 46, 252, 0.3);
    border-style: inset;
    ${props => (props.login ? "transform: translateY(-2px)" : "")};
    ${props => (props.login ? "box-shadow: 0px 2px 2px rgba(10,10,10,0.3);" : "")};
  }

  &:hover {
    outline: none;
    border: 2px solid rgba(179, 46, 252, 0.5);
    border-style: inset;
  }
`;

function InputBar(props) {
  return (
    <StyledForm
      login={props.login}
      className={props.className}
      id={props.formID}
      onSubmit={props.onSubmit}
    >
      <StyledInput login={props.login} id={props.inputID} autoComplete="off" />
    </StyledForm>
  );
}

InputBar.propTypes = {
  formID: PropTypes.string,
  inputID: PropTypes.string,
  onSubmit: PropTypes.func.isRequired
};

export default InputBar;
