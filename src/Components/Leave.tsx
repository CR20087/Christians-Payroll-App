import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Edit as EditIcon, Delete as DeleteIcon, Email as EmailIcon,  } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import {Box,Button,Dialog,DialogActions,DialogContent, MenuItem, DialogTitle,IconButton,Stack,TextField ,Typography} from '@mui/material';
import { Leave_Type } from '../Components/lists.jsx'


function EmployeeLeave() {
  let params = useParams()
  const [data, setData] = useState({});
  const [leaveBalance, setLeaveBalance] = useState('...');
  const [leaveBalanceHours, setLeaveBalanceHours] = useState('...');
  const [change, setChange] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);


  const columns = useMemo(
    () => [
      {
        accessorKey: 'leave_start_date',
        header: 'Leave Start Date',
      },
      {
        accessorKey: 'leave_end_date',
        header: 'Leave End Date',
        type: 'number',
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
    ],
    [],
  );

  const columns2 = useMemo(
    () => [
      {
        accessorKey: 'leave_start_date',
        header: 'Leave Start Date',
      },
      {
        accessorKey: 'leave_end_date',
        header: 'Leave End Date',
        type: 'number'
      }
    ],
    [],
  );


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
  const res = await fetch(`https://cpa-flask.azurewebsites.net/employee/leave/update/'${params.userID}'/'${values.leave_start_date}'/'${values.leave_end_date}'/'${values.leave_type}'`)
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
  const res = await fetch(`https://cpa-flask.azurewebsites.net/employee/leave/new/'${params.userID}'/'${values.leave_start_date}'/'${values.leave_end_date}'/'${values.leave_type}'`)
  const data = await res.json()

  if (data.success === 'Success') {
    alert(`${values.leave_start_date} was created successfully`)
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
      columns={columns2}
      open={createModalOpen}
      onClose={() => setCreateModalOpen(false)}
      onSubmit={handleCreateNewRow}
      />
      </>
  
  );
};

export default EmployeeLeave;



//example of creating a mui dialog modal for creating new rows
const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
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
<DialogTitle textAlign="center">New Leave Entry</DialogTitle>
<DialogContent>
<form onSubmit={(e) => e.preventDefault()}>
  <Stack
    sx={{
      minWidth: { xs: '300px', sm: '360px', md: '400px' },
      gap: '1.5rem',
      select: {padding: '16.5px 14px',font:'inherit'},
    }}
  >
    {columns.map((column) => (
      <TextField
        key={column.accessorKey}
        label={column.header}
        name={column.accessorKey}
        placeholder='YYYY-MM-DD'
        onChange={(e) =>
          setValues({ ...values, [e.target.name]: e.target.value })
        }
      />
    ))}
    <select name='leave_type' onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }>
                  <option value="">Leave Type</option>
                  {Leave_Type.map((type) => (<option key={type} value={type}>{type}</option>))}
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

</div></div>
);
};