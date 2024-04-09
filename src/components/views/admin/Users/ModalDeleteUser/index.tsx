import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import userServices from "@/services/user";
import styles from './ModalDeleteUser.module.scss';
import { useSession } from "next-auth/react";

const ModalDeleteUser = (props: any) => {
   const { deletedUser, setDeletedUser, setUsersData, setToaster } = props;
   const session: any = useSession();


   const handleDelete = async () => {
      userServices.deteleUser(deletedUser.id, session.data?.accessToken);
      setDeletedUser({});
      setToaster({
         variant: 'success',
         message: 'Success Delete User'
      });
      const { data } = await userServices.getAllUsers();
      setUsersData(data.data);
   }

   return (
      <Modal onClose={() => setDeletedUser({})}>
         <h1 className={styles.modal__title}>Anda yakin ingin menghapus data user?</h1>
         <Button type="button" variant="danger" onClick={() => handleDelete()}
            >Hapus</Button>
      </Modal>
   )
} 

export default ModalDeleteUser;