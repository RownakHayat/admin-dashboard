import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js"
import { Doughnut } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend)

export function CircleChart({ chartData }: any) {

  const data = {
    labels: [],
    datasets: [
      {
        data: chartData?.optWiseData?.map((data:any) => data.participant),
        backgroundColor: [
          "rgba(17, 94, 89)", // green
          "rgba(255, 117, 146, 1)", //red
        ],
        borderWidth: 1,
      },
    ],
  }

  const plugins: any = [
    {
      beforeDraw: function (chart: any) {
        let width = chart.width,
          height = chart.height,
          ctx = chart.ctx
        ctx.restore()
        let fontSize = (height / 120).toFixed(2)
        ctx.font = fontSize + "em sans-serif"
        ctx.textBaseline = "top"
        ctx.save()
      },
    },
  ]
  return (
    <>
      <Doughnut
        data={data}
        options={{
          cutout: 45,
        }}
        plugins={plugins}
      />
    </>
  )
}
