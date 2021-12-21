import React, { Fragment, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import { Typography } from '@mui/material'
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'

import TableContent from './table-content'
import ResultTable from './result-table'

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  // textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100vh'
}));

const TabPanel = (props) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

const Bucket = () => {
  // const [tables, setTables] = useState([])
  const { tables } = useSelector(state => state.Bucket)
  const dispatch = useDispatch()

  const [activeTable, setActiveTable] = useState(0)
  const [lastTableId, setLastTableId] = useState(1)
  const [dragIndex, setDragIndex] = useState(-1)

  const handleChangeActiveTable = (event, newValue) => {
    setActiveTable(newValue)
  }

  const addTable = () => {
    const addedId = lastTableId + 1
    setLastTableId(addedId)
    const addedTables = tables.concat([
      {
        id: addedId,
        tableName: `Table ${addedId}`,
        data: [[]]
      }
    ])
    dispatch({type: 'UPDATE_TABLE', payload: addedTables})
  }

  const removeTable = (tableIndex) => {
    const removedTables = tables.filter(obj => obj.id !== tableIndex)
    setActiveTable(activeTable > 0 ? activeTable - 1 : activeTable)
    dispatch({type: 'UPDATE_TABLE', payload: removedTables})
  }

  const swapElement = (index1, index2) => {
    let b = tables[index1]
    tables[index1] = tables[index2]
    tables[index2] = b

    return tables
  }
  const allowDropTab = (ev) => {
    ev.preventDefault()
  }
 
  const dragTab = (ev, index) => {
    setDragIndex(index)
  }
 
  const dropTab = (ev, dropIndex) => {
    ev.preventDefault()
    setActiveTable(dropIndex)
    dispatch({type: 'UPDATE_TABLE', payload: swapElement(dragIndex, dropIndex)})

  }
  return (
    <Fragment>
      <CssBaseline />
      <Container maxWidth="xl" className="bucket">
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Item>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTable} onChange={handleChangeActiveTable} aria-label="basic tabs example" variant="scrollable" scrollButtons allowScrollButtonsMobile>
                {tables.map((item, i) => (
                  <Tab
                    key={i}
                    label={
                      <Fragment>
                        {item.tableName}
                        <CloseIcon fontSize="small" onClick={() => removeTable(item.id)} className="remove-icon" />
                      </Fragment>
                    }
                    className="custom-tab"
                    onDrop={(ev) => dropTab(ev, i)}
                    onDragOver={allowDropTab}
                    draggable="true"
                    onDragStart={(ev) => dragTab(ev, i)}
                  />
                ))}
                <Tab
                  label={
                    <Fragment>
                      <AddIcon fontSize="small" onClick={() => addTable()} className="add-icon" />
                    </Fragment>
                  }
                  className="add-custom-tab"
                />
              </Tabs>
            </Box>
            {tables.map((item, i) => (
              <TabPanel value={activeTable} index={i} key={i}>
                <TableContent table={item} />
              </TabPanel>
            ))}
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
            <Typography variant="h6" gutterBottom sx={{ marginTop: 1, paddingLeft: 1 }}>
              The Result Table (left natural join)
            </Typography>
            <Divider />
            <ResultTable />
          </Item>
        </Grid>
      </Grid>
        
      </Container>
    </Fragment>
  )
}
export default Bucket