import styled from "styled-components";
import Stat from "./Stat";
import SalesChart from "./SalesChart";
import DurationChart from "./DurationChart";
import TodayActivity from "../check-in-out/TodayActivity";
import {
  HiOutlineBriefcase,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlineCurrencyDollar,
} from "react-icons/hi2";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

function DashboardLayout() {
  return (
    <StyledDashboardLayout>
      <Stat
        title="Bookings"
        color="blue"
        icon={<HiOutlineBriefcase />}
        value={0}
      />
      <Stat
        title="Sales"
        color="green"
        icon={<HiOutlineCurrencyDollar />}
        value="$0"
      />
      <Stat
        title="Check ins"
        color="indigo"
        icon={<HiOutlineCheckCircle />}
        value={0}
      />
      <Stat
        title="Occupancy rate"
        color="yellow"
        icon={<HiOutlineChartBar />}
        value="0%"
      />

      <TodayActivity />

      <DurationChart confirmedStays={[]} />

      <SalesChart bookings={[]} numDays={7} />
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
