import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { useParams } from 'react-router-dom';
import { Button,DialogContent,DialogTitle,Stack,TextField,MenuItem } from '@mui/material';
import {Times, Pay_Type } from './lists'
import { useForm } from 'react-hook-form';


function EmployeeTable() {
  let params = useParams()
  const [data, setData] = useState({}); //Timesheet data
  const [data2, setData2] = useState({}); //Timesheet entry data
  const [change, setChange] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const { register, handleSubmit, formState: { errors } } = useForm();

  const validateCheck = useCallback(

    //Input Validation
    (cell) => {

      if (cell.column.id === 'start_time' && !validationErrors['start']) {
        
        setValidationErrors({...validationErrors, 'min' : new Date(`2000-01-01T${cell.row.original.start_time}`)}) //Saving the entry start to validate against
      } else if (cell.column.id === 'end_time' && !validationErrors['end']) {
        setValidationErrors({...validationErrors, 'max' : new Date(`2000-01-01T${cell.row.original.end_time}`)}) //Saving the entry end to validate against
      }

      const handleBlur = (event) => {
        
        //Validation function

        
        const updatedValidationErrors = { ...validationErrors };


        if (cell.column.id === 'start_time') {
          updatedValidationErrors['min'] = new Date(`2000-01-01T${event.target.value}`) //Saving the updated entry start to validate against
        } else if (cell.column.id === 'end_time') {
          updatedValidationErrors['max'] = new Date(`2000-01-01T${event.target.value}`) //Saving the updated entry end to validate against
        } 
                
        if (event.target.value === "") { //Special validation for comments if empty
          if (cell.column.id !== 'comment') {
          updatedValidationErrors[cell.id] = `${cell.column.columnDef.header} is required`;

        }} else if (cell.column.id === 'comment') { //Special validation for comments if matching pattern
            if (!cell.column.columnDef.regex.test(event.target.value)) {
          updatedValidationErrors[cell.id] = cell.column.columnDef.helperText;

        }} else if (updatedValidationErrors['min'] > updatedValidationErrors['max']) {
          updatedValidationErrors[cell.id] = cell.column.columnDef.helperText;
        } else {
          delete updatedValidationErrors[cell.id]; //If no further errors, delete the current ones
        }
         
        setValidationErrors(updatedValidationErrors); //Setting the validation errors to the updated object
      };  
      
      return {
        onBlur: handleBlur,
        error: !!validationErrors[cell.id], //Boolean of if there is an error (for the cell executing validation function)
        helperText: validationErrors[cell.id], //Error text 
      };
    },
    [validationErrors]
  );

  useEffect(() => {
    // This will run after each render when validationErrors changes

  }, [validationErrors]);

  const columns = useMemo( //Timesheet column defenitions
    () => [
      
      // Various column sizing to reduce gap between columns
      {
        accessorKey: 'period_start',
        header: 'Period Start',
      },
      {
        accessorKey: 'period_end',
        header: 'Period End',
        size: 100
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

  const columns2 = [ //Timesheet entry column defenitions
      {
        accessorKey: 'date',
        header: 'Date',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
          type: 'date' //Type 'data' to have an inbuilt select menu
        }),
      },
      {
        accessorKey: 'start_time',
        header: 'Start Time',
        helperText: "Start time must be greater than End time",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
          type: 'time', //Type 'time' to have an inbuilt select menu
        }),
      },
      {
        accessorKey: 'end_time',
        header: 'End Time',
        helperText: "End time must be greater than Start time",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
          type: 'time', //Type 'time' to have an inbuilt select menu
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
          select: true, //Changed to a dropdown
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
        regex: /^[A-Za-z0-9,.() ]*$/, //Regex pattern for validation checking
        helperText: "Comment must not include any special symbols, Allowed symbols: '(),.'",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell)
        }),
      }
    ]

  useEffect(() => {
    
    //Fetch page data

    async function fetchData()  {
        const res = await fetch(`https://cpa-flask.azurewebsites.net/employee/timesheet`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({'username' : `'${params.userID}'`})
        })
        const data = await res.json()

        setData(data.results) //Set timesheet data

        const res2 = await fetch(`https://cpa-flask.azurewebsites.net/employee/timesheet-entrys`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({'username' : `'${params.userID}'`,
          'start_date' : `'${data.entry_start_date}'`,
          'end_date' : `'${data.entry_end_date}'`
        })
        })
        const data2 = await res2.json()

        setData2(data2.results) //Set timesheet entry data

        setChange(false)
    } 
        
    fetchData()

},[change])

const handleSaveRow = async ({ exitEditingMode, row, values }) => {

  //Function to save an edited entry

  
  const res = await fetch(`https://cpa-flask.azurewebsites.net/employee/timesheet-entrys/update`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'timesheet_entry_id' :`'${row.original.timesheet_entry_id}'`,
    'date' : `'${values.date}'`,
    'start_time' : `'${values.start_time}'`,
    'end_time' : `'${values.end_time}'`,
    'unpaid_break' : `'${values.unpaid_break}'`,
    'pay_type' : `'${values.pay_type}'`,
    'comment' : `'${values.comment}'`
  })
  })
  const data = await res.json()

  if (data.success === 'Success') {

    //If the update returned a success status

    alert(`Entry updated succesfully (ID no.${row.original.timesheet_entry_id})`)
    setChange(true)}
    else {

      //If the update returned a failed status

      alert(`An error occured.\n\n\n\n${data.error}`) }

  exitEditingMode(); 
};

const DeleteEntry = async (table) => {

  //Function to delete a timesheet entry

  if (window.confirm(`Are you sure you want to delete${table.getSelectedRowModel().rows.map((row) => (`\n\t${row.original.date} (Entry ID no.${row.original.timesheet_entry_id})`))}`)) {

    const selected_array = `${table.getSelectedRowModel().rows.map((row) => (`${row.original.timesheet_entry_id}`))}`

    const res = await fetch(`https://cpa-flask.azurewebsites.net/employee/timesheet-entrys/delete`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selected_array)
    })
    const data = await res.json()
    
    if (data.success === 'Success') {

      //If the delete returned a success status
  
      alert(`Selected rows were deleted successfully`)
      setChange(true)}
    else {

      //If the delete returned a failed status

      alert(`An error occured.\n\n\n\n${data.error}`) }
  }
}

const handleCreateNewEntry = async (values) => {

  //Function to submit a new timesheet entry

  const res = await fetch(`https://cpa-flask.azurewebsites.net/employee/timesheet-entrys/new`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'username' : `'${params.userID}'`,
    'date' : `'${values.date}'`,
    'start_time' : `'${values.start_time}'`,
    'end_time' : `'${values.end_time}'`,
    'unpaid_break' : `'${[values.unpaid_break_hours,values.unpaid_break_minutes].join(':')}'`,
    'pay_type' : `'${values.pay_type}'`,
    'comment' : `'${values.comment}'`})
  })
  const data = await res.json()

  if (data.success === 'Success') {

    //If the new entry was successful

    alert(`${values.date} was created successfully`)
    setChange(true)}
  else {

    //If the new entry failed

    alert(`An error occured.\n\n\n\n${data.error}`) }
};

const CreateNewEntry = ({ open,  onClose, onSubmit }) => { //New timesheet entry modal
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
            }} //Styling for new entry form
          >
            <div>
              Date
              <input
              {...register("date", { required: true })}
              type='date' //Date type
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
              type='time' //Time type
              max={!!values['end_time'] ? values['end_time'] : '' }
              {...register("start_time", { required: true })}
              onChange={(e) => 
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                />{errors.start_time && <h6>Start time is required</h6>}</div>

                <div>End Time
              <input 
              {...register("end_time", { required: true })} 
              type='time' //Time type
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
              defaultValue='00' //So the user can not touch the form if they want to hve a default '00:00' unpaid break
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
          <Button type='submit' variant="contained">
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
      initialState={{ columnPinning: { left: ['period_start','period_end']} }} //Pinned the Start and End columns to the left
      enablePinning
      renderTopToolbarCustomActions={() => (
  <Button
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
              onClick={() => setCreateModalOpen(true)}
              variant="contained"
            >New Time sheet Entry</Button>
            <Button
                color="error"
                onClick={() => DeleteEntry(table)}
                variant="contained"
            >Delete</Button>
          </div>
        );
      }}/>
 </div>
      <CreateNewEntry
      open={createModalOpen}
      onClose={() => setCreateModalOpen(false)}
      onSubmit={handleCreateNewEntry}
      />  
  </>
  );
};


export default EmployeeTable;