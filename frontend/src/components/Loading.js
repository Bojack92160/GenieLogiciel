import React from "react";
import Spinner from "react-bootstrap/Spinner";
function loading(Component) {
  return function WihLoadingComponent({ isLoading, ...props }) {
    if (!isLoading) return <Component {...props} />;
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "400px",
        }}
      >
        <Spinner
          animation="border"
          variant="primary"
          style={{ width: "100px", height: "100px", fontSize: "50px" }}
        />
      </div>
    );
  };
}

export default loading;
