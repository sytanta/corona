import React, { Component } from "react"
import ReactDOM from "react-dom"

import classes from "../styles/map.module.css"

const initMap = (infectionDataArr, setLoading, createButton) => {
  const d3 = window.d3
  const L = window.L

  const infectedColor = "chocolate"
  const curedColor = "#556B2F"

  const mbAttribute =
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>, Ta Sy Tan',
    mbUrl =
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3l0YW50YSIsImEiOiJjaW9hdzl6YWwwM283dmlranV0dXZ1MnNpIn0.lVomMiqKjgoW7DqPN9xvnw"

  const grayScale = L.tileLayer(mbUrl, {
    id: "mapbox/dark-v10",
    attribution: mbAttribute,
  })

  const southWest = L.latLng(23.934948, 100.795002), // L.latLng(8.60217, 109.868607),
    northEast = L.latLng(7.421942, 112.620107), // L.latLng(23.58359, 101.584916),
    maxBounds = L.latLngBounds(southWest, northEast)

  const map = L.map("map", {
    minZoom: 5,
    noWrap: true,
    maxBounds: maxBounds,
    maxBoundsViscosity: 0.8,
    layers: [grayScale],
  }).setView([21.021009, 105.727314], 5)

  Promise.all([
    d3.json("/data/vn-province.geojson"),
    d3.json("/data/vn.geojson"),
  ]).then(result => {
    setLoading(false)

    const collection = result[0],
      circles = infectionDataArr,
      vngeo = result[1]

    const infectionData = infectionDataArr.reduce((acc, item) => {
      acc[item.node["GID_1"]] = { ...item.node }

      return acc
    }, {})

    function styleProvince(feature) {
      const { infected, cured, death } = infectionData[
        feature.properties["GID_1"]
      ]
        ? infectionData[feature.properties["GID_1"]]
        : { infected: 0, cured: 0, death: 0 }

      const fillColor =
        infected <= cured + death
          ? curedColor
          : infected
          ? infectedColor
          : "none"

      return {
        fillColor: fillColor,
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

    let contentShown = false
    map.on("zoomend", () => {
      const zoom = map.getZoom()

      if (zoom >= 7 && !contentShown) {
        contentShown = true

        const markerLayer = document.querySelector(".leaflet-marker-pane")
        markerLayer.className += " show"
      } else if (zoom < 7 && contentShown) {
        contentShown = false

        const markerLayer = document.querySelector(".leaflet-marker-pane")
        markerLayer.className = markerLayer.className.replace(/show/g, "")
      }
    })

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
        const { province, infected, cured, death } = infectionData[
          layer.feature.properties["GID_1"]
        ]

        let tooltipContent = `
              <div><strong>${province}</strong></div>
            `

        if (infected <= cured + death) {
          tooltipContent += `Đã chữa khỏi các ca nhiễm`
        } else {
          tooltipContent += `
              <div>Số ca nhiễm: ${infected}</div>`
        }

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
    for (let { node: province } of circles) {
      const isUnCured = province.infected > province.cured + province.death
      const popupContent = `${province.province} - Số ca nhiễm: ${province.infected}`

      // Location name
      L.marker([province.latlong[0], province.latlong[1]], {
        icon: L.divIcon({
          className: isUnCured
            ? `province-data ${classes.locationName} ${classes.locationNameUnCured}`
            : `province-data cured ${classes.locationName} ${classes.locationNameCured}`,
          html: `<div>${province.province} (${province.infected} - ${province.cured})</div>`,
        }),
      }).addTo(map)
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
            <div>${props.province}: ${props.infected} ca</div>
            <div>Đã chữa khỏi: ${props.cured}</div>
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
    initMap(
      this.props.infectionData,
      this.props.setLoading,
      this.createSwitchMapButton
    )
  }

  createSwitchMapButton = containerId => {
    const element = (
      <a
        className="button"
        href="https://yoishira.now.sh/"
        target="_blank"
        rel="nofollow"
        title="Xem thông tin thế giới"
      >
        Xem thông tin thế giới
      </a>
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
