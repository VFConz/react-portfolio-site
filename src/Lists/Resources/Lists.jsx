import React from "react";
import { Row, Col } from "react-bootstrap";
import TextBox from "../../TextBox";
import List from "../../JSON/list.json";

function chunkArray(array, size) {
  return array.reduce((acc, _, index) => {
    if (index % size === 0) acc.push(array.slice(index, index + size));
    return acc;
  }, []);
}

export function ExperienceList() {
  const Experience = List.filter((item) => item.variant === "experience");

  const rows = chunkArray(Experience, 2); // Group into rows of 2

  return rows.map((row, rowIndex) => (
    <Row key={rowIndex} className="g-3 mt-0">
      {row.map((item) => (
        <Col key={item.id} md={6}>
          <TextBox
            section={item.section}
            subtitle={item.subtitle}
            content={item.content}
            imgSrc={item.imgSrc}
            variant={item.variant}
            modalContent={item.modalContent}
            modalHeader={item.modalHeader}
            modalSubtitle={item.modalSubtitle}
            href={item.href}
          />
        </Col>
      ))}
    </Row>
  ));
}

export function EducationList() {
  const Education = List.filter((item) => item.variant === "education");

  const rows = chunkArray(Education, 2);

  return rows.map((row, rowIndex) => (
    <Row key={rowIndex} className="g-3 mt-0">
      {row.map((item) => (
        <Col key={item.id} md={6}>
          <TextBox
            section={item.section}
            subtitle={item.subtitle}
            content={item.content}
            variant={item.variant}
            list={item.list}
            modalContent={item.modalContent}
            modalHeader={item.modalHeader}
            modalSubtitle={item.modalSubtitle}
            href={item.href}
          />
        </Col>
      ))}
    </Row>
  ));
}

export function ProjectList() {
  const Projects = List.filter((item) => item.variant === "project");

  const rows = chunkArray(Projects, 2);

  return rows.map((row, rowIndex) => (
    <Row key={rowIndex} className="g-3 mt-0">
      {row.map((item) => (
        <Col key={item.id} lg={6} md={12} sm={12}>
          <TextBox
            section={item.section}
            subtitle={item.subtitle}
            list={item.list}
            subtitleColor={item.subtitleColor}
            content={item.content}
            variant={item.variant}
            imgSrc={item.imgSrc}
            modalContent={item.modalContent}
            modalHeader={item.modalHeader}
            modalSubtitle={item.modalSubtitle}
            href={item.href}
          />
        </Col>
      ))}
    </Row>
  ));
}
