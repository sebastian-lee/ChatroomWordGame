import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const X = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50px;
  text-align: center;
  background-color: rgba(245, 245, 245, 1);
  border: 2px solid rgba(250, 0, 0, 0.3);
  margin: auto;
  color: rgba(250, 0, 0, 0.8);
  transition: 0.5s;

  &:hover {
    border: 2px solid rgba(250, 0, 0, 0.6);
    background-color: rgba(245, 200, 200, 1);
    color: rgba(250, 0, 0, 1);
  }
`;

class DeleteItem extends Component {
  handleClick = () => {
    this.props.onXClick(this.props.value);
  };

  render() {
    return (
      <X onClick={this.handleClick} value={this.props.value}>
        ×
      </X>
    );
  }
}

export default DeleteItem;
