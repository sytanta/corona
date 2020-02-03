import React, { Component } from "react"

import classes from "../styles/content.module.css"

class Content extends Component {
  render() {
    return (
      <>
        <div className={classes.content}>
          {/* <div>
            <p>Tin tức</p>
          </div> */}
          <div>
            <p>
              <a href="tel:+19003228">HOTLINE: 19003228</a>
            </p>
            <div>
              <h4>Khuyến Cáo từ Bộ Y Tế</h4>
              <ol>
                <li>
                  Rửa tay thường xuyên với xà phòng và nước sạch trong ít nhất
                  30 giây. Trong trường hợp không có xà phòng và nước sạch thì
                  dùng các sản phẩm vệ sinh tay có chứa cồn (ít nhất 60% cồn).
                </li>
                <li>
                  Người tiếp xúc gần với người bệnh/nghi ngờ mắc bệnh nCoV trong
                  vòng 14 ngày phải thông báo cho các cơ sở y tế địa phương.
                </li>
                <li>
                  Người tiếp xúc gần với người bệnh/nghi ngờ mắc bệnh nCoV phải
                  đeo khẩu trang, hạn chế tiếp xúc với người khác.
                </li>
                <li>
                  Đeo khẩu trang khi đến các nơi công cộng, khi đi trên các
                  phương tiện công cộng.
                </li>
                <li>
                  Tạm thời không nên đi du lịch Trung Quốc hay các nước đang có
                  dịch khác.
                </li>
              </ol>
            </div>
          </div>
        </div>
        <div className={classes.hotlines}>
          <div>Đường dây nóng các bệnh viện:</div>
          <div>
            Bệnh viện Bạch Mai: <a href="tel:+">0969851616</a>
          </div>
          <div>
            Bệnh viện Nhiệt đới Trung ương:{" "}
            <a href="tel:+0969241616">0969241616</a>
          </div>
          <div>
            Bệnh viện E: <a href="tel:+0912168887">0912168887</a>
          </div>
          <div>
            Bệnh viện Nhi trung ương: <a href="tel:+0372884712">0372884712</a>
          </div>
          <div>
            Bệnh viện Phổi trung ương: <a href="tel:+0967941616">0967941616</a>
          </div>
          <div>
            Bệnh viện Việt Nam - Thụy Điển Uông Bí:{" "}
            <a href="tel:+0966681313">0966681313</a>
          </div>
          <div>
            Bệnh viện Đa khoa trung ương Thái Nguyên:{" "}
            <a href="tel:+0913394495">0913394495</a>
          </div>
          <div>
            Bệnh viện trung ương Huế: <a href="tel:+0965301212">0965301212</a>
          </div>
          <div>
            Bệnh viện Chợ Rẫy: <a href="tel:+0969871010">0969871010</a>
          </div>
          <div>
            Bệnh viện Đa khoa trung ương Cần Thơ:{" "}
            <a href="tel:+0907736736">0907736736</a>
          </div>
          <div>
            Bệnh viện Xanh Pôn Hà Nội: <a href="tel:+0904138502">0904138502</a>{" "}
            (Phó giáo sư, tiến sĩ Trần Ngọc Sơn)
          </div>
          <div>
            Bệnh viện Vinmec Hà Nội: <a href="tel:+0934472768">0934472768</a>{" "}
            (trực cấp cứu Bác sĩ Nguyễn Thành Trung - phó giám đốc)
          </div>
          <div>
            Bệnh viện Đà Nẵng: <a href="tel:+0903583881">0903583881</a>
          </div>
          <div>
            Bệnh viện Nhiệt đới TP.HCM: <a href="tel:+0967341010">0967341010</a>
          </div>
          <div>
            Bệnh viện Nhi đồng 1: <a href="tel:+19002249">19002249</a> -{" "}
            <a href="tel:+0913117965">0913117965</a>
          </div>
          <div>
            Bệnh viện Nhi đồng 2: <a href="tel:+0798429841">0798429841</a>
          </div>
          <div>
            Bệnh viện Đa khoa tỉnh Đồng Nai:{" "}
            <a href="tel:+0819634807">0819634807</a>
          </div>
          <div>
            Bệnh viện Nhiệt đới Khánh Hòa:{" "}
            <a href="tel:+0913464257">0913464257</a>
          </div>
          <div>
            Bệnh viện tỉnh Khánh Hòa: <a href="tel:+0965371515">0965371515</a>
          </div>
          <div>
            Bệnh viện tỉnh Thái Bình: <a href="tel:+0989506515">0989506515</a>
          </div>
          <div>
            Bệnh viện tỉnh Lạng Sơn: <a href="tel:+0396802226">0396802226</a>
          </div>
        </div>
        <div className={classes.contact}>
          <a href="https://www.linkedin.com/in/tan-sy-688b8a87/">
            <img width="20" src="images/linkedin-icon-20.png" alt="Contact" />
          </a>
        </div>
      </>
    )
  }
}

export default Content
