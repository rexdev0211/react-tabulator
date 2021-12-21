import { UPDATE_TABLE, UPDATE_DATA, DATA_UPDATED } from '../actionTypes'

const initial_state = {
  tables: [
    {
      id: 1,
      tableName: 'Table 1',
      data: [[]]
    }
  ],
  dataUpdated: false
}

function updateTableData(tables, data) {
  const index = tables.findIndex((obj => obj.id === data.id));
  tables[index].data = data.data;
  return tables;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initial_state, action) => {
  switch (action.type) {
    case UPDATE_TABLE:
      return {...state, tables: action.payload};
    case UPDATE_DATA:
      return {...state, tables: updateTableData(state.tables, action.payload)};
    case DATA_UPDATED:
      return {...state, dataUpdated: action.dataUpdated};
    default: return { ...state };
  }
}