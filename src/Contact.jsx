import { Container, Row, Tabs, Tab } from "react-bootstrap";
import "./Contact.css";

export const Contact = () => {
  return (
    <Container className="mt-5">
      <Container className="text-center pt-5">
        <p className="display-4 fw-semibold" id="contact">
          Contact Details
        </p>
      </Container>

      <p className="text-center lead pt-5">
        Scroll Down to Reach me at my Socials
      </p>
      <p className="text-center lead fs-5 py-1 px-5 mx-0">⌄</p>

      <Container
        fluid
        className=""
        style={{
          display: "flex",
          justifyContent: "center",
        }}>
        <Row
          className="pb-3"
          md={8}
          sm={12}
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}>
          <Container className="bg-dark rounded-5">
            <Tabs
              defaultActiveKey="linkedin"
              className="mt-3 mb-3 bg-light rounded-5 fw-bold"
              justify>
              <Tab className="Contacts" eventKey="linkedin" title="Linkedin">
                <a href="https://linkedin.com/VFConz" target="/blank">
                  https://linkedin.com/VFConz
                </a>
              </Tab>
              <Tab className="Contacts" eventKey="github" title="Github">
                <a href="https://github.com/VFConz" target="/blank">
                  https://github.com/VFConz
                </a>
              </Tab>
              <Tab className="Contacts" eventKey="email" title="Email">
                <a href="mailto:conordouglas01@gmail.com" target="/blank">
                  conordouglas01@gmail.com
                </a>
              </Tab>
            </Tabs>
          </Container>
        </Row>
      </Container>
      <br className="mb-3" />
    </Container>
  );
};
