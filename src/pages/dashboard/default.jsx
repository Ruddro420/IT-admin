/* eslint-disable prettier/prettier */
// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import { useEffect, useState } from 'react';
import Report from '../../components/Report';


// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {

  const [totalStudents, setTotalStudents] = useState(0);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [totalFees, setTotalFees] = useState(0);
  const [totalAdmissionFees, setTotalAdmissionFees] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [studentsRes, visitorsRes, feesRes] = await Promise.all([
          fetch(`${baseUrl}/totalStudentData`),
          fetch(`${baseUrl}/totalVisitors`),
          fetch(`${baseUrl}/totalFeesCollected`)
        ]);

        const studentsData = await studentsRes.json();
        const visitorsData = await visitorsRes.json();
        const feesData = await feesRes.json();

        setTotalStudents(studentsData.total_students || 0);
        setTotalAdmissionFees(studentsData.total_fees_collected || 0);
        setTotalVisitors(visitorsData.total_visitors || 0);
        setTotalFees(feesData.total_fees_collected || 0);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);




  return (
    <>
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {/* row 1 */}
        <Grid sx={{ mb: -2.25 }} size={12}>
          <Typography variant="h5">Dashboard</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <AnalyticEcommerce
            title="Total Admission"
            count={isLoading ? "Loading..." : totalStudents.toLocaleString()}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <AnalyticEcommerce
            title="Total Fees"
            count={isLoading ? "Loading..." : totalFees.toLocaleString() + ' BDT '} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <AnalyticEcommerce
            title="Total Visitors"
            count={isLoading ? "Loading..." : totalVisitors.toLocaleString()}
            isLoss color="warning"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <AnalyticEcommerce
            title="Total Admission Fees"
            count={isLoading ? "Loading..." : totalAdmissionFees.toLocaleString() + ' BDT '}
            isLoss color="warning"
          />
        </Grid>
        <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />
      </Grid>
      {/* Report */}
      <Report />

    </>
  );
}
