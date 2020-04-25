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
    if (!type || type === this.state.mapType) {
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

  prepareWorldData = (geoDataArr, JHDataArr) => {
    const geoDataObj = geoDataArr.reduce((acc, country) => {
      acc[country.node.name] = 1
      return acc
    }, {})

    const JHDataObj = JHDataArr.reduce((acc, { node: country }) => {
      if (
        !acc.hasOwnProperty(country.Country_Region) &&
        (!country.Province_State ||
          country.Province_State === country.Country_Region ||
          !geoDataObj.hasOwnProperty(country.Province_State))
      ) {
        acc[country.Country_Region] = {
          infected: +country.Confirmed,
          death: +country.Deaths,
          cured: +country.Recovered,
        }
      } else if (
        country.Province_State &&
        country.Province_State !== country.Country_Region &&
        geoDataObj.hasOwnProperty(country.Province_State) &&
        !acc.hasOwnProperty(country.Province_State)
      ) {
        acc[country.Province_State] = {
          infected: +country.Confirmed,
          death: +country.Deaths,
          cured: +country.Recovered,
        }
      } else if (
        acc.hasOwnProperty(country.Country_Region) &&
        country.Province_State &&
        country.Province_State !== country.Country_Region &&
        !geoDataObj.hasOwnProperty(country.Province_State)
      ) {
        acc[country.Country_Region].infected += +country.Confirmed
        acc[country.Country_Region].death += +country.Deaths
        acc[country.Country_Region].cured += +country.Recovered
      }

      return acc
    }, {})

    geoDataArr.forEach(({ node: country }) => {
      if (JHDataObj.hasOwnProperty(country.name)) {
        const JDCountryData = JHDataObj[country.name]

        country.infected = JDCountryData.infected
        country.death = JDCountryData.death
        country.cured = JDCountryData.cured
      }
    })

    return geoDataArr
  }

  render() {
    const { data, location } = this.props
    const siteTitle = data.site.siteMetadata.title

    const worldData = this.prepareWorldData(
      data.allInfectionWorldJson.edges,
      data.allDataWorldCsv.edges
    )

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
          infectionData={worldData}
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
        <>
          <div className={classes.reInfected}>
            <i>Bệnh nhân tái dương tính:</i> 188, 52, 149, 137 và 36
          </div>
          <ol className={classes.noteData}>
            {data.allInfectionVnJson.edges.map(({ node: province }) => (
              <li key={province["GID_1"]}>
                <h6>{province.province}</h6>
                <div dangerouslySetInnerHTML={{ __html: `${province.note}` }} />
              </li>
            ))}
          </ol>
        </>
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
        <Content
          updatedDate={data.site.siteMetadata.updatedDate}
          switchMap={this.setMapType}
        />
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
          latlong
          infected
          cured
          death
          isolated
        }
      }
    }

    allDataWorldCsv {
      edges {
        node {
          Confirmed
          Country_Region
          Deaths
          Province_State
          Recovered
          Latitude
          Longitude
        }
      }
    }
  }
`
