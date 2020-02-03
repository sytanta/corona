import React, { Component } from "react"
import ReactDOM from "react-dom"

import classes from "../styles/map.module.css"

const initMap = (infectionDataArr, createButton) => {
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

  const southWest = L.latLng(-89.98155760646617, -180),
    northEast = L.latLng(89.99346179538875, 180),
    maxBounds = L.latLngBounds(southWest, northEast)

  const map = L.map("map", {
    minZoom: 1,
    noWrap: true,
    maxBounds: maxBounds,
    maxBoundsViscosity: 0.8,
    layers: [grayScale],
  }).setView([0, 0], 2)

  Promise.all([d3.json("/data/world-50m-wba3.geojson")]).then(result => {
    const collection = result[0]

    const infectionData = infectionDataArr.reduce((acc, item) => {
      acc[item.node["WB_A3"]] = { ...item.node }

      return acc
    }, {})

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

    function style(feature) {
      const infected = infectionData[feature.properties["WB_A3"]]
        ? +infectionData[feature.properties["WB_A3"]].infected
        : 0

      return {
        fillColor: infected ? getColor(infected) : "none",
        color: infected ? "white" : "transparent",
        cursor: "move",
        strokeWidth: "0",
        dashArray: infected ? "2" : "",
        weight: 1,
        fillOpacity: infected ? 1 : 0,
      }
    }

    const geojson = L.geoJson(collection, {
      style: style,
      onEachFeature: onEachFeature,
    }).addTo(map)

    function highlightFeature(e) {
      const layer = e.target

      if (!infectionData[layer.feature.properties["WB_A3"]]) {
        return
      }

      layer.setStyle({
        fillOpacity: 0.7,
        weight: 2,
      })

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront()
      }
    }

    function resetHighlight(e) {
      geojson.resetStyle(e.target)
    }

    function zoomToFeature(e) {
      info.update(e.target.feature.properties)

      map.fitBounds(e.target.getBounds())
    }

    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature,
      })

      if (infectionData[layer.feature.properties["WB_A3"]]) {
        const tooltipContent = `
          <div><strong>${layer.feature.properties.NAME}</strong></div>
          <div>Số ca nhiễm: ${
            infectionData[layer.feature.properties["WB_A3"]].infected
          }</div>
        `

        layer
          .bindTooltip(
            L.tooltip({
              sticky: true,
              interactive: true,
            }),
            { className: "tooltip" }
          )
          .setTooltipContent(tooltipContent)
      }
    }

    /**
     * Top right info window
     */
    const info = L.control()

    info.onAdd = function() {
      this._div = L.DomUtil.create("div", classes.info)
      this.update()
      return this._div
    }

    info.update = function(props) {
      const btnContainerId = "switchMapBtnContainer"
      const btn = `<div id="${btnContainerId}" class="${classes.buttonContainer}"></div>`

      const content =
        props && infectionData[props["WB_A3"]]
          ? `<div class="info-content"><div>Số ca nhiễm${
              props.NAME ? " tại <span>" + props.NAME : "</span>"
            }</div>
            <p class="${classes.infectionData}"><span>${
              infectionData[props["WB_A3"]].infected
            }</span></p>
            </div>`
          : ``

      this._div.innerHTML = content + btn

      // Add switch map button
      setTimeout(() => {
        try {
          createButton(btnContainerId)
        } catch {}
      }, 30)
    }

    info.addTo(map)

    /**
     * Legend
     */
    const legend = L.control({ position: "bottomright" })

    legend.onAdd = function(map) {
      const div = L.DomUtil.create("div", `${classes.legend} ${classes.info}`),
        grades = [0, 5, 10, 20, 50, 100],
        labels = []
      let from, to

      for (let i = 0; i < grades.length; i++) {
        from = grades[i]
        to = grades[i + 1]

        labels.push(
          '<i style="background:' +
            getColor(from + 1) +
            '"></i> ' +
            from +
            (to ? "&ndash;" + to : "+")
        )
      }

      div.innerHTML = `
        <div class="info-content">${labels.join("<br>")}<div>
      `
      return div
    }

    legend.addTo(map)
  })
}

class MapWorld extends Component {
  componentDidMount() {
    initMap(this.props.infectionData, this.createSwitchMapButton)
  }

  createSwitchMapButton = containerId => {
    const element = (
      <button
        onClick={() => {
          this.props.setMap("vn")
        }}
      >
        Xem thông tin Việt Nam
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

export default MapWorld
