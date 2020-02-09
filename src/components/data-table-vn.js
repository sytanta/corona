import React from "react"

const DataTableVN = ({ data }) => {
  const { total, cured, death } = data.reduce(
    (acc, item) => {
      return {
        total: acc.total + +item.node.infected,
        cured: acc.cured + +item.node.cured,
        death: acc.death + +item.node.death,
      }
    },
    {
      total: 0,
      cured: 0,
      death: 0,
    }
  )

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Tỉnh/Thành phố</th>
            <th>Số ca</th>
            <th>Chữa khỏi</th>
            <th>Tử vong</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ node: item }) => (
            <tr key={item.GID_1}>
              <td>{item.province}</td>
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
      <div>Cập nhật: 08:00AM 09/02/2020</div>
    </>
  )
}

export default DataTableVN
