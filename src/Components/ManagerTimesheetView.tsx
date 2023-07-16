import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { useParams } from 'react-router-dom';

function TimesheetView() {
  let params = useParams()
  const [data, setData] = useState({});

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


  useEffect(() => {
    console.log("fetch")    
    async function fetchData()  {
        const res = await fetch(`https://cpa-flask.azurewebsites.net/manager/employee-timesheets/'${params.userID}'`)
        const data = await res.json()

        console.log(data)

        setData(data.results)
    } 
        
    fetchData()

},[params.userID])




  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={data}
        enableFullScreenToggle={false}
        enablePinning
        initialState={{ columnPinning: { left: ['username']} }}
        renderDetailPanel={({ row }) => (
          <Box
            sx={{
              display: 'grid',
              margin: 'auto',
              gridTemplateColumns: '1fr 1fr',
              width: '100%',
            }}
          >
            <Typography></Typography>
          </Box>
        )}
        />
     </>
    )
}
export default TimesheetView;