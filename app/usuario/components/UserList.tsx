"use client";
import { User } from "@prisma/client";
import UserBox from "./UserBox";

interface UserListProps {
  users: User[];
}
//Lista de todos los usuarios disponibles para abrir un chat.
const UserList: React.FC<UserListProps> = ({ users }) => {
  return (
    <aside className="fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-600 block w-full left-0">
      <div className="px-5">
        <div className="flex-col">
          <div
            className="
            text-xl
            font-bold
            text-neutral-800
            py-4
            "
          >
            Gente para chatear
          </div>
        </div>
        {users.map((user) => {
          return <UserBox key={user.id} user={user} />;
        })}
      </div>
    </aside>
  );
};

export default UserList;
