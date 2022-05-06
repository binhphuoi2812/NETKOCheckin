import React, { useEffect, useState } from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { NETKO_MEMBER } from '../Utils/Utils'
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CSVLink, CSVDownload } from "react-csv";
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';

import "../assets/checkList.scss"

const csvData = [
    ["firstname", "lastname", "email"],
    ["Ahmed", "Tomi", "ah@smthing.co.com"],
    ["Raed", "Labes", "rl@smthing.co.com"],
    ["Yezzi", "Min l3b", "ymin@cocococo.com"]
];

export default function CheckinList() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [employee, setListEmployee] = useState(0);
    const [value, setValue] = useState(new Date());
    const [csvData, setCsvData] = useState([["ID", "MaID", "Ten", "Email", "Ngay", "GioDen", "GioVe", "workingHour"]]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    function createData(ID, MaID, Ten, Email, Ngay, GioDen, GioVe, workingHour) {
        return { ID, MaID, Ten, Email, Ngay, GioDen, GioVe, workingHour };
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const getWorkingHour = (start, end) => {
        let startWorkingDay = start.split(":");
        let endWorkingDay = end.split(":");
        let total = (parseInt(endWorkingDay[0]) * 60 * 60 + parseInt(endWorkingDay[1]) * 60 + parseInt(endWorkingDay[2]) - parseInt(startWorkingDay[0]) * 60 * 60 + parseInt(startWorkingDay[1]) * 60 + parseInt(startWorkingDay[2])) / 3600;
        return total.toFixed(2);
    }
    const handleChangeDate = (newValue) => {
        fetchData(formatDateTime(newValue));
        setValue(newValue);
    }

    const formatDateTime = (time) => {
        return time.toISOString().slice(0, 10).replaceAll("-", "")
    }

    const fetchData = (date) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer Q3zFfq0mRzVIyHqnn-c2MRI1WjwUKiEFiyL5i6zoyKbQgflGngO9NbO-9ttdI5SneL2ElmJR2cWaH83MDiybONu0kgB1W8duQOw_6XK5HbKpICEFcPV7mBem2liuAPZku-tUIwchLGowmx0Fz9dmQg-jDTrrXffkWbcsEluCkDGSM1Onbeki3sREKRmUuiI2rWc_omUT3cD_cjWjJEx-gWo5IAZrFSrPoSRRsXxHqjdIjMYAxDRBoZiqKp35LP-DzqqExCFJ-poGwWzsOnUQ6AVHQcfcfDTWvNCsz46Cm_EZapQkaDDYi3RaSrRfpZ1d");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch(`http://116.101.122.171:9090/api/InOutNAL?ymd=${date}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                let listEmployee = [];
                result.map((item) => {
                    if (NETKO_MEMBER.indexOf(item.MaID) > -1) {
                        let workingHour = 0;
                        if (item.GioVe) {
                            workingHour = getWorkingHour(item.GioDen, item.GioVe);
                        }
                        listEmployee.push(createData(item.ID, item.MaID, item.Ten, item.Email, item.Ngay, item.GioDen, item.GioVe, workingHour))
                        csvData.push([item.ID, item.MaID, item.Ten, item.Email, item.Ngay, item.GioDen, item.GioVe, workingHour])
                    }
                })
                setListEmployee(listEmployee)
                setCsvData([...csvData]);
            })
            .catch(error => console.log('error', error));
    }

    useEffect(() => {
        var todayDate = formatDateTime(new Date());
        fetchData(todayDate);

    }, [])

    return (
        <div className="main-content">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    label="Day Select"
                    minDate={new Date('2017-01-01')}
                    value={value}
                    onChange={handleChangeDate}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
            <CSVLink data={csvData} filename={`checkin-${formatDateTime(value)}.csv`} className="export-csv">
                <Button variant="contained" endIcon={<SendIcon />} className="btn-export-csv">
                    Export CSV
                </Button>
            </CSVLink>
            <Paper sx={{ width: '100%' }} className="table-list">
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">
                                    ID
                                </TableCell>
                                <TableCell align="center">
                                    MaID
                                </TableCell>
                                <TableCell align="center">
                                    Ten
                                </TableCell>
                                <TableCell align="center">
                                    Email
                                </TableCell>
                                <TableCell align="center">
                                    Ngay
                                </TableCell>
                                <TableCell align="center">
                                    GioDen
                                </TableCell>
                                <TableCell align="center">
                                    GioVe
                                </TableCell>
                                <TableCell align="center">
                                    Thoi Gian Lam Viec
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employee && employee
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.ID}>
                                            <TableCell align="center">
                                                {row.ID}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.MaID}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.Ten}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.Email}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.Ngay}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.GioDen}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.GioVe}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.workingHour}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={employee.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>

    );
}