import React from "react";

function CR(props) {
  console.log(props);
  if (props.user.role === ("administrateur" || "responsable de projet"));

  return (
    <div>
      {props.user.listeTacheCommencés.map((item) => {
        return;
      })}
    </div>
  );
}

export default CR;
