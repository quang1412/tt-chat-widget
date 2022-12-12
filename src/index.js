import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import "./index.css"
import "mdb-react-ui-kit/dist/css/mdb.min.css"
import App from "./App"
import io from "socket.io-client"
import Loading from "./Loading.jsx"
import { MDBContainer } from "mdb-react-ui-kit"

function getUrlParams(key) {
  return new URLSearchParams(document.location.search).get(key)
}

window.imageUrlFixing = (urls = [window.defaultAvatar]) => {
  try {
    const url = urls.find((u) => u.includes("p16-sign")) || window.defaultAvatar
    return url.replace("p16-sign-va", "p16-va").replace("p16-sign-sg", "p16-va")
  } catch (e) {
    console.error(e)
    console.error(urls)
  }
}

const agent = navigator.userAgent
window.isOBS = agent.includes("OBS")

window.ttid = getUrlParams("ttid")
window.key = getUrlParams("key")
window.socket = io("https://server-jelly-walnut-quill.glitch.me/", {
  query: {
    widget: "chatlog",
    ttid: window.ttid,
    key: window.key,
  },
})

const Container = () => {
  const [ioConnectStt, setIoConnectStt] = useState(0)
  const [loadingText, setLoadingText] = useState("loading...")
  const [roomInfo, setRoomInfo] = useState({})
  const [event, updateEvent] = useState({})

  useEffect(() => {
    window.ttid === "null" && setLoadingText("please add ttid param")

    window.socket.on("connect", () => {
      setLoadingText("server connected")
      setIoConnectStt(1)
    })

    window.socket.on("disconnect", (reason) => {
      setIoConnectStt(0)
      setLoadingText("server disconnected")
    })

    window.socket.on("tiktok-info", (data) => {
      setRoomInfo(data)
      setLoadingText("livestream connected")
    })

    window.socket.on("tiktok-event", (data) => updateEvent(data))

    window.socket.on("tiktok-ended", (reason) => {
      window.alert(`Livestream has ended: ${reason}`)
    })

    return () => window.socket.removeAllListeners()
  }, [])

  return (
    <MDBContainer className="vh-100 p-2" style={{ minWidth: "400px" }}>
      {ioConnectStt ? (
        <App roomInfo={roomInfo} event={event} />
      ) : (
        <Loading text={loadingText} />
      )}
    </MDBContainer>
  )
}

ReactDOM.render(<Container />, document.getElementById("root"))
