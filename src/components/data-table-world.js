import React from "react"

const DataTableWorld = ({ data }) => {
  const { total, cured, death } = data.reduce((acc, item) => {
    return {
      total: acc.total + +item.node.infected,
      cured: acc.cured + +item.node.cured,
      death: acc.death + +item.node.death
    }
  }, {
    total: 0, cured: 0, death: 0
  })
    console.log('1111qqq111111', data)
  return (
    <table>
      <thead>
        <tr>
          <th>Nước</th>
          <th>Số ca</th>
          <th>Chữa khỏi</th>
          <th>Tử vong</th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ node: item }) => (
          <tr key={item.WB_A3}>
            <td>{item.name}</td>
            <td>{item.infected}</td>
            <td>{item.cured}</td>
            <td>{item.death}</td>
          </tr>
        ))}
        <tr>
          <td>Tổng số ca</td>
          <td>{total}</td>
          <td>{cured}</td>
          <td>{death}</td>
        </tr>
      </tbody>
    </table>
  )
}

export default DataTableWorld
