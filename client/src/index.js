import React from "react";
import ReactDOM from "react-dom";
const axios = require("axios");
//test here
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryEntry: "",
      amountEntry: "",
      dateEntry: "",
      commentEntry: "",
      budgetItems: [
        {
          _id: "1321314",
          category: "Auto & Transport",
          amount: 43.43,
          date: "08/14/2019",
          comment: "Gas"
        },
        {
          _id: "13263414",
          category: "Bills & Heating",
          amount: 103.42,
          date: "08/14/2019",
          comment: "Heating"
        },
        {
          _id: "13281314",
          category: "Taxes",
          amount: 72.9,
          date: "08/14/2019",
          comment: "Federal Tax"
        }
      ]
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }
  componentDidMount() {
    console.log("App mounted Successfully!");
    this.getData();
  }
  getData() {
    axios.get("/spending").then(data => {
      let results = data.data.results;
      this.setState({
        budgetItems: results
      });
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    let newArr = this.state.budgetItems;
    let newEntry = {
      category: this.state.categoryEntry,
      amount: this.state.amountEntry,
      date: this.state.dateEntry,
      comment: this.state.commentEntry
    };
    axios.post("/spending", newEntry).then(data => {
      let entry = data.data;
      newArr.push(entry);
      this.setState({
        budgetItems: newArr
      });
    });
  }

  onKeyPress(event) {
    if (event.which === 13) {
      this.handleSubmit(event);
    }
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  render() {
    return (
      <div>
        <h1 id="title">Budgeting App!</h1>
        <form onSubmit={this.handleSubmit}>
          <table id="finances">
            <tbody>
              <tr>
                <td>Category</td>
                <td>Amount</td>
                <td>Date</td>
                <td>Comment</td>
              </tr>
              <tr>
                <td>
                  <input
                    name="categoryEntry"
                    onChange={this.handleInputChange}
                    onKeyPress={this.onKeyPress}
                  />
                </td>
                <td>
                  <input
                    name="amountEntry"
                    onChange={this.handleInputChange}
                    onKeyPress={this.onKeyPress}
                  />
                </td>
                <td>
                  <input
                    name="dateEntry"
                    onChange={this.handleInputChange}
                    onKeyPress={this.onKeyPress}
                  />
                </td>
                <td>
                  <input
                    name="commentEntry"
                    onChange={this.handleInputChange}
                    onKeyPress={this.onKeyPress}
                  />
                </td>
              </tr>
              {this.state.budgetItems
                .slice()
                .reverse()
                .map(item => {
                  let newAmount = parseFloat(
                    Math.round(item.amount * 100) / 100
                  ).toFixed(2);
                  return (
                    <tr key={item._id}>
                      <td>{item.category}</td>
                      <td>${newAmount}</td>
                      <td>{item.date}</td>
                      <td>{item.comment}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </form>
      </div>
    );
  }
}
const mountNode = document.getElementById("app");
ReactDOM.render(<App />, mountNode);
