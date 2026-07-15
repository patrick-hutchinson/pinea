import PersonPage from "@/app/stories/recommended/[slug]/PersonPage";
import { getPeople } from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";

export default function Person({ people, person }) {
  return <PersonPage people={people} person={person} />;
}

export const getServerSideProps = withPagesShellProps(async ({ params }) => {
  const people = await getPeople();
  const person = people.find((item) => item.slug?.current === params?.slug);

  if (!person) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      people,
      person,
    },
  };
});
