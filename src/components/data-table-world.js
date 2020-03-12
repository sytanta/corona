import React from "react"

const DataTableWorld = ({ data }) => {
  const sortedData = data.sort((item, nextItem) => {
    if (+item.node.infected > +nextItem.node.infected) {
      return -1
    }
    if (+item.node.infected < +nextItem.node.infected) {
      return 1
    }

    return 0
  })

  const { total, death } = data.reduce(
    (acc, item) => {
      return {
        total: acc.total + +item.node.infected,
        death: acc.death + +item.node.death,
      }
    },
    {
      total: 0,
      death: 0,
    }
  )

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Nước</th>
            <th>Số ca</th>
            <th>Tử vong</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map(({ node: item }) => (
            <tr key={item.WB_A3}>
              <td>{item.name}</td>
              <td>{item.infected}</td>
              <td>{item.death}</td>
            </tr>
          ))}
          <tr>
            <td>Tổng số ca</td>
            <td>{total}</td>
            <td>{death}</td>
          </tr>
        </tbody>
      </table>
      <div>Cập nhật 11/03/2020. Nguồn: WHO</div>
    </>
  )
}

export default DataTableWorld
