import React, { useState, useEffect } from "react"
import {
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBCheckbox,
  MDBRadio,
} from "mdb-react-ui-kit"
import "./App.css"

const default_setting = JSON.stringify({
  unFollowerEnable: true,
  followerEnable: true,
  friendEnable: true,
  nameColor: "#00000",
  commentColor: "#00000",
})

const SettingCard = ({ setOpen, value, update }) => {
  const doClose = (e) => {
    const target = e.target.closest(".card")
    target.classList.remove("animate__slideInDown")
    target.classList.add("animate__slideOutUp")
    target.onanimationend = () => setOpen(false)
  }
  const handleChange = (e) => {
    const target = e.target
    const name = target.name
    var target_value = target.value
    switch (target.type) {
      case "range":
        target_value = parseInt(target_value)
        break
      case "checkbox":
        target_value = target.checked
        break
      default:
        break
    }
    update((current) => ({ ...current, [name]: target_value }))
  }
  return (
    <MDBCard className="position-absolute top-0 start-0 w-100 animate__animated animate__faster animate__slideInDown">
      <MDBCardBody className="position-relative">
        <h5>Setting</h5>
        <span
          className="position-absolute top-0 end-0 p-3 text-primary"
          role="button"
          onClick={doClose}
        >
          <MDBIcon fas icon="times" color="primary" /> Close
        </span>
        <MDBRow>
          <MDBCol size="sm" className="mb-3">
            <table>
              <tbody>
                {/* Enable */}
                <tr>
                  <th colSpan={2}>Enable</th>
                </tr>
                <tr>
                  <td>Un-follower</td>
                  <td>
                    <MDBCheckbox
                      defaultChecked={value.unFollowerEnable}
                      name="unFollowerEnable"
                      id="unFollowerEnable"
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Follower</td>
                  <td>
                    <MDBCheckbox
                      defaultChecked={value.followerEnable}
                      name="followerEnable"
                      id="followerEnable"
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Friend</td>
                  <td>
                    <MDBCheckbox
                      defaultChecked={value.friendEnable}
                      name="friendEnable"
                      id="friendEnable"
                      onChange={handleChange}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </MDBCol>
          <MDBCol size="sm" className="mb-3">
            <table>
              <tbody>
                {/* Color */}
                <tr>
                  <th colSpan={2}>Color</th>
                </tr>
                <tr>
                  <td>
                    <span>Name</span>
                  </td>
                  <td>
                    <input
                      type="color"
                      className="form-control form-control-color border-0 p-0"
                      id="nameColor"
                      defaultValue={value.nameColor}
                      name="nameColor"
                      title="Choose your color"
                      onChange={handleChange}
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span>Comment</span>
                  </td>
                  <td>
                    <input
                      type="color"
                      className="form-control form-control-color border-0 p-0"
                      id="commentColor"
                      defaultValue={value.commentColor}
                      name="commentColor"
                      title="Choose your color"
                      onChange={handleChange}
                    ></input>
                  </td>
                </tr>
              </tbody>
            </table>
          </MDBCol>
          <MDBCol size="sm" className="mb-3">
            <table>
              <tbody>
                {/* Color */}
                <tr>
                  <th colSpan={2}>Avatar</th>
                </tr>
                <tr>
                  <td>
                    <span>Square</span>
                  </td>
                  <td>
                    <MDBRadio
                      name="avatarShape"
                      defaultChecked={value.avatarShape === "square"}
                      value="square"
                      id="flexRadioDefault1"
                      label=""
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <span>Circle</span>
                  </td>
                  <td>
                    <MDBRadio
                      name="avatarShape"
                      defaultChecked={value.avatarShape === "circle"}
                      value="circle"
                      id="flexRadioDefault1"
                      label=""
                      onChange={handleChange}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </MDBCol>
        </MDBRow>
        <small className="position-absolute bottom-0 end-0 p-2 opacity-50">
          Developed by QuangPlus
        </small>
      </MDBCardBody>
    </MDBCard>
  )
}

const App = ({ roomInfo, event }) => {
  const [events, updateEvents] = useState([])
  const [setting, updateSetting] = useState(
    JSON.parse(window.localStorage.settings || default_setting)
  )
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    window.localStorage.setItem("settings", JSON.stringify(setting))
  }, [setting])

  useEffect(() => console.log(roomInfo), [roomInfo])

  useEffect(() => {
    const isEnabled = [
      setting.unFollowerEnable,
      setting.followerEnable,
      setting.friendEnable,
    ]
    if (!event || event.name !== "chat") return
    if (!isEnabled[event.followRole]) return
    updateEvents((current) => [...current.slice(-20), event])

    return () => {}
  }, [event])

  const imgOnLoaded = ({ target }) => {
    target.style.backgroundImage = "unset"
  }

  const scrollCard = document.getElementById("scroll-card")
  const scrollUp = () => {
    window.clearTimeout(window.a)
    window.a = setTimeout(
      () =>
        scrollCard.scrollTo({
          top: scrollCard.scrollHeight,
          behavior: "smooth",
        }),
      200
    )
  }

  return (
    <div
      className="position-relative h-100 mx-auto"
      style={{ maxWidth: "800px" }}
    >
      <MDBCard className="bg-transparent shadow-0 h-100">
        <MDBCardBody
          id="scroll-card"
          className="h-100 p-0 overflow-auto hideScrollbar"
        >
          <div className="text-center placeholderItem ">NO COMMENT YET</div>
          {events.map((e) => {
            const imgSrc = window.imageUrlFixing([
              ...e.userDetails.profilePictureUrls,
              window.defaultAvatar,
            ])
            scrollUp()
            return (
              <div
                className="mb-3 d-flex animate__animated animate__faster animate__fadeIn"
                key={e.id}
              >
                <img
                  src={imgSrc}
                  className={`rounded-${
                    setting.avatarShape === "circle" ? "circle" : "5"
                  } border border-2`}
                  onLoad={imgOnLoaded}
                  alt={e.uniqueId}
                />
                <div className="lh-1 d-flex flex-column">
                  <span
                    className="mb-1 fw-bold"
                    style={{ color: setting.nameColor }}
                  >
                    {e.nickname || e.uniqueId}
                  </span>
                  <span
                    className="mb-0"
                    style={{ color: setting.commentColor }}
                  >
                    {e.comment}
                  </span>
                </div>
              </div>
            )
          })}
        </MDBCardBody>
      </MDBCard>
      <span
        role="button"
        className="position-absolute top-0 end-0 p-3 text-primary showOnHover"
        onClick={() => setOpen(true)}
      >
        <MDBIcon fas icon="sliders-h" color="primary" /> Setting
      </span>
      {isOpen && (
        <SettingCard setOpen={setOpen} value={setting} update={updateSetting} />
      )}
    </div>
  )
}
export default App
