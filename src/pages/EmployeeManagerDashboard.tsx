import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
    PieChart,
    Pie,
    Cell,
    ScatterChart,
    Scatter,
    ZAxis,
} from 'recharts';
import { Container, Typography, Box, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { generateFakeEmployeeData, EmployeeData } from '../api/faker-api';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter, GridToolbar } from '@mui/x-data-grid';
import CountUp from 'react-countup';

const StateCard = ({ header, count }: { header: string; count: number }) => {
    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, textAlign: 'center', mb: 3, width: "100%" }}>
            <Typography variant="h6" color="text.secondary">
                {header}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                <CountUp end={count} duration={2} />
            </Typography>
        </Paper>
    );
};

interface CustomTooltipProps {
    active?: boolean;
    payload?: { payload: { firstName: string; dailyEarning: number } }[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    const theme = useTheme();
    if (active && payload && payload.length > 0) {
        return (
            <Box
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    p: 1.5,
                    borderRadius: 2,
                    color: theme.palette.text.primary,
                }}
            >
                <Typography variant="body2">{`Name: ${payload[0].payload.firstName}`}</Typography>
                <Typography variant="body2">{`Daily Earning: $${payload[0].payload.dailyEarning}`}</Typography>
            </Box>
        );
    }
    return null;
};


function CustomToolbar() {
    return (
        <GridToolbarContainer sx={{ justifyContent: 'space-between', p: 1 }}>
            <GridToolbarQuickFilter />
            <GridToolbar />
        </GridToolbarContainer>
    );
}

const CustomScatterTooltip = ({ payload, active }: { payload: any, active: boolean }) => {
    if (!active || !payload?.length) return null;
    const point = payload[0].payload as EmployeeData;
    return (
        <Paper sx={{ p: 1 }}>
            <Typography>{point.firstName} {point.lastName}</Typography>
            <Typography>Attendance: {(point.attendanceRate * 100).toFixed(0)}%</Typography>
            <Typography>Performance: {point.performanceRating}%</Typography>
            <Typography>Hours: {point.hoursWorked}</Typography>
        </Paper>
    );
};


const EmployeeManagerDashboard = () => {
    const theme = useTheme();

    const [data, setData] = useState<EmployeeData[]>([]);
    const [selectedUser, setSelectedUser] = useState<EmployeeData | null>(null);
    const [hourlyData, setHourlyData] = useState<{ name: string, value: number }[]>([]);
    const [numberOfEmployees, setNumberOfEmployees] = useState<number>(100);
    const [departments, setDepartments] = useState<Record<string, number>>({});
    useEffect(() => {
        const generated = generateFakeEmployeeData(numberOfEmployees);
        setData(generated);
        setSelectedUser(generated[0]);
        const departmentCount: Record<string, number> = {};

        generated.forEach((employee) => {
            const dept = employee.department;
            departmentCount[dept] = (departmentCount[dept] || 0) + 1;
        });


        setDepartments(departmentCount);
    }, [numberOfEmployees]);

    useEffect(() => {
        if (selectedUser) {
            setHourlyData([
                {
                    name: `${selectedUser.firstName} ${selectedUser.lastName}`,
                    value: selectedUser.hoursWorked,
                },
                {
                    name: 'Hours Remaining',
                    value: 8 - selectedUser.hoursWorked,
                },
            ]);
        }
    }, [selectedUser]);

    const COLORS = [
        '#9c27b0', // deep purple
        '#ff9800', // orange
        '#00bcd4', // cyan
        '#8bc34a', // light green,
        "#d10f9a"
    ];


    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
                HR Dashboard
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, width: '100%', justifyContent: 'center' }}>
                <StateCard header="Total Users" count={data.length} />
                <StateCard header="Total Hours" count={data.reduce((acc, user) => acc + user.hoursWorked, 0)} />
                <StateCard header="Total Earnings" count={data.reduce((acc, user) => acc + user.dailyEarning, 0)} />
                <StateCard header="Completed Tasks" count={data.reduce((acc, user) => acc + user.tasksCompleted, 0)} />
                <StateCard header="Assigned Projects" count={data.reduce((acc, user) => acc + user.projectsAssigned, 0)} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                {/* Line Chart */}
                <Paper
                    elevation={3}
                    sx={{
                        borderRadius: 3,
                        p: 3,
                        flex: 2,
                        backgroundColor: theme.palette.background.paper,
                    }}
                >
                    <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                        Hours Worked vs Earnings
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart
                            data={data}
                            onClick={(e) => {
                                const point = e?.activePayload?.[0]?.payload as EmployeeData;
                                if (point) setSelectedUser(point);
                            }}
                        >
                            <CartesianGrid stroke={theme.palette.divider} />
                            <XAxis
                                dataKey="hoursWorked"
                                stroke={theme.palette.text.primary}
                                tick={{ fill: theme.palette.text.primary }}
                            />
                            <YAxis
                                dataKey="dailyEarning"
                                stroke={theme.palette.text.primary}
                                tick={{ fill: theme.palette.text.primary }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ color: theme.palette.text.primary }} />
                            <Line
                                type="monotone"
                                dataKey="dailyEarning"
                                stroke={theme.palette.secondary.main || '#e91e63'}
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Paper>

                {/* Pie Chart */}
                <Paper
                    elevation={3}
                    sx={{
                        borderRadius: 3,
                        p: 3,
                        flex: 1,
                        backgroundColor: theme.palette.background.paper,
                    }}
                >
                    <Typography variant="h6" align="center" gutterBottom>
                        {selectedUser?.firstName} {selectedUser?.lastName}'s Hours Breakdown
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                        {"Yesterday: "}{new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                dataKey="value"
                                data={hourlyData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                                isAnimationActive={false}
                            >
                                {hourlyData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: theme.palette.background.paper,
                                    border: `1px solid ${theme.palette.divider}`,
                                }}
                                itemStyle={{
                                    color: theme.palette.text.primary,
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Paper>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mt: 2 }}>
                <Paper elevation={3} sx={{
                    borderRadius: 3,
                    p: 3,
                    flex: 2,
                    backgroundColor: theme.palette.background.paper,
                }}>

                    <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>Department Distribution</Typography>
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie dataKey="value"
                                data={Object.entries(departments).map(([name, count]) => ({ name, value: count }))}
                                cx="50%" cy="50%"
                                outerRadius={80}
                                label>
                                {Object.entries(departments).map(([], index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend wrapperStyle={{ color: theme.palette.text.primary }} />
                        </PieChart>
                    </ResponsiveContainer>
                </Paper>
                <Paper elevation={3} sx={{
                    borderRadius: 3,
                    p: 3,
                    flex: 2,
                    backgroundColor: theme.palette.background.paper,
                }}>
                    <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>Employee Performance</Typography>
                    {/* Scatter Plot mapping attendanceRate vs performanceRating (spot high‑performers with perfect attendance) */}
                    <ResponsiveContainer width="100%" height={400}>
                        <ScatterChart margin={{ top: 40, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid stroke={theme.palette.divider} />
                            <XAxis
                                type="number"
                                dataKey="attendanceRate"
                                name="Attendance"
                                unit="%"
                                domain={['dataMin-0.05', 'dataMax']}
                                tickFormatter={(v) => `${v * 100}`}
                                stroke={theme.palette.text.primary}
                            />
                            <YAxis
                                type="number"
                                dataKey="performanceRating"
                                name="Performance"
                                unit="%"
                                domain={[0, 100]}
                                stroke={theme.palette.text.primary}
                            />
                            <ZAxis type="number" dataKey="hoursWorked" range={[60, 400]} />

                            <Tooltip content={<CustomScatterTooltip payload={undefined} active={false} />} />
                            <Legend wrapperStyle={{ color: theme.palette.text.primary }} />
                            <Scatter
                                name="Employees"
                                data={data}
                                fill={theme.palette.secondary.main}
                            />
                        </ScatterChart>
                    </ResponsiveContainer>

                </Paper>
            </Box>
            <Paper elevation={3} sx={{ borderRadius: 3, p: 3, flex: 1, backgroundColor: theme.palette.background.paper, mt: 4 }}>

                <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>Employee List</Typography>

                <DataGrid
                    rows={data}
                    columns={[
                        { field: 'firstName', headerName: 'First Name', flex: 1 },
                        { field: 'lastName', headerName: 'Last Name', flex: 1 },
                        { field: 'department', headerName: 'Department', flex: 1 },
                        { field: 'projectsAssigned', headerName: 'Assigned Projects', flex: 1 },
                        { field: 'tasksCompleted', headerName: 'Tasks Completed', flex: 1 },
                        { field: 'email', headerName: 'Email', flex: 1 },
                        { field: 'phone', headerName: 'Phone', flex: 1 },
                        { field: 'hoursWorked', headerName: 'Hours Worked', flex: 1, type: 'number' },
                        { field: 'dailyEarning', headerName: 'Daily Earning', flex: 1, type: 'number' },
                        { field: 'leaveDaysUsed', headerName: 'Leave Days Used', flex: 1, type: 'number' },
                        { field: 'performanceRating', headerName: 'Performance Rating', flex: 1, type: 'number', renderCell: (params) => `${params.value}%` },

                    ]}
                    slots={{
                        toolbar: CustomToolbar,
                    }}
                    initialState={{
                        pagination: { paginationModel: { page: 0, pageSize: 10 } },
                    }}
                    pageSizeOptions={[10, 20, 50]}
                    checkboxSelection
                    sx={{
                        '& .MuiCheckbox-root.Mui-checked': {
                            color: theme.palette.secondary.main,
                        },
                        '& .MuiDataGrid-root.MuiDataGrid-cell:hover': {
                            color: theme.palette.secondary.main,
                        },
                        '& .MuiCheckbox-root': {
                            color: theme.palette.text.primary,
                        },
                        '& .MuiDataGrid-columnHeader:hover': {
                            color: theme.palette.secondary.main,
                        },
                        '& .MuiDataGrid-toolbarContainer': {
                            backgroundColor: theme.palette.background.paper,
                            color: theme.palette.text.primary,
                        },
                        '& .MuiDataGrid-toolbarContainer button': {
                            color: theme.palette.text.primary,
                        },
                    }}
                />
            </Paper>
        </Container>
    );
};

export default EmployeeManagerDashboard;
