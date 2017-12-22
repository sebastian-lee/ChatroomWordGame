import React from "react";
import styled from "styled-components";

const ButtonContainer = styled.div`
  display: inline-block;
  cursor: pointer;
  
  :hover{
    div {
      background-color: rgb(179, 46, 252);
    }
  }
`;

const Bar = styled.div`
  width: 35px;
  height: 5px;
  background-color: rgb(155, 0, 241);
  margin: 6px 0;
  transition: 0.5s;

`;

const Bar1 = Bar.extend`
  ${props =>
    props.change
      ? `
    transform: translate(14px,5px) rotate(45deg) scale(0.8);
    width:20px;
    `
      : ""};
`;

const Bar2 = Bar.extend`
  ${props =>
    props.change
      ? `
    transform: scale(0.8);
    border-radius: 0 5px 5px 0px;
`
      : ""};
`;

const Bar3 = Bar.extend`
  ${props =>
    props.change
      ? `
      transform: translate(14px,-5px) rotate(-45deg) scale(0.8);
      width:20px;

      `
      : ""};
`;

function MenuButton(props) {
  return (
    <ButtonContainer onClick={props.onClick}>
      <Bar1 change = {props.change}/>
      <Bar2 change = {props.change}/>
      <Bar3 change = {props.change}/>
    </ButtonContainer>
  );
}

export default MenuButton;
