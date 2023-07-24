import TextBox from "./TextBox";
import List from "./JSON/list.json";

export function ExperienceList() {
  const Experience = List.filter((item) => item.variant === "experience");

  return Experience.map((item) => (
    <TextBox
      key={item.id}
      section={item.section}
      subtitle={item.subtitle}
      content={item.content}
      imgSrc={item.imgSrc}
      variant={item.variant}
      modalContent={item.modalContent}
      modalHeader={item.modalHeader}
      modalSubtitle={item.modalSubtitle}
      href={item.href}></TextBox>
  ));
}

export function EducationList() {
  const Education = List.filter((item) => item.variant === "education");

  return Education.map((item) => (
    <TextBox
      key={item.id}
      section={item.section}
      subtitle={item.subtitle}
      content={item.content}
      variant={item.variant}
      list={item.list}
      modalContent={item.modalContent}
      modalHeader={item.modalHeader}
      modalSubtitle={item.modalSubtitle}
      href={item.href}></TextBox>
  ));
}

export function ProjectList() {
  const Projects = List.filter((item) => item.variant === "project");

  return Projects.map((item) => (
    <TextBox
      key={item.id}
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
      href={item.href}></TextBox>
  ));
}
