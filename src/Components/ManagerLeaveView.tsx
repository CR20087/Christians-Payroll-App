import React, { useEffect, useMemo, useState } from 'react';
import { Box,IconButton } from '@mui/material';
import { Check, CancelSharp } from '@mui/icons-material';
import { MaterialReactTable } from 'material-react-table';
import { useParams } from 'react-router-dom';

function LeaveView() {
  let params = useParams()
  const [data, setData] = useState({});
  const [change, setChange] = useState(false);

  const columns = useMemo( //Column Defenitions
    () => [
      {
        accessorKey: 'username',
        header: 'Username',
        size:150
      },
      {
        accessorKey: 'leave_start_date',
        header: 'Leave Start',
      },
      {
        accessorKey: 'leave_end_date',
        header: 'Leave End',
        size:50
      },
      {
        accessorKey: 'leave_type',
        header: 'Leave Type',
        size:50
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size:50
      }
    ],
    [],
  );


  useEffect(() => {
    
    //Fetching page data

    async function fetchData()  {
        const res = await fetch(`https://cpa-flask.azurewebsites.net/manager/employee-leave/'${params.userID}'`)
        const data = await res.json()

        setData(data.results) //Setting Table data
    } 
        
    fetchData()

},[change])

  const DeclineLeave = async (row) => {

    //Function to decline an employee leave request

    const res = await fetch(`https://cpa-flask.azurewebsites.net/manager/employee-leave/decline/'${row.original.leave_entry_id}'`)
    const data = await res.json()

  if (data.success === 'Success') {

    //If the decline function is successful

    alert(`${row.original.username}'s leave\n\tFrom ${row.original.leave_start_date}  To ${row.original.leave_end_date}\nWas declined successfully`)
    setChange(true)}
    else {

      //If the decline function is unsuccessful

      alert(`An error occured.\n\n\n\n${data.error}`) }
  }

  const AcceptLeave = async (row) => {

    //Function to accept an employee leave request

    
    const res = await fetch(`https://cpa-flask.azurewebsites.net/manager/employee-leave/accept/'${row.original.leave_entry_id}'`)
    const data = await res.json()

  if (data.success === 'Success') {

    //If the accept function is successful

    alert(`${row.original.username}'s leave\n\tFrom ${row.original.leave_start_date}  To ${row.original.leave_end_date}\nWas granted successfully`)
    setChange(true)}
    else {

      //If the accept function is unsuccessful

      alert(`An error occured.\n\n\n\n${data.error}`) }
  }


  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={data}
        enableFullScreenToggle={false}
        enablePinning
        initialState={{ columnPinning: { right: ['status']} }}
        enableRowActions
        renderRowActions={({ row }) => (
          <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
            <IconButton
              color= 'success'
              onClick={() =>
                AcceptLeave(row)
              }
            >
              <Check />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => {
                DeclineLeave(row)
              }}
            >
              <CancelSharp />
            </IconButton>
          </Box>
        )}
        />
     </>
    )
}
export default LeaveView;