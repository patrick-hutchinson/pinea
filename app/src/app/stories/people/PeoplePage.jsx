import Link from "next/link";

const PeoplePage = ({ people }) => {
  return people.map((person, index) => {
    console.log(person);
    return (
      <Link key={index} href={`/people/${person.slug.current}`}>
        {person.name}
      </Link>
    );
  });
};

export default PeoplePage;
