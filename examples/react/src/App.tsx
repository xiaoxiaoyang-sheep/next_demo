import { connect } from "@image-saas/preact-react-connect";
import { UploadButton } from "@image-saas/upload-button";
import { useState } from "react";
import "./App.css";


const ReactUploadButton = connect(UploadButton)

function App() {
  const [count, setCount] = useState(0)
	return <>
    <ReactUploadButton style={{background: "black", color: "white"}} onClick={() => setCount(count => count + 1)}>Click Me {count}</ReactUploadButton>
  </>;
}

export default App;
