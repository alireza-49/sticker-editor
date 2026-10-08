import ControlCenter from "./control-center";
import Export from "./export";
import UndoRedo from "./undo-redo";

const Header = () => {
  return (
    <>
      <header className='w-screen min-w-screen h-14 fixed top-0 left-0 border-b-1 border-b-mist-700 flex items-center justify-between p-2 bg-background'>
        <ControlCenter />
        <UndoRedo />
        <Export />
      </header>
      <div className='h-14' />
    </>
  );
};

export default Header;
