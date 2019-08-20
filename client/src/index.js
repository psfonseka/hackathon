import React from "react";
import ReactDOM from "react-dom";

//test here
class App extends React.Component {
  render() {
    return <div>Hello {this.props.name} and test more!</div>;
  }
}

var mountNode = document.getElementById("app");
ReactDOM.render(<App name="Pravin" />, mountNode);