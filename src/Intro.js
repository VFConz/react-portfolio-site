import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Intro.css";
import anime from "./anime.es.js";
import { Image, Container, Button, Row, Col } from "react-bootstrap";

export default function Intro() {
  const img = document.getElementById("profileImage");
  const [imageState, setImageState] = useState(false);
  useEffect(() => {
    anime({
      targets: document.getElementById("pointer"),
      translateY: 28,
      direction: "alternate",
      easing: "easeInSine",
      duration: 800,
      autoplay: true,
      loop: true,
    });
  }, []);

  function animateImage(scale, duration, elasticity) {
    anime.remove(img);
    anime({
      targets: img,
      scale: scale,
      duration: duration,
      elasticity: elasticity,
    });
  }
  function enterImage() {
    animateImage(1.1, 800, 400);
  }

  function leaveImage() {
    animateImage(1.0, 600, 300);
  }

  useEffect(() => {
    imageState ? enterImage() : leaveImage();
  }, [imageState]);

  return (
    <Container style={{ width: "80vw" }} className="bg-light mt-0 mb-0">
      <Image
        id="profileImage"
        onMouseEnter={() => setImageState(!imageState)}
        onMouseOut={() => setImageState(!imageState)}
        fluid
        src="properPic.png"
        className="mx-auto d-block"
        width={"60%"}></Image>
      <Container className="text-center mt-5 ">
        <p className="display-4">
          Hello I'm <b>Conor</b>, A <b>Full Stack Engineer</b>
        </p>
      </Container>
      <Container
        className=""
        style={{
          textAlign: "center",
        }}>
        <Row className="p-5 py-3">
          <Col sm="6" md className="mb-3">
            <Button
              style={{ width: "100%" }}
              className="Button "
              variant="outline-dark"
              href="https://www.linkedin.com/in/conordouglas/"
              target="/blank">
              LinkedIn
            </Button>
          </Col>
          <Col sm="6" md className="mb-3">
            <Button
              style={{ width: "100%" }}
              className="Button "
              variant="outline-dark"
              href="https://github.com/VFConz"
              target="/blank">
              GitHub
            </Button>
          </Col>
        </Row>
      </Container>
      <p className="text-center lead pt-3 pb-0 mb-0">
        Scroll Down to View My Work
      </p>
      <p id="pointer" className="text-center lead fs-5 mt-0  mb-4">
        ⌄
      </p>
    </Container>
  );
}
