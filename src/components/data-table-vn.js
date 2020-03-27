import React from "react"

const DataTableVN = ({ data }) => {
  // Sort data, most first
  const sortedData = data.sort((item, nextItem) => {
    if (+item.node.infected > +nextItem.node.infected) {
      return -1
    }
    if (+item.node.infected < +nextItem.node.infected) {
      return 1
    }

    return 0
  })

  const { total, cured, death } = sortedData.reduce(
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
            <th>Xuất viện</th>
            <th>Tử vong</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map(({ node: item }) => (
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
      <div>Cập nhật: 8:00AM 27/03/2020</div>
    </>
  )
}

export default DataTableVN
