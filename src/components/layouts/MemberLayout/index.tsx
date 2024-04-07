import Sidebar from "@/components/fragments/Sidebar";
import styles from './MemberLayout.module.scss';

type Propstypes = {
   children: React.ReactNode
};

const listSidebarItem = [
   {
      title: 'Dashboard',
      url: '/member',
      icon: 'bxs-dashboard'
   },
   {
      title: 'Order',
      url: '/member/orsers',
      icon: 'bxs-cart'  
   },
   {
      title: 'Users',
      url: '/member/profile',
      icon: 'bxs-user'
   },
]

const MemberLayout = (props: Propstypes) => {
   const { children } = props;
   return (
      <div className={styles.member}>
         <Sidebar lists={listSidebarItem} />
         <div className={styles.member__main}>
            {children}
       </div>
      </div>
   )
};

export default MemberLayout;