import React from "react";
import { Container, Row } from "react-bootstrap";
import { ExperienceList } from "../Resources/Lists";

export function Experience() {
  return (
    <Row className="p-0 m-0">
      <Container id="experience" className="display-3 text-start">
        <span>Experience</span>
      </Container>

      <Row className="p-0 m-0" style={{justifyContent:"center"}}>
      <ExperienceList />
      </Row>
    </Row>
  );
}
