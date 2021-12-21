import './App.css';

import React from 'react'


import ReactDataSheet from 'react-datasheet';
// Be sure to include styles at some point, probably during your bootstrapping
import 'react-datasheet/lib/react-datasheet.css';

function App() {
  return (
    <section class="section">
    <div class="columns is-multiline is-mobile">
      <Menu></Menu>
      <div class="column">
      <h2> Table: A </h2>
      <Table></Table>

      </div>
    </div>

  </section>
  );
}

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [
        [{ value: 1 }, { value: 3 }],
        [{ value: 2 }, { value: 4 }],
      ],
    };
  }

  addRow(){
    this.setState({
      grid: this.state.grid.concat([
        this.state.grid[0].map(firstRow => {return{"value": ""}})
      ])
    })
  }


  addColumn(){
    this.setState({
      grid: this.state.grid.map(row => {row.push({"value": "new val"}); return row})
    })
  }

  render() {
    return (
      <div>
      <button onClick={this.addRow.bind(this)}>Add Row</button>
      <button onClick={this.addColumn.bind(this)}>Add Column</button>
        <ReactDataSheet
          data={this.state.grid}
          valueRenderer={cell => cell.value}
          onCellsChanged={changes => {
            const grid = this.state.grid.map(row => [...row]);
            changes.forEach(({ cell, row, col, value }) => {
              grid[row][col] = { ...grid[row][col], value };
            });
            this.setState({ grid });
          }}
        />
      </div>
    );
  }
}


function Menu(){
  return (
    <div class="column is-one-fifth">
      <aside class="menu">
      <p class="menu-label">
        General
      </p>
      <ul class="menu-list">
        <li><a href="/">Source Tables</a>
          <ul class="menu-list">
            <li><a href="/">Tables: A</a></li>
            <li><a href="/">Table: B</a></li>
            <li><button>add table</button></li>
          </ul>
        </li>
        <li><a href="/">Config - TBD</a></li>
        <li><a href="/">Export / Save</a></li>
      </ul>
      <p class="menu-label">
        TBD
      </p>
    </aside>
  </div>
  )
}

export default App;
