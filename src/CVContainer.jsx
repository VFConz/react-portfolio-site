import Intro from "./Intro";
import { Education } from "./Lists/Education/Education";
import { Experience } from "./Lists/Experience/Experience";
import { Projects } from "./Lists/Projects/Projects";
import { Container, Row } from "react-bootstrap";

export function CVContainer() {
    return (
        <Container className="">
            <Row lg={2} sm={0}></Row>
            <Row lg={8} sm={12} >
                <Intro />
                <Experience />
                <Projects />
                <Education />
            </Row>
            <Row lg={2} sm={0}></Row>
        </Container>
    );
}