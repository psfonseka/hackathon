import React from "react";
import ReactDOM from "react-dom";
import {PieChart} from "react-d3-components";
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
      modCategoryEntry: "",
      modAmountEntry: "",
      modDateEntry: "",
      modCommentEntry: "",
      modify: false,
      modifyIndex: -1,
      budgetItems: [],
      chartData: {
        values: []
      }
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleStartModify = this.handleStartModify.bind(this);
    this.handleApplyModify = this.handleApplyModify.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentDidMount() {
    console.log("App mounted Successfully!");
    this.getData();
  }

  calculateChart(data) {
    let fullData = data.slice();
    let objData = {}
    for (let i = 0; i < fullData.length; i++) {
      if (objData[fullData[i].category] === undefined) {
        objData[fullData[i].category] = fullData[i].amount;
      } else {
        objData[fullData[i].category] += fullData[i].amount;
      }
    }
    let categories = Object.keys(objData);
    let finalData = [];
    for (let i = 0; i < categories.length; i++) {
      finalData.push({x: categories[i], y: objData[categories[i]]});
    }
    this.setState({
      chartData: {
        values: finalData
      }
    });
  }

  getData() {
    axios.get("/spending").then(data => {
      let results = data.data.results;
      this.setState({
        budgetItems: results
      }, () => this.calculateChart(results));
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
        budgetItems: newArr,
        categoryEntry: "",
        amountEntry: "",
        dateEntry: "",
        commentEntry: ""
      }, () => this.calculateChart(newArr));
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

  handleDelete(event) {
    event.preventDefault();
    let _id = event.target.value;
    let rIndex = event.target.getAttribute("index");
    let index = this.state.budgetItems.length - rIndex - 1;
    let newArr = this.state.budgetItems.slice();
    newArr.splice(index, 1);
    axios.delete("/spending", { data: { _id: _id } }).then(data => {
      if (data.data._id === _id) {
        this.setState({
          budgetItems: newArr
        }, () => this.calculateChart(newArr));
      } else {
        console.log("ERROR: DIDN'T DELETE ON DB");
      }
    });
  }

  handleApplyModify(event) {
    event.preventDefault();
    let rIndex = event.target.getAttribute("index");
    let index = this.state.budgetItems.length - rIndex - 1;
    let newArr = this.state.budgetItems.slice();
    let obj = newArr[index];
    obj.category = this.state.modCategoryEntry;
    obj.amount = this.state.modAmountEntry;
    obj.comment = this.state.modCommentEntry;
    obj.date = this.state.modDateEntry;
    axios.put("/spending", obj).then(data => {
      if (data.data._id === obj._id) {
        this.setState({
          modCategoryEntry: "",
          modAmountEntry: "",
          modCommentEntry: "",
          modDateEntry: "",
          modify: false,
          modifyIndex: -1,
          budgetItems: newArr
        }, () => this.getData());
      } else {
        console.log("ERROR: DIDN'T MODIFY ON DB");
      }
    });
  }

  handleStartModify(event) {
    event.preventDefault();
    let _id = event.target.value;
    let rIndex = event.target.getAttribute("index");
    let index = this.state.budgetItems.length - rIndex - 1;
    let newArr = this.state.budgetItems.slice();
    let oldInfo = newArr[index];
    this.setState({
      modCategoryEntry: oldInfo.category,
      modAmountEntry: oldInfo.amount,
      modCommentEntry: oldInfo.comment,
      modDateEntry: oldInfo.date,
      modify: true,
      modifyIndex: index
    });
  }

  render() {
    return (
      <div>
        <h1 id="title">Budgeting App!</h1>
        <form id="bigForm" onSubmit={this.handleSubmit}>
          <table id="finances">
            <tbody>
              <tr>
                <td>Category</td>
                <td>Amount</td>
                <td>Date</td>
                <td>Comment</td>
                <td>Actions</td>
              </tr>
              <tr>
                <td>
                  <input
                    name="categoryEntry"
                    value={this.state.categoryEntry}
                    onChange={this.handleInputChange}
                    onKeyPress={this.onKeyPress}
                  />
                </td>
                <td>
                  <input
                    name="amountEntry"
                    value={this.state.amountEntry}
                    onChange={this.handleInputChange}
                    onKeyPress={this.onKeyPress}
                  />
                </td>
                <td>
                  <input
                    name="dateEntry"
                    value={this.state.dateEntry}
                    onChange={this.handleInputChange}
                    onKeyPress={this.onKeyPress}
                  />
                </td>
                <td>
                  <input
                    name="commentEntry"
                    value={this.state.commentEntry}
                    onChange={this.handleInputChange}
                    onKeyPress={this.onKeyPress}
                  />
                </td>
                <td>
                  <button onClick={this.handleSubmit}>Submit</button>
                </td>
              </tr>
              {this.state.budgetItems
                .slice()
                .reverse()
                .map((item, i) => {
                  let rIndex = -1;
                  if (this.state.modifyIndex > -1) {
                    rIndex =
                      this.state.budgetItems.length -
                      this.state.modifyIndex -
                      1;
                  }
                  if (this.state.modify && rIndex === i) {
                    return (
                      <tr key={item._id}>
                        <td>
                          <input
                            name="modCategoryEntry"
                            value={this.state.modCategoryEntry}
                            onChange={this.handleInputChange}
                          />
                        </td>
                        <td>
                          <input
                            name="modAmountEntry"
                            value={this.state.modAmountEntry}
                            onChange={this.handleInputChange}
                          />
                        </td>
                        <td>
                          <input
                            name="modDateEntry"
                            value={this.state.modDateEntry}
                            onChange={this.handleInputChange}
                          />
                        </td>
                        <td>
                          <input
                            name="modCommentEntry"
                            value={this.state.modCommentEntry}
                            onChange={this.handleInputChange}
                          />
                        </td>
                        <td>
                          <button
                            value={item._id}
                            index={i}
                            onClick={this.handleApplyModify}
                          >
                            Apply
                          </button>
                        </td>
                      </tr>
                    );
                  } else {
                    let newAmount = parseFloat(
                      Math.round(item.amount * 100) / 100
                    ).toFixed(2);
                    return (
                      <tr key={item._id}>
                        <td>{item.category}</td>
                        <td>${newAmount}</td>
                        <td>{item.date}</td>
                        <td>{item.comment}</td>
                        <td>
                          <button
                            value={item._id}
                            index={i}
                            onClick={this.handleDelete}
                          >
                            Delete
                          </button>
                          <button
                            value={item._id}
                            index={i}
                            onClick={this.handleStartModify}
                          >
                            Modify
                          </button>
                        </td>
                      </tr>
                    );
                  }
                })}
            </tbody>
          </table>
        </form>
        <div id="chart">
        <PieChart
        data={this.state.chartData}
        width={600}
        height={400}
        margin={{top: 10, bottom: 10, left: 100, right: 100}}
        sort={null}/>
        </div>
        
      </div>
    );
  }
}

const mountNode = document.getElementById("app");
ReactDOM.render(<App />, mountNode);
