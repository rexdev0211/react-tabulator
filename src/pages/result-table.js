import React, {useState, useEffect} from 'react'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'

import ReactDataSheet from 'react-datasheet'

import {
  ListToGenerator,
  PermutateGeneratorsLeftJoin
} from '../left_join_generator/generator'

const ResultTable = () => {
  const dispatch = useDispatch()
  
  const { tables, dataUpdated } = useSelector(state => state.Bucket)
  const [resultData, setResultData] = useState([])
  const [resultTableData, setResultTableData] = useState([[]])

  useEffect(() => {
    
    if (dataUpdated) {
      dispatch({
        type: 'DATA_UPDATED',
        dataUpdated: false
      })
      return
    }

    const tableData = tables.map(item => getJsonOutput(item.data)).filter(item => item.length > 0)
  
    let resGenerator = PermutateGeneratorsLeftJoin(
      tableData.map(item => ListToGenerator(item))
    )

    let res = []
    while(true){
      let lastVal = resGenerator()
      if (lastVal) res.push(lastVal)
      else break
    }
    res = res.map(item => Object.assign({}, ...item))
    setResultData(res)
    
    const headerArr = res.length > 0 ? Object.keys(res[0]) : []
    const valueArr = res.map(item => Object.values(item))
    res = [headerArr].concat(valueArr)
    const tableResult = res.map((item, i) => i === 0 ? item.map(val => ({value: val, readOnly: true})) : item.map(val => ({value: val})))
    setResultTableData(tableResult)
  }, [tables, dataUpdated, dispatch])
  
  const getJsonOutput = (data) => {
    const dataArr = data.map(row => row.map(item => item.value))
    const headerArr = dataArr[0]
    const contentArr = dataArr.filter((item, i) => i !== 0)

    return contentArr.length > 0 
      ? contentArr.map(item => item.reduce((pv, cv, index) => ({ ...pv, [headerArr[index]]:cv}), {}))
      : []
  }

  return (
    <Box sx={{ width: '100%', padding: 1 }}>
      <Typography variant="body1" gutterBottom sx={{ wordBreak: 'break-word' }}>
        {JSON.stringify(resultData)}
      </Typography>
      <ReactDataSheet
        className="tabulator-table"
        data={resultTableData}
        valueRenderer={cell => cell.value}
      />
    </Box>
  )
}

export default ResultTable