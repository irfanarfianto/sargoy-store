import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import userServices from "@/services/user";
import { FormEvent, useState } from "react";

const ModalUpdateUser = (props: any) => {
   const { UpdatedUser, setUpdatedUser, setUsersData } = props;
   const [isLoading, setIsLoading] = useState(false);
   const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsLoading(true);
      const form: any = event.target as HTMLFormElement;
      const data = {
        
         role: form.role.value
      };

      const result = await userServices.updateUsers(
         UpdatedUser.id,
         data
      );
      if (result.status === 200) {
         setIsLoading(false);
         setUpdatedUser({});
         const { data } = await userServices.getAllUsers();
         setUsersData(data.data);
      } else {
         setIsLoading(false);
      }
      
   };
   return (
      <Modal onClose={() => setUpdatedUser({})}>
         <h1>Modal</h1>
         <form onSubmit={handleUpdate}>
            <Input label='Email' name='email' type='email' defaultValue={UpdatedUser?.email} disabled />
            <Input label='Nama Lengkap' name='fullname' type='text' defaultValue={UpdatedUser?.fullname} disabled />
            <Input label='Nomor Handphone' name='phone' type='number' defaultValue={UpdatedUser?.phone} disabled />
            <Select label='Role' name='role' defaultValue={UpdatedUser?.role} options={[
               { value: 'admin', label: 'Admin' },
               { value: 'member', label: 'Member' }
               ]} />
            <Button type="submit" variant="primary">Update</Button>
         </form>
      </Modal>
   );
};

export default ModalUpdateUser;