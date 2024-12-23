import React, { useEffect, useRef, useState, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Letterize from "letterizejs";
import anime from "animejs";
import { Image, Container, Button, Row, Col } from "react-bootstrap";
import "./Intro.css";

export default function Intro() {
  const pointerRef = useRef(null);
  const titleRef = useRef(null); // Ref for the title animation
  const [imageState, setImageState] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    // Pointer Animation
    anime({
      targets: pointerRef.current,
      translateY: 20,
      direction: "alternate",
      easing: "easeInSine",
      duration: 800,
      autoplay: true,
      loop: true,
    });

    const titleElement = titleRef.current;

    // Reset the title content to remove existing spans
    const originalText = "Hello I'm Conor, A Full Stack Engineer";
    titleElement.innerHTML = originalText
      .split("")
      .map((char) => (char === " " ? "&nbsp;" : char)) // Replace spaces
      .join("");

    // Letterize + Anime.js Animation
    const letterize = new Letterize({
      targets: titleElement, // Target the title text
      wrapper: "span", // Wrap each character in a span
    });

    anime
      .timeline({
        targets: letterize.listAll, // Get the generated letter spans
        easing: "easeOutSine",
        duration: 250, // Duration for each letter animation
        loop: false,
        delay: anime.stagger(40, { start: 100 }), // Stagger each letter
      })
      .add({
        opacity: [0, 1], // Fade in
      });
  }, []);

  const animateImage = useCallback(
    (scale, duration, elasticity) => {
      anime.remove(imgRef.current); // Use ref to reference the image
      anime({
        targets: imgRef.current,
        translateY: scale,
        duration: duration,
        elasticity: elasticity,
      });
    },
    [imgRef]
  );

  useEffect(() => {
    animateImage(400, 5000, 400);
    setTimeout(() => {
      animateImage(0, 600, 300);
    }, 5000);
  }, [imageState, animateImage]);

  return (
    <Container className="bg-light mt-0 mb-5 p-0">
      <div className="holder">
        <Image fluid src="background_landscape.jpg"  style={{objectFit:"fill"}} className="w-100 h-100" />
        <div
          ref={titleRef}
          className="lead-1 text-light"
          id="titleAnim">
          Hello I'm Conor, A Full Stack Engineer
        </div>
        <Image
          ref={imgRef}
          id="profileImage"
          onMouseEnter={() => setImageState(!imageState)}
          onMouseOut={() => setImageState(!imageState)}
          fluid
          src="properPic.png"
        />
      </div>

      <Container className="text-center">
        <div className="text-center lead mt-5 fs-2">Check What I'm Up To</div>
        <Row className="py-2 px-4">
          <Col xs={12} sm={6} className="mb-3">
            <Button
              className="Button"
              variant="outline-dark"
              href="https://www.linkedin.com/in/conordouglas/"
              target="_blank"
              style={{ width: "100%" }}>
              LinkedIn
            </Button>
          </Col>
          <Col xs={12} sm={6} className="mb-3">
            <Button
              className="Button"
              variant="outline-dark"
              href="https://github.com/VFConz"
              target="_blank"
              style={{ width: "100%" }}>
              GitHub
            </Button>
          </Col>
        </Row>
      </Container>
      <p className="text-center lead fs-3 mt-5 pb-0 mb-1">
        Scroll Down to View My Work
      </p>
      <p
        id="pointer"
        ref={pointerRef}
        className="text-center lead fs-3 mt-0 mb-5">
        ⌄
      </p>
    </Container>
  );
}
