import React, { Component } from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import MapVN from "../components/map-vn"
import MapWorld from "../components/map-world"
import Content from "../components/content"
import DataTableVN from "../components/data-table-vn"
import DataTableWorld from "../components/data-table-world"
import Loader from "../components/loader"

import classes from "../styles/index.module.css"

class Index extends Component {
  state = {
    mapType: "vn",
    loading: true,
  }

  setMapType = type => {
    if (!type) {
      return
    }

    this.setState({
      mapType: type,
      loading: true,
    })
  }

  setLoadingState = state => {
    this.setState({
      loading: !!state,
    })
  }

  render() {
    const { data, location } = this.props
    const siteTitle = data.site.siteMetadata.title

    const mapComponent =
      this.state.mapType === "vn" ? (
        <MapVN
          setMap={this.setMapType}
          setLoading={this.setLoadingState}
          infectionData={data.allInfectionVnJson.edges}
        />
      ) : (
        <MapWorld
          setMap={this.setMapType}
          setLoading={this.setLoadingState}
          infectionData={data.allInfectionWorldJson.edges}
        />
      )

    const loader = this.state.loading ? <Loader /> : ""

    const dataTableComponent =
      this.state.mapType === "vn" ? (
        <DataTableVN data={data.allInfectionVnJson.edges} />
      ) : (
        <DataTableWorld data={data.allInfectionWorldJson.edges} />
      )

    const additionalNote =
      this.state.mapType === "vn" ? (
        <ol className={classes.noteData}>
          {data.allInfectionVnJson.edges.map(({ node: province }) => (
            <li key={province["GID_1"]}>
              <h6>{province.province}</h6>
              <div dangerouslySetInnerHTML={{ __html: `${province.note}` }} />
            </li>
          ))}
        </ol>
      ) : (
        ""
      )

    return (
      <Layout location={location}>
        <SEO title={siteTitle} />
        <div className={classes.container}>
          <div className={classes.mapContainer}>
            {mapComponent}
            {loader}
          </div>
          <div className={classes.infoTable}>{dataTableComponent}</div>
        </div>
        {additionalNote}
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
