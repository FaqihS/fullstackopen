const Header = ({ courseName }) => <h1>{courseName}</h1>;

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);
const Content = ({ courseParts }) => {
  return (
    <>
      {courseParts.map((part) => {
        return <Part part={part} key={part.id} />;
      })}
      <Total courseParts={courseParts} />
    </>
  );
};

const Total = ({ courseParts }) => {
  const total = courseParts.reduce((total, part) => {
    return total + part.exercises;
  }, 0);
  return (
    <p>
      <b>Total of Exercises {total}</b>
    </p>
  );
};

const Course = ({ course }) => {
  return (
    <div>
      <Header courseName={course.name} />
      <Content courseParts={course.parts} />
    </div>
  );
};

export default Course;
