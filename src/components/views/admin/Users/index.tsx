import AdminLayout from "@/components/layouts/AdminLayout";
import Button from "@/components/ui/Button";
import styles from "./Users.module.scss";
import { useEffect, useState } from "react";
import ModalUpdateUser from "./ModalUpdateUser";
import ModalDeleteUser from "./ModalDeleteUser";

type Propstypes = {
   users: any;
   setToaster: any;
};

const UsersAdminView = (props: Propstypes) => {
   const { users, setToaster } = props;
   const [UpdatedUser, setUpdatedUser] = useState<any>({});
   const [deletedUser, setDeletedUser] = useState<any>({});
   const [usersData, setUsersData] = useState<any>([]);

   useEffect(() => {
      setUsersData(users);
   }, [users])
   

   return (
      <>
         <AdminLayout >
         <div className={styles.users}>
            <h1>
            Users Manajemen
            </h1>
            <table className={styles.users__table}>
               <thead>
                  <tr>
                     <th>#</th>
                     <th>Fullname</th>
                     <th>Email</th>
                     <th>Role</th>
                     <th>Action</th>
                  </tr>
               </thead>
               <tbody>
                  {usersData.map((user: any, index: number) => (
                     <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{user.fullname}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                           <div className={styles.users__table__action}>
                               <Button type="button" variant="secondary" onClick={() => setUpdatedUser(user)} className={styles.users__table__action__edit}><i className='bx bxs-edit'/></Button>
                           <Button type="button" variant="danger" onClick={() => setDeletedUser(user)} className={styles.users__table__action__delete}><i className='bx bx-trash'/></Button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         </AdminLayout>
         {Object.keys(UpdatedUser).length && (
            <ModalUpdateUser UpdatedUser={UpdatedUser} setUpdatedUser={setUpdatedUser} setUsersData={setUsersData} setToaster={setToaster} />
         )}
         {Object.keys(deletedUser).length && (
            <ModalDeleteUser
               deletedUser={deletedUser}
               setDeletedUser={setDeletedUser}
               setUsersData={setUsersData} 
               setToaster={setToaster}
            />
         )}
      </>
   )
};

export default UsersAdminView;