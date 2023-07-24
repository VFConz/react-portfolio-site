import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ExperienceList, EducationList, ProjectList } from "./Lists";
import Intro from "./Intro.js";
import { Row, Container } from "react-bootstrap";
import { Contact } from "./Contact";
import OffCanvasButton from "./OffCanvasButton";
import anime from "./anime.es";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

function Body() {
  const [project, projectInView] = useInView();
  useEffect(() => {
    console.log(projectInView);
    anime.remove();
    if (projectInView) {
      // anime({
      //   targets: body,
      //   duration: 1500,
      //   delay: 500,
      //   backgroundColor: "yellow",
      // });
      anime({
        targets: [document.getElementsByClassName("boxImgP")],
        scale: 1,
        duration: 2000,
        delay: anime.stagger(100, { start: 500 }),
      });
    } else {
      // anime({
      //   targets: body,
      //   duration: 1500,
      //   delay: 500,
      //   backgroundColor: "white",
      // });
      anime({
        targets: [document.getElementsByClassName("boxImgP")],
        scale: 0.8,
        duration: 1000,
      });
    }
  }, [projectInView]);

  return (
    <>
      <Container className="bg-light mt-0 pb-3">
        <Row className="g-2">
          <Container id="experience" className="display-3 text-start mx-3 my-3">
            <span>Experience</span>
          </Container>
          <p className="lead text-center">
            I am only new to the professional work environment ;p
          </p>
          <ExperienceList />
        </Row>
        <Container id="projects" className="display-3 text-start mx-3 my-5">
          <span>Projects</span>{" "}
        </Container>
        <Row className="g-3" ref={project}>
          <ProjectList />
        </Row>
        <Container id="education" className="display-3 text-start mx-3 my-5">
          <span>Education</span>
        </Container>
        <Row className="g-3">
          <EducationList />
        </Row>
      </Container>
    </>
  );
}

export default function App() {
  return (
    <>R
      <OffCanvasButton />
      <Container
        id="home"
        className="bg-light p-0">
        <Intro style={{ width: "80vw" }} />
        <Body style={{ width: "80vw" }} />
        <Contact />
      </Container>
    </>
  );
}
