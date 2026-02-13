import "bootstrap/dist/css/bootstrap.min.css";
import { EducationList } from "../Resources/Lists.jsx";
import { Row, Container } from "react-bootstrap";

export function Education() {
  return (
    <>
      <Container id="education" className="display-3 text-start mt-5">
        <span>Education</span>
      </Container>
      <Row
        className="p-0 m-0"
        style={{ justifyContent: "center" }}>
        <EducationList />
      </Row>
    </>
  );
}
