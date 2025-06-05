import { Doughnut } from "react-chartjs-2";

const RiskChart = ({ atRisk, totalStudents }) => {
  const data = {
    labels: ["En riesgo", "Activos"],
    datasets: [
      {
        data: [atRisk, totalStudents - atRisk],
        backgroundColor: ["#EF4444", "#10B981"],
      },
    ],
  };

  return <Doughnut data={data} />;
};

export default RiskChart;
