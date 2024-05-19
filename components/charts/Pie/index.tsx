import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

// Custom Tooltip Component using Tailwind CSS for styling
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded border border-gray-300 bg-white p-2 shadow-lg">
        <p className="label text-black">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    )
  }

  return null
}

export default function CustomPieChart({ data }) {
  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        className="fill-current text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <PieChart className="flex flex-col" width={400} height={300}>
      <Pie
        data={data}
        cx={100}
        cy={200}
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        nameKey="name"
        paddingAngle={5}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      <Legend
        iconSize={10}
        layout="horizontal"
        verticalAlign="bottom"
        wrapperStyle={{ position: "relative" }}
        align="left"
      />
    </PieChart>
  )
}
