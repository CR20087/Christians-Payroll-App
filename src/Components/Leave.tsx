import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Edit as EditIcon, Delete as DeleteIcon, Email as EmailIcon,  } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import {Box,Button,Dialog,DialogActions,DialogContent, MenuItem, DialogTitle,IconButton,Stack,TextField ,Typography} from '@mui/material';
import {Leave_Type, Years, Month, Days} from './lists'
import { useForm } from 'react-hook-form';

function EmployeeLeave() {
  let params = useParams()
  const [data, setData] = useState({});
  const [leaveBalance, setLeaveBalance] = useState('...');
  const [leaveBalanceHours, setLeaveBalanceHours] = useState('...');
  const [change, setChange] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({})

  const validateCheck = useCallback(
    (cell) => {
      const handleBlur = (event) => {
        const updatedValidationErrors = { ...validationErrors };
        
        if (cell.column.id === 'leave_start_date') {
          updatedValidationErrors['start'] = new Date(`${event.target.value}T12:00:00`)
        } else if (cell.column.id === 'leave_end_date') {
          updatedValidationErrors['end'] = new Date(`${event.target.value}T12:00:00`)
        }


        if (updatedValidationErrors['start'] > updatedValidationErrors['end']) {
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
          select: true, //change to select for a dropdown
          children: Leave_Type.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          )),
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        enableEditing: false,
      }
    ]

  useEffect(() => {
    console.log("fetch")    
    async function fetchData()  {
        const res = await fetch(`https://cpa-flask.azurewebsites.net/employee/leave/'${params.userID}'`)
        const data = await res.json()

        console.log(data)
        setData(data.leave_entrys)
        setLeaveBalance(data.leave_balance)
        setLeaveBalanceHours(data.leave_balance_hours)
    } 
        
    fetchData()

},[change])

const handleSaveRow = async ({ exitEditingMode, row, values }) => {
  //if using flat data and simple accessorKeys/ids, you can just do a simple assignment here.
  console.log(values)
  const res = await fetch(`https://cpa-flask.azurewebsites.net/employee/leave/update/'${row.original.leave_entry_id}'/'${values.leave_start_date}'/'${values.leave_end_date}'/'${values.leave_type}'`)
  const data = await res.json()

  if (data.success === 'Success') {
    alert(`Leave entry\n\tFrom: ${values.leave_start_date}   To ${values.leave_end_date}\n was updated successfully`)
    setChange(true)}
    else {
      alert(`An error occured.\n\n\n\n${data.error}`) }
  //send/receive api updates here
  exitEditingMode(); //required to exit editing mode
};


const handleCreateNewRow = async (values) => {
  console.log(values)
  const res = await fetch(`https://cpa-flask.azurewebsites.net/employee/leave/new/'${params.userID}'/'${values.start_date}'/'${values.end_date}'/'${values.leave_type}'`)
  const data = await res.json()

  if (data.success === 'Success') {
    alert(`Leave from\n\t${values.start_date} to ${values.start_date}\nWas created successfully`)
    setChange(true)}
    else {
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
      onEditingRowSave={handleSaveRow}
      
      renderTopToolbarCustomActions={() => (
  <Button
    color="secondary"
    onClick={() => setCreateModalOpen(true)}
    variant="contained"
  >
    New leave Entry
  </Button>
)}/>
      <CreateNewAccountModal
      open={createModalOpen}
      onClose={() => setCreateModalOpen(false)}
      onSubmit={handleCreateNewRow}
      />
      </>
  
  );
};

export default EmployeeLeave;



//example of creating a mui dialog modal for creating new rows
const CreateNewAccountModal = ({ open, onClose, onSubmit }) => {
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
<Button color="secondary" type='submit' variant="contained">
  New Entry
</Button>
</div>
</form>

</DialogContent>

</div></div>
);
};