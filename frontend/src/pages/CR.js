import React from "react";

function CR(props) {
  console.log(props);
  if (props.user.role === ("administrateur" || "responsable de projet")) {
    console.log("admin");
    return <div></div>;
  }
}

export default CR;
