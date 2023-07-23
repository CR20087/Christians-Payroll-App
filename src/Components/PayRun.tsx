import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Edit as EditIcon, Delete as DeleteIcon, Email as EmailIcon,  } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import {Box,Button,Dialog,DialogActions,DialogContent,DialogTitle,IconButton,Stack,TextField ,Typography, MenuItem} from '@mui/material';
import {Times, Pay_Type} from './lists'

function PayTable() {
  let params = useParams()
  const [data, setData] = useState({});
  const [usernameArray, setUsernameArray] = useState([]);
  const [change, setChange] = useState(false);
  const [statutoryOpen, setStatutoryModalOpen] = useState(false);
  

  

  const columns = useMemo(
    () => [
      
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'pay_period_start',
        header: 'Pay Period Start',
      },
      {
        accessorKey: 'pay_period_end',
        header: 'Pay Period End',
      },
      {
        accessorKey: 'total_hours',
        header: 'Total Hours',
      },
      {
        accessorKey: 'pay_rate',
        header: 'Pay Rate',
      },
      {
        accessorKey: 'leave_taken',
        header: 'Leave Taken',
      },
      {
        accessorKey: 'leave_days',
        header: 'Leave Days',
      },
      {
        accessorKey: 'gross_pay',
        header: 'Gross Pay',
      },
      {
        accessorKey: 'one_off_deduction',
        header: 'One Off Deduction',
      },
      {
        accessorKey: 'total_deductions',
        header: 'Total Deductions',
      },
      
      {
        accessorKey: 'net_pay',
        header: 'Net Pay',
      }
    ],
    [],
  );

  const columns2 = useMemo(
    () => [
      {
        accessorKey: 'date',
        header: 'Date',
        placeHolder: 'YYYY-MM-DD'
      }
    ],
    [],
  );
 
  useEffect(() => {
    console.log("fetch")    
    async function fetchData()  {
        const res = await fetch(`https://cpa-flask.azurewebsites.net/manager/pay-run/'${params.userID}'`)
        const data = await res.json()

        console.log(data)
        setData(data.results)
        setChange(false)
        const usernames = [...new Set(data.results.map((emp) => (emp.username)))]
        setUsernameArray(usernames)
    } 
        
    fetchData()

},[change])

const handleAddStatutoryHoliday = async () => {}

const PayAllEmployees = async () => {}

const PaySelectedEmployees = async () => {}


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
                  placeholder={column.placeHolder}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                />
              ))}
              <select name='username' onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }>
                    <option value="">Username</option>
                    {usernameArray.map((username) => (<option key={username} value={username}>{username}</option>))}
                </select>
            </Stack>
          </form>
          <div className='buttons-for-form'>
            <Button onClick={onClose}>Cancel</Button>
            <Button color="secondary" onClick={handleSubmit} variant="contained">
              Add Statutory Holiday
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
      initialState={{ columnPinning: { left: ['name']} }}
      enablePinning
      enableRowSelection
      renderTopToolbarCustomActions={() => (
        <>
  <Button
    color="secondary"
    onClick={() => PayAllEmployees()}
    variant="contained"
  >Pay All</Button>
  <Button
    color="secondary"
    onClick={() => PaySelectedEmployees()}
    variant="contained"
  >Pay selected</Button>
  <Button
    color="secondary"
    onClick={() => setStatutoryModalOpen(true)}
    variant="contained"
  >Add Statutory holiday</Button>
    </>
    )}
  />
  <CreateNewEntry
      columns={columns2}
      open={statutoryOpen}
      onClose={() => setStatutoryModalOpen(false)}
      onSubmit={handleAddStatutoryHoliday}
      />
</>
  );
};


export default PayTable;