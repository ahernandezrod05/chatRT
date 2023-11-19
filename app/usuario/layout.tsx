import getUsers from "../actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar";
import UserList from "./components/UserList";
//Layout de la página de usuarios, donde verán las Sidebar y los chat en el centro
export default async function UsuarioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();

  return (
    <Sidebar>
      <main className="h-full">
        <UserList users={users!} />
        {children}
      </main>
    </Sidebar>
  );
}
