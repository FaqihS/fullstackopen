const Header = ({ course }) => <h1>{course.name}</h1>;

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);
const Content = ({ course }) => {
  return (
    <>
      {course.parts.map((part) => {
        return <Part part={part} key={part.id} />;
      })}
    </>
  );
};

const Total = ({ course }) => {
  const total = course.parts.reduce((total, part) => {
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
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  );
};

export default Course;
