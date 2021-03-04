import { React, useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import CrCard from "../components/CrCard";

function CR(props) {
  const [state, setstate] = useState([]);
  useEffect(() => {
    setstate([]);
    for (const id of props.user.listeTacheCommencés) {
      const apiUrl = "http://localhost:3001/Recherche/Tache";
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({ id: id });
      var reqOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      fetch(apiUrl, reqOptions)
        .then((res) => res.json())
        .then((data) => {
          data = Object.assign({}, ...data);
          console.log(data);
          setstate((state) => [...state, data]);
        });
    }
  }, [setstate]);

  console.log(props);
  if (props.user.role === ("administrateur" || "responsable de projet"));

  return (
    <Container>
      <Row>
        {state.map((item) => {
          return (
            <>
              <CrCard task={item} user={props.user}></CrCard>
            </>
          );
        })}
      </Row>
    </Container>
  );
}

export default CR;
