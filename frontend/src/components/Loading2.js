import React from "react";
import Spinner from "react-bootstrap/Spinner";
function Loading2() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
      }}
    >
      <Spinner
        animation="border"
        variant="primary"
        style={{ width: "100px", height: "100px", fontSize: "50px" }}
      />
    </div>
  );
}

export default Loading2;
