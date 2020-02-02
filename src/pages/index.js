import React, { Component } from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import MapVN from "../components/map-vn"
import MapWorld from "../components/map-world"

import classes from "./index.module.css"

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
        <MapVN setMap={this.setMapType} />
      ) : (
        <MapWorld setMap={this.setMapType} />
      )

    return (
      <Layout location={location}>
        <SEO title={siteTitle} />
        <div style={{ height: "500px" }}>{mapComponent}</div>
        <div className={classes.content}>
          Bản đồ lây nhiễm virus Corona, cập nhật hàng ngày từ trang web chính
          thức của Tổ chức Y tế Thế giới (WHO).
          <div>
            - Số liệu mới nhất ngày {data.site.siteMetadata.updatedDate}
          </div>
        </div>
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
  }
`
