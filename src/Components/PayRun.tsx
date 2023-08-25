import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Edit as EditIcon, Delete as DeleteIcon, Email as EmailIcon,  } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import {Box,Button,Dialog,DialogActions,DialogContent,DialogTitle,IconButton,Stack,TextField ,Typography, MenuItem} from '@mui/material';
import {Times, Years, Month, Days} from './lists'
import { useForm } from 'react-hook-form';

function PayTable() {
  let params = useParams()
  const [data, setData] = useState({});
  const [EmpNameArray, setEmpNameArray] = useState([]);
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
 
  useEffect(() => {
    console.log("fetch")    
    async function fetchData()  {
        const res = await fetch(`https://cpa-flask.azurewebsites.net/manager/pay-run/'${params.userID}'`)
        const data = await res.json()

        console.log(data)
        setData(data.results)
        setChange(false)
        const names = [...new Set(data.results.map((emp) => ({ name: emp.name, username: emp.username })))];
        setEmpNameArray(names)
    } 
        
    fetchData()

},[change])

const handleAddStatutoryHoliday = async (values) => {

  const res = await fetch(`https://cpa-flask.azurewebsites.net/manager/pay-run/add-stat/'${values.username}'/'${values.date}'/'${[values.stat_length_hours,values.stat_length_minutes].join(':')}'`)
  const data = await res.json()

  if (data.success === 'Success') {
    alert(`Successfully added statutory holiday for\n\t${values.username} on ${values.date} (${[values.stat_length_hours,values.stat_length_minutes].join(':')} hrs)`)
    setChange(true)}
  else {
    alert(`An error occured.\n\n\n\n${data.error}`) }
  }

const PaySelectedEmployees = async (table) => {

  
  if (window.confirm(`Are you sure you want execute payrun(s) for:${table.getSelectedRowModel().rows.map((row) => (`\n\t${row.original.name}\nPeriod ending ${row.original.pay_period_end}`))}`)) {

    const selected_array = table.getSelectedRowModel().rows.map((row) => (`${row.original.username},${row.original.pay_period_end}`))
    const res = await fetch('https://cpa-flask.azurewebsites.net/manager/pay-run/execute/selected',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selected_array)
    })
    const data = await res.json()

    if (data.success === 'Success') {
      alert(`Selected rows were deleted successfully`)
      setChange(true)}
    else {
      alert(`An error occured.\n\n\n\n${data.error}`) }
    }
  }

const PayAllEmployees = async (table) => {

  if (window.confirm(`Are you sure you want execute payrun(s) for:${table.getRowModel().rows.map((row) => (`\n\t${row.original.name}\nPeriod ending ${row.original.pay_period_end}`))}`)) {
    const res = await fetch(`https://cpa-flask.azurewebsites.net/manager/pay-run/execute/all/${params.userID}`)
    const data = await res.json()

    if (data.success === 'Success') {
      alert(`All employees were paid successfully`)
      setChange(true)}
    else {
      alert(`An error occured.\n\n\n\n${data.error}`) }
    }
  }

const CreateNewEntry = ({ open, onClose, onSubmit }) => {
  const [values, setValues] = useState([])
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const submitFunc = (information) => {
  //put your validation logic here
  onSubmit(information);
  onClose();
  };
  
  return (
    <div className={String(open)}>
      <div className={'mui-box-container-form'} >
        <DialogTitle textAlign="center">New Statutory Holiday</DialogTitle>
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
            >
              <select 
              {...register("username", { required: true })} 
              onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }>
                    <option value="">Employee</option>
                    {EmpNameArray.map((object) => (<option key={object.username} value={object.username}>{object.name}</option>))}
                </select><div>{errors.username && <h6>Username is required</h6>}</div>
                <div>Date
                  <input
                  {...register("date", { required: true })}
                  type='date'
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }/><div>{errors.date && <h6>Date is required</h6>}</div>
                </div>

                  <br></br>

                <div>Statutory Holiday Hours</div>
                <div>
                  Hours
              <input 
              {...register("stat_length_hours", { required: true, pattern: /^\d{1,2}$/ })} 
              type='number'
              placeholder='00'
              min='00'
              max='23'
              style={{width:'5rem'}}
              onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }/>
                Minutes
                <input 
              {...register("stat_length_minutes", { required: true, pattern: /^\d{1,2}$/ })} 
              type='number'
              placeholder='00'
              max='59'
              min='00'
              style={{width:'5rem'}}
              onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }/></div>
                <div>
                {(errors.stat_length_hours || errors.stat_length_minutes) && <h6>Unpaid Break must be valid</h6>}
                </div><div>{errors.stat_length && <h6>Stat Day length is required</h6>}</div>
            </Stack>
            <div className='buttons-for-form'>
            <Button onClick={onClose}>Cancel</Button>
            <Button color="secondary" type='submit' variant="contained">
              Add Statutory Holiday
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
      initialState={{ columnPinning: { left: ['name']} }}
      enablePinning
      enableRowSelection
      renderTopToolbarCustomActions={({table}) => {
        return(
        <>
  <Button
    color="secondary"
    onClick={() => PayAllEmployees(table)}
    variant="contained"
  >Pay All</Button>
  <Button
    color="secondary"
    onClick={() => PaySelectedEmployees(table)}
    variant="contained"
  >Pay selected</Button>
  <Button
    color="secondary"
    onClick={() => setStatutoryModalOpen(true)}
    variant="contained"
  >Add Statutory holiday</Button>
    </>
  )}}
  />
  <CreateNewEntry
      open={statutoryOpen}
      onClose={() => setStatutoryModalOpen(false)}
      onSubmit={handleAddStatutoryHoliday}
      />
</>
  );
};


export default PayTable;