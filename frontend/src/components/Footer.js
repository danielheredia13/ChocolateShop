import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  const d = new Date();
  let year = d.getFullYear();

  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center my-3">
            &copy; Copyright Fou De Toi {year}
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
