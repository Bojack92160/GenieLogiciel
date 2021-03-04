import { React } from "react";

import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import TaskList from "../components/TaskList";
//test pour voir comment importer des fonctions
//import { test } from "../testfunc";

// function yes(name) {
//   console.log("yes");
// }
function Home(props) {
  // const nom = "mathieu";
  //console.log(props.data);

  return (
    <div className="home">
      {/* test pour voir comment marche des fonctions avec params */}
      {/* <button
          onClick={() => {
            test(nom);
          }}
        ></button> */}
      <Container>
        <Row>
          <TaskList tasks={props.tasks} user={props.Userdata} />
        </Row>
      </Container>
    </div>
  );
}

export default Home;
