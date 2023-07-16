import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Edit as EditIcon, Delete as DeleteIcon, Email as EmailIcon,  } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import {Box,Button,Dialog,DialogActions,DialogContent,DialogTitle,IconButton,Stack,TextField ,Typography} from '@mui/material';


function EmployeeLeave() {
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
        type: 'number'
      },
      {
        accessorKey: 'end_time',
        header: 'End Time',
        type: 'number'
      },
      {
        accessorKey: 'unpaid_break',
        header: 'Unpaid Break',
        type: 'number'
      },
      {
        accessorKey: 'pay_type',
        header: 'Pay Type',
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
    } 
        
    fetchData()

},[change])

const handleCancelRowEdits = () => {
  setValidationErrors({});
};

const handleSaveRow = async ({ exitEditingMode, row, values }) => {
  //if using flat data and simple accessorKeys/ids, you can just do a simple assignment here.
  console.log(values)
  const res = await fetch(`https://cpa-flask.azurewebsites.net/manager/employee-list/update/${values.bank_account}/${values.benefits}/${values.child_support}/${values.email}/${values.final_pay}/${values.first_name}/${values.kiwisaver}/${values.last_name}/${values.one_off_deduction}/${values.pay_rate}/${values.phone}/${values.student_loan}/${values.tax_credit}/${values.tax_rate}/${values.username}/${row.original.username}/${values.weekly_allowance}/${values.weekly_allowance_nontax}`)
  const data = await res.json()

  if (data.success === 'true') {
    alert(`${values.first_name} ${values.last_name} (${values.username}) was updated successfully`)
    setChange(true)}
    else {
      alert(`An error occured.\n\n\n\n${data.error}`) }
  //send/receive api updates here
  exitEditingMode(); //required to exit editing mode
};
const handleCreateNewRow = (values) => {

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
<DialogTitle textAlign="center">New Timesheet Entry</DialogTitle>
<DialogContent>
<form onSubmit={(e) => e.preventDefault()}>
  <Stack
    sx={{
      minWidth: { xs: '300px', sm: '360px', md: '400px' },
      gap: '1.5rem',
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