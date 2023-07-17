import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Edit as EditIcon, Delete as DeleteIcon, Email as EmailIcon,  } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import {Box,Button,Dialog,DialogActions,DialogContent,DialogTitle,IconButton,Stack,TextField ,Typography, MenuItem} from '@mui/material';
import {Times, Pay_Type} from './lists'

function EmployeeTable() {
  let params = useParams()
  const [data, setData] = useState({});
  const [data2, setData2] = useState({});
  const [change, setChange] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  

  

  const columns = useMemo(
    () => [
      
      {
        accessorKey: 'period_start',
        header: 'Period Start',
        size:150
      },
      {
        accessorKey: 'period_end',
        header: 'Period End',
      },
      {
        accessorKey: 'monday_hours_worked',
        header: 'Monday',
        size:50
      },
      {
        accessorKey: 'tuesday_hours_worked',
        header: 'Tuesday',
        size:50
      },
      {
        accessorKey: 'wednesday_hours_worked',
        header: 'Wednesday',
        size:50
      },
      {
        accessorKey: 'thursday_hours_worked',
        header: 'Thursday',
        size:50
      },
      {
        accessorKey: 'friday_hours_worked',
        header: 'Friday',
        size:50
      },
      {
        accessorKey: 'saturday_hours_worked',
        header: 'Saturday',
        size:50
      },
      {
        accessorKey: 'sunday_hours_worked',
        header: 'Sunday',
        size:50
      },
      {
        accessorKey: 'total_hours_worked',
        header: 'Total Hours',
      }
    ],
    [],
  );

  const columns2 = useMemo(
    () => [
      {
        accessorKey: 'date',
        header: 'Date',
      },
      {
        accessorKey: 'start_time',
        header: 'Start Time',
        type: 'time',
        muiTableBodyCellEditTextFieldProps: {
          select: true, //change to select for a dropdown
          children: Times.map((time) => (
            <MenuItem key={time} value={time}>
              {time}
            </MenuItem>
          )),
        },
      },
      {
        accessorKey: 'end_time',
        header: 'End Time',
        type: 'time',
        muiTableBodyCellEditTextFieldProps: {
          select: true, //change to select for a dropdown
          children: Times.map((time) => (
            <MenuItem key={time} value={time}>
              {time}
            </MenuItem>
          )),
        },
      },
      {
        accessorKey: 'unpaid_break',
        header: 'Unpaid Break',
        type: 'time',
        muiTableBodyCellEditTextFieldProps: {
          select: true, //change to select for a dropdown
          children: Times.map((time) => (
            <MenuItem key={time} value={time}>
              {time}
            </MenuItem>
          )),
        },
      },
      {
        accessorKey: 'pay_type',
        header: 'Pay Type',
        muiTableBodyCellEditTextFieldProps: {
          select: true, //change to select for a dropdown
          children: Pay_Type.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          )),
        },
      },
      {
        accessorKey: 'comment',
        header: 'Comments',
      }
    ],
    [],
  );

  const columns3 = useMemo(
    () => [
      {
        accessorKey: 'date',
        header: 'Date',
      },
      {
        accessorKey: 'comment',
        header: 'Comments',
      }
    ],
    [],
  );

  useEffect(() => {
    console.log("fetch")    
    async function fetchData()  {
        const res = await fetch(`https://cpa-flask.azurewebsites.net/employee/timesheet/'${params.userID}'`)
        const data = await res.json()

        console.log(data)
        setData(data.results)

        const res2 = await fetch(`https://cpa-flask.azurewebsites.net/employee/timesheet-entrys/'${params.userID}'/'${data.results[0].period_start_date}'/'${data.results[0].period_end_date}'`)
        const data2 = await res2.json()

        console.log(data2)
        setData2(data2.results)

        setChange(false)
    } 
        
    fetchData()

},[change])

const handleSaveRow = async ({ exitEditingMode, row, values }) => {
  console.log(values)
  console.log(`https://cpa-flask.azurewebsites.net/employee/timesheet-entrys/update/'${row.original.timesheet_entry_id}'/'${values.date}'/'${values.start_time}'/'${values.end_time}'/'${values.unpaid_break}'/'${values.pay_type}'/'${values.comment}'`)
  const res = await fetch(`https://cpa-flask.azurewebsites.net/employee/timesheet-entrys/update/'${row.original.timesheet_entry_id}'/'${values.date}'/'${values.start_time}'/'${values.end_time}'/'${values.unpaid_break}'/'${values.pay_type}'/'${values.comment}'`)
  const data = await res.json()

  if (data.success === 'Success') {
    alert(`Entry updated succesfully (ID no.${row.original.timesheet_entry_id})`)
    setChange(true)}
    else {
      alert(`An error occured.\n\n\n\n${data.error}`) }

  exitEditingMode(); 
};

const DeleteAccount = async (table) => {
  console.log(table.getSelectedRowModel())
  if (window.confirm(`Are you sure you want to delete${table.getSelectedRowModel().rows.map((row) => (`\n\t${row.original.date} (Entry ID no.${row.original.timesheet_entry_id})`))}`)) {

    console.log(`${table.getSelectedRowModel().rows.map((row) => (`${row.original.timesheet_entry_id}`))}`)

    const res = await fetch(`https://cpa-flask.azurewebsites.net/employee/timesheet-entrys/delete/'${table.getSelectedRowModel().rows.map((row) => (`${row.original.timesheet_entry_id}`))}'`)
    const data = await res.json()

    if (data.success === 'true') {
      alert(`Selected rows were deleted successfully`)
      setChange(true)}
    else {
      alert(`An error occured.\n\n\n\n${data.error}`) }
  }
}

const handleCreateNewRow = async (values) => {

  console.log(values)
  const res = await fetch(`https://cpa-flask.azurewebsites.net/employee/timesheet-entrys/new/'${values.date}'/'${values.start_time}'/'${values.end_time}'/'${values.unpaid_break}'/'${values.pay_type}'/'${values.comment}'`)
  const data = await res.json()

  if (data.success === 'true') {
    alert(`${values.first_name} ${values.last_name} (${values.username}) was updated successfully`)
    setChange(true)}
    else {
      alert(`An error occured.\n\n\n\n${data.error}`) }
};

const CreateNewEntry = ({ open, columns, onClose, onSubmit }) => {
const [values, setValues] = useState(() =>
columns.reduce((acc, column) => {
acc[column.accessorKey ?? ''] = '';
return acc;
}, {}),
);

const handleSubmit = () => {
//put your validation logic here
onSubmit(values);
onClose();
};

return (
  <div className={String(open)}>
    <div className={'mui-box-container-form'} >
      <DialogTitle textAlign="center">New Timesheet Entry</DialogTitle>
        <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
              select: {padding: '16.5px 14px',font:'inherit'}
            }}
          >
            {columns.map((column) => (
              <TextField
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            ))}
            <select name='start_time' onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }>
                  <option value="">Start Time</option>
                  {Times.map((time) => (<option key={time} value={time}>{time}</option>))}
              </select>
              <select name='end_time' onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }>
                  <option value="">End Time</option>
                  {Times.map((time) => (<option key={time} value={time}>{time}</option>))}
              </select>
              <select name='unpaid_break' onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }>
                  <option value="">Unpaid break</option>
                  {Times.map((time) => (<option key={time} value={time}>{time}</option>))}
              </select>
              <select name='pay_type' onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }>
                  <option value="">Pay Type</option>
                  {Pay_Type.map((type) => (<option key={type} value={type}>{type}</option>))}
              </select>
          </Stack>
        </form>
        <div className='buttons-for-form'>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="secondary" onClick={handleSubmit} variant="contained">
            New Entry
          </Button>
        </div>
      </DialogContent>

    </div>
  </div>
);
};

  return (
    <>
    <MaterialReactTable
      columns={columns}
      data={data}
      enableFullScreenToggle={false}
      initialState={{ columnPinning: { left: ['period_start','period_end']} }}
      enablePinning
      renderTopToolbarCustomActions={() => (
  <Button
    color="secondary"
    onClick={() => setCreateModalOpen(true)}
    variant="contained"
  >
    New Time sheet Entry
  </Button>
)}/>
<div className='timesheet-entrys'>
    <MaterialReactTable
      columns={columns2}
      data={data2}
      enableFullScreenToggle={false}
      initialState={{ columnPinning: { left: ['date']} }}
      enablePinning
      enableEditing
      enableRowSelection
      editingMode='row'
      onEditingRowSave={handleSaveRow}
      renderTopToolbarCustomActions={({table}) => {
        return (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              color="secondary"
              onClick={() => setCreateModalOpen(true)}
              variant="contained"
            >New Time sheet Entry</Button>
            <Button
                color="error"
                onClick={() => DeleteAccount(table)}
                variant="contained"
            >Delete</Button>
          </div>
        );
      }}/>
 </div>
      <CreateNewEntry
      columns={columns3}
      open={createModalOpen}
      onClose={() => setCreateModalOpen(false)}
      onSubmit={handleCreateNewRow}
      />  
  </>
  );
};


export default EmployeeTable;