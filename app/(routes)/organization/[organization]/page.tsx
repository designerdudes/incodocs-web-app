import UserData from "./components/UserData";

interface PageProps {
  params: {
    organization: string; //user Id
  };
}

export default function Page({ params }: PageProps) {
  return <UserData id={params.organization} />;
}
