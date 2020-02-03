import React, { Component } from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import MapVN from "../components/map-vn"
import MapWorld from "../components/map-world"
import Content from "../components/content"
import DataTableVN from "../components/data-table-vn"
import DataTableWorld from "../components/data-table-world"

import classes from "../styles/index.module.css"

class Index extends Component {
  state = {
    mapType: "vn",
  }

  setMapType = type => {
    if (!type) {
      return
    }

    this.setState({
      mapType: type,
    })
  }

  render() {
    const { data, location } = this.props
    const siteTitle = data.site.siteMetadata.title

    const mapComponent =
      this.state.mapType === "vn" ? (
        <MapVN
          setMap={this.setMapType}
          infectionData={data.allInfectionVnJson.edges}
        />
      ) : (
        <MapWorld
          setMap={this.setMapType}
          infectionData={data.allInfectionWorldJson.edges}
        />
      )

    const dataTableComponent =
      this.state.mapType === "vn" ? (
        <DataTableVN data={data.allInfectionVnJson.edges} />
      ) : (
        <DataTableWorld data={data.allInfectionWorldJson.edges} />
      )

    return (
      <Layout location={location}>
        <SEO title={siteTitle} />
        <div className={classes.container}>
          <div className={classes.mapContainer}>{mapComponent}</div>
          <div className={classes.infoTable}>{dataTableComponent}</div>
        </div>
        <Content updatedDate={data.site.siteMetadata.updatedDate} />
      </Layout>
    )
  }
}

export default Index

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        updatedDate
      }
    }

    allInfectionVnJson {
      edges {
        node {
          death
          GID_1
          cured
          latlong
          infected
          note
          province
        }
      }
    }

    allInfectionWorldJson {
      edges {
        node {
          WB_A3
          name
          infected
          cured
          death
          isolated
        }
      }
    }
  }
`
