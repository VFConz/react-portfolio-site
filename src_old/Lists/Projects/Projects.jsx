import "bootstrap/dist/css/bootstrap.min.css";
import { ProjectList } from "../Resources/Lists.jsx";
import { Container, Row } from "react-bootstrap";
import anime from "animejs";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export function Projects() {
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
      <Container id="projects" className="display-3 text-start mt-5">
        <span>Projects</span>{" "}
      </Container>
      <Row className="p-0 m-0" style={{justifyContent:"center"}} ref={project}>
        <ProjectList />
      </Row>
    </>
  );
}
