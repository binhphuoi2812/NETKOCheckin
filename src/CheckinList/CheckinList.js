import { React, useEffect, useState } from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

export default function CheckinList() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [employee, setListEmployee] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    function createData(ID, MaID, Ten, Email, Ngay, GioDen, GioVe) {
        return { ID, MaID, Ten, Email, Ngay, GioDen, GioVe };
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer Q3zFfq0mRzVIyHqnn-c2MRI1WjwUKiEFiyL5i6zoyKbQgflGngO9NbO-9ttdI5SneL2ElmJR2cWaH83MDiybONu0kgB1W8duQOw_6XK5HbKpICEFcPV7mBem2liuAPZku-tUIwchLGowmx0Fz9dmQg-jDTrrXffkWbcsEluCkDGSM1Onbeki3sREKRmUuiI2rWc_omUT3cD_cjWjJEx-gWo5IAZrFSrPoSRRsXxHqjdIjMYAxDRBoZiqKp35LP-DzqqExCFJ-poGwWzsOnUQ6AVHQcfcfDTWvNCsz46Cm_EZapQkaDDYi3RaSrRfpZ1d");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("http://116.101.122.171:9090/api/InOutNAL?ymd=20220504", requestOptions)
            .then(response => response.json())
            .then(result => {
                let listEmployee = [];
                result.map((item) => {
                    listEmployee.push(createData(item.ID, item.MaID, item.Ten, item.Email, item.Ngay, item.GioDen, item.GioVe))
                })
                setListEmployee(result)

            })
            .catch(error => console.log('error', error));
    }, [])

    return (
        <Paper sx={{ width: '100%' }}>
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
    );
}