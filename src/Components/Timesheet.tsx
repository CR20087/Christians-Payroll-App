import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Edit as EditIcon, Delete as DeleteIcon, Email as EmailIcon,  } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import {Box,Button,Dialog,DialogActions,DialogContent,DialogTitle,IconButton,Stack,TextField ,Typography, MenuItem} from '@mui/material';
import {Times, Pay_Type, Years, Month, Days} from './lists'
import { useForm } from 'react-hook-form';


function EmployeeTable() {
  let params = useParams()
  const [data, setData] = useState({});
  const [data2, setData2] = useState({});
  const [change, setChange] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const { register, handleSubmit, formState: { errors } } = useForm();

  const validateCheck = useCallback(
    (cell) => {
      const handleBlur = (event) => {
        console.log(event)
        const updatedValidationErrors = { ...validationErrors };


        if (cell.column.id === 'start_time') {
          updatedValidationErrors['min'] = new Date(`2000-01-01T${event.target.value}`)
        } else if (cell.column.id === 'end_time') {
          updatedValidationErrors['max'] = new Date(`2000-01-01T${event.target.value}`)
        } 
                
        if (event.target.value === "") {
          if (cell.column.id !== 'comment') {
          updatedValidationErrors[cell.id] = `${cell.column.columnDef.header} is required`;
          console.log("STRING")
        }} else if (cell.column.id === 'comment') {
            if (!cell.column.columnDef.regex.test(event.target.value)) {
          updatedValidationErrors[cell.id] = cell.column.columnDef.helperText;
          console.log("REGEX") 
        }} else if (updatedValidationErrors['min'] > updatedValidationErrors['max']) {
          updatedValidationErrors[cell.id] = cell.column.columnDef.helperText;
        } else {
          delete updatedValidationErrors[cell.id];
        }
         
        

        setValidationErrors(updatedValidationErrors);
        console.log(updatedValidationErrors)
      };  
      
      return {
        onBlur: handleBlur,
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
      };
    },
    [validationErrors]
  );

  useEffect(() => {
    // This will run after each render when validationErrors changes
    console.log('Validation errors updated:', validationErrors);
  }, [validationErrors]);

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

  const columns2 = [
      {
        accessorKey: 'date',
        header: 'Date',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
          type: 'date'
        }),
      },
      {
        accessorKey: 'start_time',
        header: 'Start Time',
        helperText: "Start time must be greater than End time",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
          type: 'time',
        }),
      },
      {
        accessorKey: 'end_time',
        header: 'End Time',
        helperText: "End time must be greater than Start time",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
          type: 'time',
        }),
      },
      {
        accessorKey: 'unpaid_break',
        header: 'Unpaid Break',
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
        regex: /^[A-Za-z0-9,.() ]*$/,
        helperText: "Comment must not include any special symbols, Allowed symbols: '(),.'",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell)
        }),
      }
    ]

  useEffect(() => {
    console.log("fetch")    
    async function fetchData()  {
        const res = await fetch(`https://cpa-flask.azurewebsites.net/employee/timesheet/'${params.userID}'`)
        const data = await res.json()

        console.log(data)
        setData(data.results)

        const res2 = await fetch(`https://cpa-flask.azurewebsites.net/employee/timesheet-entrys/'${params.userID}'/'${data.entry_start_date}'/'${data.entry_end_date}'`)
        const data2 = await res2.json()

        console.log(data2)
        setData2(data2.results)

        setChange(false)
    } 
        
    fetchData()

},[change])

const handleSaveRow = async ({ exitEditingMode, row, values }) => {
  console.log(values)
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
    const selected_array = `${table.getSelectedRowModel().rows.map((row) => (`${row.original.timesheet_entry_id}`))}`

    const res = await fetch(`https://cpa-flask.azurewebsites.net/employee/timesheet-entrys/delete`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selected_array)
    })
    const data = await res.json()
    console.log(data)
    if (data.success === 'Success') {
      alert(`Selected rows were deleted successfully`)
      setChange(true)}
    else {
      alert(`An error occured.\n\n\n\n${data.error}`) }
  }
}

const handleCreateNewRow = async (values) => {

  console.log(values)

  const res = await fetch(`https://cpa-flask.azurewebsites.net/employee/timesheet-entrys/new/'${params.userID}'/'${values.date}'/'${values.start_time}'/'${values.end_time}'/'${[values.unpaid_break_hours,values.unpaid_break_minutes].join(':')}'/'${values.pay_type}'/'${values.comment}'`)
  const data = await res.json()

  if (data.success === 'Success') {
    alert(`${values.date} was created successfully`)
    setChange(true)}
    else {
      alert(`An error occured.\n\n\n\n${data.error}`) }
};

const CreateNewEntry = ({ open,  onClose, onSubmit }) => {
const [values, setValues] = useState(() =>
columns.reduce((acc, column) => {
acc[column.accessorKey ?? ''] = '';
return acc;
}, {}),
);

const submitFunc = (information) => {
//put your validation logic here
onSubmit(information);
onClose();
};


return (
  <div className={String(open)} >
    <div className={'mui-box-container-form'} >
      <DialogTitle textAlign="center">New Timesheet Entry</DialogTitle>
        <DialogContent>
        <form onSubmit={handleSubmit(submitFunc)} >
          <Stack
            sx={{
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
              select: {padding: '16.5px 14px',font:'inherit'},
              div: {display:'flex',gap:'1rem',justifyContent:'center'},
              padding: '20px 2px 2px 2px'
            }}
          >
            <div>
              Date
              <input
              {...register("date", { required: true })}
              type='date'
              onChange={(e) => 
                setValues({ ...values, [e.target.name]: e.target.value })
              }
              />
              </div>
              <div>
                {errors.date && <h6>Date is required</h6>}
              </div>
            <div>Start Time
            <input 
              type='time'
              max={!!values['end_time'] ? values['end_time'] : '' }
              {...register("start_time", { required: true })}
              onChange={(e) => 
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                />{errors.start_time && <h6>Start time is required</h6>}</div>

                <div>End Time
              <input 
              {...register("end_time", { required: true })} 
              type='time'
              min={!!values['start_time'] ? values['start_time'] : '' }
              onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }/>{errors.end_time && <h6>End time is required</h6>}</div>
                
                <br></br>
                <div>Unpaid Break</div>
                <div>
                  Hours
              <input 
              {...register("unpaid_break_hours", { required: true, pattern: /^\d{1,2}$/ })} 
              type='number'
              defaultValue='00'
              min='00'
              max='23'
              style={{width:'5rem'}}
              onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }/>
                Minutes
                <input 
              {...register("unpaid_break_minutes", { required: true, pattern: /^\d{1,2}$/ })} 
              type='number'
              defaultValue='00'
              max='59'
              min='00'
              style={{width:'5rem'}}
              onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }/></div>
                <div>
                {(errors.unpaid_break_hours || errors.unpaid_break_minutes) && <h6>Unpaid Break must be valid</h6>}
                </div>
              <select 
              {...register("pay_type", { required: true })} 
              onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }>
                  <option value="">Pay Type</option>
                  {Pay_Type.map((type) => (<option key={type} value={type}>{type}</option>))}
              </select>
              {errors.pay_type && <h6>Pay type is required</h6>}
              <TextField
                label='Comments'
                {...register('comment', { pattern: /^[A-Za-z0-9 ]*$/ })} 
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
              {errors.comment && <h6>Comments must be valid</h6>}
          </Stack>
          <div className='buttons-for-form'>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="secondary" type='submit' variant="contained">
            New Entry
          </Button>
        </div>
        </form>
        
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
      open={createModalOpen}
      onClose={() => setCreateModalOpen(false)}
      onSubmit={handleCreateNewRow}
      />  
  </>
  );
};


export default EmployeeTable;