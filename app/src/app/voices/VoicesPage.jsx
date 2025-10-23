import Link from "next/link";

const VoicesPage = ({ voices }) => {
  return voices.map((voice, index) => {
    console.log(voice);
    return (
      <Link key={index} href={`/voices/${voice.slug.current}`}>
        {voice.name}
      </Link>
    );
  });
};

export default VoicesPage;
