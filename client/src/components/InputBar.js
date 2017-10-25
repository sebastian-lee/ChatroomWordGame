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
  grid-template: ${props => (props.login ? "1fr / 1fr" : "1fr / 4fr 1fr")};
`;

const StyledInput = styled.input`
  grid-column: 1;
  font-size: 1.5em;
  border: 2px solid rgba(179, 46, 252, 0);
  border-radius: ${props => (props.login ? "15px" : "0px")};
  padding: 5px;
  transition: 0.5s;

  &:focus {
    outline: none;
    border: 2px solid rgba(179, 46, 252, 0.3);
    border-style: inset;
    ${props => (props.login ? "translateY(-2px)" : "")};
    ${props => (props.login ? "box-shadow: 0px 2px 2px rgba(10,10,10,0.3);" : "")};
  }

  &:hover {
    outline: none;
    border: 2px solid rgba(179, 46, 252, 0.5);
    border-style: inset;
  }
`;

const StyledButton = styled.button`
  grid-column: 2;
  border: none;
  ${props => (props.login ? "display:none" : "")};

  &:focus {
    outline: none;
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
      <StyledButton login={props.login} id={props.StyledButtonID}>
        {props.buttonText}
      </StyledButton>
    </StyledForm>
  );
}

InputBar.propTypes = {
  formID: PropTypes.string,
  inputID: PropTypes.string,
  buttonID: PropTypes.string,
  buttonText: PropTypes.string,
  onSubmit: PropTypes.func.isRequired
};

export default InputBar;
