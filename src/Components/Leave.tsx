import React, { useCallback, useEffect, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { useParams } from 'react-router-dom';
import { Button,DialogContent, MenuItem, DialogTitle,Stack } from '@mui/material';
import { Leave_Type } from './lists'
import { useForm } from 'react-hook-form';

function EmployeeLeave() {

  let params = useParams()
  const [data, setData] = useState({});
  const [leaveBalance, setLeaveBalance] = useState('...'); //Placeholder whislt data is fetched
  const [leaveBalanceHours, setLeaveBalanceHours] = useState('...'); //Placeholder whislt data is fetched
  const [change, setChange] = useState(false);
  const [leaveEntryModalOpen, setLeaveEntryModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({})

  const validateCheck = useCallback(

    //Function is executed every change of a cell

    (cell) => {

      if (cell.column.id === 'leave_start_date' && !validationErrors['start']) {
        console.log(cell)
        setValidationErrors({...validationErrors, 'start' : new Date(`${cell.row.original.leave_start_date}T12:00:00`)}) //Saving the leave start to validate against
      } else if (cell.column.id === 'leave_end_date' && !validationErrors['end']) {
        setValidationErrors({...validationErrors, 'end' : new Date(`${cell.row.original.leave_end_date}T12:00:00`)}) //Saving the leave end to validate against
      }
      
      const handleBlur = (event) => {
        
        //Validation logic executed each time the field is 'un-focussed'

        const updatedValidationErrors = { ...validationErrors };
        
        if (cell.column.id === 'leave_start_date') {
          updatedValidationErrors['start'] = new Date(`${event.target.value}T12:00:00`) //Saving the updated leave start to validate against
        } else if (cell.column.id === 'leave_end_date') {
          updatedValidationErrors['end'] = new Date(`${event.target.value}T12:00:00`)//Saving the updated leave end to validate against
        }


        if (updatedValidationErrors['start'] > updatedValidationErrors['end']) { 
          updatedValidationErrors[cell.id] = cell.column.columnDef.helperText; //If the leave start is greater than leave end an error is given
        } else {
          delete updatedValidationErrors[cell.id]; //If no further errors, delete the current ones
        }

        setValidationErrors(updatedValidationErrors); //Setting the validation errors to the updated object
        console.log(updatedValidationErrors)
      };
      return {
        onBlur: handleBlur,
        error: !!validationErrors[cell.id], //Boolean of if there is an error (for the cell executing validation function)
        helperText: validationErrors[cell.id], //Error text 
      };
    },
    [validationErrors]
  );

  const handleCancelRowEdits = () => {

    //Remove errors if editing is cancelled

    setValidationErrors({});
  };

  const columns = [
      {
        accessorKey: 'leave_start_date',
        header: 'Leave Start Date',
        helperText: "Leave start date must be earlier or the same as than leave end date",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
          type: 'date'
        }),
      },
      {
        accessorKey: 'leave_end_date',
        header: 'Leave End Date',
        helperText: "Leave end date must be later or the same as than leave start date",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
          type: 'date'
        }),
      },
      {
        accessorKey: 'leave_type',
        header: 'Leave Type',
        muiTableBodyCellEditTextFieldProps: {
          select: true, //Changed to select for dropdown
          children: Leave_Type.map((type) => ( //Mapping the values of the dropdown
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          )),
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        enableEditing: false, //This is unable to be edited
      }
    ]

  useEffect(() => {
    
    //Fetching page data

    async function fetchData()  {
        const res = await fetch(`https://cpa-flask.azurewebsites.net/employee/leave/'${params.userID}'`)
        const data = await res.json()

        setData(data.leave_entrys) //Setting Table data
        setLeaveBalance(data.leave_balance)
        setLeaveBalanceHours(data.leave_balance_hours) //Setting the leave balance display values
    } 
        
    fetchData()

},[change]) // Executed every time variable 'change' is changed

const handleSaveRow = async ({ exitEditingMode, row, values }) => {

  //Function for saving a edited row / editing a leave entry

  console.log(values)
  const res = await fetch(`https://cpa-flask.azurewebsites.net/employee/leave/update/'${row.original.leave_entry_id}'/'${values.leave_start_date}'/'${values.leave_end_date}'/'${values.leave_type}'`)
  const data = await res.json()

  if (data.success === 'Success') {

    //If new leave entry returned a success response

    alert(`Leave entry\n\tFrom: ${values.leave_start_date}   To ${values.leave_end_date}\n was updated successfully`)
    setChange(true)}
    else {

      //If new leave entry returned a failed response

      alert(`An error occured.\n\n\n\n${data.error}`) }
  exitEditingMode(); //required to exit editing mode
};


const handleNewLeaveEntry = async (values) => {

  //Creating a new row / leave entry

  console.log(values)
  const res = await fetch(`https://cpa-flask.azurewebsites.net/employee/leave/new/'${params.userID}'/'${values.start_date}'/'${values.end_date}'/'${values.leave_type}'`)
  const data = await res.json()

  if (data.success === 'Success') {
    
    //If new leave entry returned a success response

    alert(`Leave from\n\t${values.start_date} to ${values.start_date}\nWas created successfully`)
    setChange(true)}
    else {

      //If new leave entry returned a failed response

      alert(`An error occured.\n\n\n\n${data.error}`) }
};

  return (
    <>
    <div className='leave-elements'>
    <div className='Circle-balance'>
      <div>
      <p>{leaveBalance}</p>
      <h4>Weeks</h4></div><div>
      <p>{leaveBalanceHours}</p>
      <h4>Hours</h4></div>
    </div>
    </div>
    <MaterialReactTable
      columns={columns}
      data={data}
      enableFullScreenToggle={false}
      initialState={{ columnPinning: { right: ['status']} }}
      enablePinning
      enableEditing
      editingMode='row'
      onEditingRowCancel={handleCancelRowEdits}
      onEditingRowSave={handleSaveRow}     
      renderTopToolbarCustomActions={() => (
  <Button
    onClick={() => setLeaveEntryModalOpen(true)}
    variant="contained"
  >
    New leave Entry
  </Button>
)}/>
      <NewLeaveEntry
      open={leaveEntryModalOpen}
      onClose={() => setLeaveEntryModalOpen(false)}
      onSubmit={handleNewLeaveEntry}
      />
      </>
  
  );
};

export default EmployeeLeave;



//example of creating a mui dialog modal for creating new rows
const NewLeaveEntry = ({ open, onClose, onSubmit }) => {
const [values, setValues] = useState([]);
const { register, handleSubmit, formState: { errors } } = useForm();

const submitFunc = (information) => {
//put your validation logic here
onSubmit(information);
onClose();
};


return (
  <div className={String(open)}>
<div className={'mui-box-container-form'} >
<DialogTitle textAlign="center">New Leave Entry</DialogTitle>
<DialogContent>
<form onSubmit={handleSubmit(submitFunc)}>
  <Stack
    sx={{
      minWidth: { xs: '300px', sm: '360px', md: '400px' },
      gap: '1.5rem',
      select: {padding: '16.5px 14px',font:'inherit'},
      div: {display:'flex',gap:'1rem',justifyContent:'center',alignItems:'center'},
      padding: '20px 2px 2px 2px'
    }}
  ><div>Start
    <input
    {...register("start_date", { required: true })}
    type='date'
    max={!!values['end_date'] ? values['end_date'] : '' }
    onChange={(e) =>
      setValues({ ...values, [e.target.name]: e.target.value })
    }/><div>{errors.start_date && <h6>Start Date is required</h6>}</div>
    </div>
    <div>End
    <input
    {...register("end_date", { required: true })}
    type='date'
    min={!!values['start_date'] ? values['start_date'] : '' }
    onChange={(e) =>
      setValues({ ...values, [e.target.name]: e.target.value })
    }/><div>{errors.end_date && <h6>End Date is required</h6>}</div>
    </div>
    <select 
    {...register("leave_type", { required: true })} 
    onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }>
                  <option value="">Leave Type</option>
                  {Leave_Type.map((type) => (<option key={type} value={type}>{type}</option>))}
              </select>
              <div>{errors.leave_type && <h6>Leave type is required</h6>}</div>
  </Stack>
  <div className='buttons-for-form'>
<Button onClick={onClose}>Cancel</Button>
<Button type='submit' variant="contained">
  New Entry
</Button>
</div>
</form>

</DialogContent>

</div></div>
);
};