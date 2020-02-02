import React, { Component } from "react"
import ReactDOM from "react-dom"

import classes from "./map.module.css"

const initMap = createButton => {
  const d3 = window.d3
  const L = window.L

  const mbAttribute =
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>, Ta Sy Tan',
    mbUrl =
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3l0YW50YSIsImEiOiJjaW9hdzl6YWwwM283dmlranV0dXZ1MnNpIn0.lVomMiqKjgoW7DqPN9xvnw"

  const grayScale = L.tileLayer(mbUrl, {
    id: "mapbox/dark-v10",
    attribution: mbAttribute,
  })

  const southWest = L.latLng(8.60217, 109.868607),
    northEast = L.latLng(23.58359, 101.584916),
    maxBounds = L.latLngBounds(southWest, northEast)

  const map = L.map("map", {
    minZoom: 6,
    noWrap: true,
    maxBounds: maxBounds,
    maxBoundsViscosity: 0.8,
    layers: [grayScale],
  }).setView([21.021009, 105.727314], 6)

  Promise.all([
    d3.json("/data/vn-provinces.geojson"),
    d3.json("/data/corona-infection-vn.json"),
    d3.json("/data/vn-provinces-latlong.json"),
    d3.json("/data/vn.geojson"),
  ]).then(result => {
    const collection = result[0],
      infectionData = result[1].data,
      circles = result[2],
      vngeo = result[3]

    function getColor(d) {
      return d > 100
        ? "#800026"
        : d > 50
        ? "#E31A1C"
        : d > 20
        ? "#FC4E2A"
        : d > 10
        ? "#FD8D3C"
        : d > 5
        ? "#FEB24C"
        : "#FED976"
    }

    function styleProvince(feature) {
      const infected = infectionData[feature.properties["GID_1"]]
        ? +infectionData[feature.properties["GID_1"]].infected
        : 0

      return {
        fillColor: infected ? getColor(infected) : "none",
        color: infected ? "white" : "transparent",
        cursor: "move",
        strokeWidth: "0",
        dashArray: infected ? "2" : "",
        weight: infected ? 1 : 0,
        fillOpacity: infected ? 1 : 0,
      }
    }

    // Country border
    L.geoJson(vngeo, {
      style: {
        color: "white",
        strokeWidth: "1",
        dashArray: "2",
        weight: 1,
      },
    }).addTo(map)

    // Province border
    const provinceGeoJSON = L.geoJson(collection, {
      style: styleProvince,
      onEachFeature: onEachFeature,
    }).addTo(map)

    function highlightFeature(e) {
      const layer = e.target

      if (!infectionData[layer.feature.properties["GID_1"]]) {
        return
      }

      layer.setStyle({
        fillOpacity: 0.7,
        weight: 2,
      })
    }

    function resetHighlight(e) {
      provinceGeoJSON.resetStyle(e.target)
    }

    function zoomToFeature(e) {
      const provinceData = infectionData[e.target.feature.properties["GID_1"]]
      if (provinceData) {
        info.update(provinceData)
      }

      map.fitBounds(e.target.getBounds())
    }

    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature,
      })

      if (infectionData[layer.feature.properties["GID_1"]]) {
        const data = infectionData[layer.feature.properties["GID_1"]]

        let tooltipContent = `
              <div><strong>${data.province}</strong></div>
              <div>Số ca nhiễm: ${data.infected}</div>
            `

        layer
          .bindTooltip(
            L.tooltip({
              sticky: true,
              interactive: true,
            }),
            { className: classes.tooltip }
          )
          .setTooltipContent(tooltipContent)
      }
    }

    /**
     * Circle for each virus source
     */
    for (let province in circles) {
      const popupContent = `${infectionData[province].province} - Số ca nhiễm: ${infectionData[province].infected}`

      L.circleMarker(circles[province], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.5,
        radius: infectionData[province].infected * 10,
        weight: 1,
      })
        .addTo(map)
        .bindPopup(popupContent)
    }

    /**
     * Top right info window
     */
    const info = L.control()

    info.onAdd = function() {
      this._div = L.DomUtil.create("div", `${classes.info} ${classes.vn}`)
      this.update()
      return this._div
    }

    info.update = function(props) {
      const btnContainerId = "switchMapBtnContainer"
      let content = `<div id="${btnContainerId}" class="${classes.buttonContainer}"></div>`

      if (props) {
        content = `
          <div class="info-content">
            <div>- Số ca nhiễm tại ${props.province}: ${props.infected}</div>
            <div>- Đã chữa khỏi: ${props.cured}</div>
            <div>${props.note}</div>
          </div>
          <div id="${btnContainerId}" class="${classes.buttonContainer}"></div>
          `
      }

      this._div.innerHTML = content

      // Add switch map button
      setTimeout(() => {
        try {
          createButton(btnContainerId)
        } catch {}
      }, 30)
    }

    info.addTo(map)
  })
}

class MapVN extends Component {
  componentDidMount() {
    initMap(this.createSwitchMapButton)
  }

  createSwitchMapButton = containerId => {
    const element = (
      <button
        onClick={() => {
          this.props.setMap("world")
        }}
      >
        Xem thông tin thế giới
      </button>
    )

    ReactDOM.render(element, document.getElementById(containerId))
  }

  render() {
    return (
      <div id="map" style={{ backgroundColor: "black", height: "500px" }}></div>
    )
  }
}

export default MapVN
