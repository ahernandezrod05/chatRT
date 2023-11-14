import Sidebar from "../components/sidebar/Sidebar";
//Layout de la página de usuarios, donde verán las Sidebar y los chat en el centro
export default async function UsuarioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Sidebar>
      <main className="h-full">{children}</main>
    </Sidebar>
  );
}
