import React, {useState, useEffect} from 'react'
import Box from '@mui/material/Box'
import { useDispatch } from 'react-redux'

import OutlinedInput from '@mui/material/OutlinedInput'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import Stack from '@mui/material/Stack'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import ReactDataSheet from 'react-datasheet'
import 'react-datasheet/lib/react-datasheet.css'

const TableContent = ({table}) => {
  const dispatch = useDispatch()

  const [rowsCount, setRowsCount] = useState(1)
  const [colName, setColName] = useState('')
  const [contextMenu, setContextMenu] = useState(null)
  const [showRemoveRow, setShowRemoveRow] = useState(true)

  useEffect(() => {
    setColName('')
  }, [table.data])

  const onCellsChanged = (changes) => {
    const updatedGrid = table.data.map(row => [...row])
    changes.forEach(({ cell, row, col, value }) => {
      updatedGrid[row][col] = { ...updatedGrid[row][col], value }
    })
    dispatch({
      type: 'UPDATE_DATA',
      payload: {id: table.id, data: updatedGrid}
    })
    dispatch({
      type: 'DATA_UPDATED',
      dataUpdated: true
    })
  }
  
  const addRows = () => {
    if (rowsCount === '0' || rowsCount === '') {
      return
    }

    dispatch({
      type: 'UPDATE_DATA',
      payload: {
        id: table.id,
        data: table.data.concat(
          [...Array(parseInt(rowsCount)).keys()].map(() => {
            return table.data[0].map(() => {return {value: ''}})
          })
        )
      }
    })
  }

  const addColumn = () => {
    if (colName === '') {
      return
    }

    dispatch({
      type: 'UPDATE_DATA',
      payload: {
        id: table.id,
        data: table.data.map((row, i) => 
          row.concat([i === 0 ? {value: colName, readOnly: true} : {value: ''}]) 
        )
      }
    })
  }

  const handleContextMenu = (event, cell, i, j) => {
    setShowRemoveRow(i === 0 ? false : true)
    
    event.preventDefault()
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
            rowIndex: i,
            columnIndex: j
          }
        : null,
    )
  }

  const handleClose = () => {
    setContextMenu(null)
  };

  const removeRow = (rowIndex) => {
    dispatch({
      type: 'UPDATE_DATA',
      payload: {
        id: table.id,
        data: table.data.filter((item, i) => i !== rowIndex)
      }
    })
    dispatch({
      type: 'DATA_UPDATED',
      dataUpdated: true
    })

    setContextMenu(null)
  }

  const removeColumn = (columnIndex) => {
    dispatch({
      type: 'UPDATE_DATA',
      payload: {
        id: table.id,
        data: table.data.map((row, i) => 
          row.filter((item, i) => i !== columnIndex)
        )
      }
    })
    dispatch({
      type: 'DATA_UPDATED',
      dataUpdated: true
    })

    setContextMenu(null)
  } 

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={2} sx={{ marginBottom: 1 }}>
        <OutlinedInput 
          placeholder="Column Name" 
          size="small"
          value={colName} 
          onInput={e => setColName(e.target.value)} 
        />
        <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={addColumn} sx={{ width: 150 }}>
          Add Column
        </Button>
      </Stack>
      {table.data[0].length > 0 && 
        (
        <Stack direction="row" spacing={2} sx={{ marginBottom: 1 }}>
          <OutlinedInput 
            placeholder="Rows Count" 
            size="small"
            type="number"
            value={rowsCount} 
            onInput={e => setRowsCount(e.target.value)} 
          />
          <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={addRows} sx={{ width: 150 }}>
            Add Row(s)
          </Button>
        </Stack>
        )
      }
      <ReactDataSheet
        className="tabulator-table"
        data={table.data}
        valueRenderer={cell => cell.value}
        onCellsChanged={onCellsChanged}
        onContextMenu={handleContextMenu}
      />
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        {showRemoveRow &&
        <MenuItem onClick={() =>
          contextMenu !== null
            ? removeRow(contextMenu.rowIndex)
            : handleClose()
          }>
          Remove Row
        </MenuItem>
        }
        <MenuItem onClick={() =>
          contextMenu !== null
            ? removeColumn(contextMenu.columnIndex)
            : handleClose()
          }>
          Remove Column
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default TableContent