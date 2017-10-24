import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

//Adding styling to change if its the username submission or messaging bar
const StyledForm = styled.form`
  height: 100%;
  width: 100%;

  ${props =>
    props.SendMessage ? "display: grid; grid-template: 1fr / 4fr 1fr;" : ""};
`;

const StyledInput = styled.input`
  ${props => (props.SendMessage ? "grid-column: 1;" : "")};
  font-size: 1.5em;
`;

const StyledButton = styled.button`
  ${props => (props.SendMessage ? "grid-column: 2;" : "")};
`;

function InputBar(props) {
  return (
    <StyledForm
      SendMessage={props.SendMessage}
      id={props.formID}
      onSubmit={props.onSubmit}
    >
      <StyledInput
        SendMessage={props.SendMessage}
        id={props.inputID}
        autoComplete="off"
      />
      <StyledButton SendMessage={props.SendMessage} id={props.StyledButtonID}>
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
