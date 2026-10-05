import ControlCenter from "./control-center";
import Export from "./export";
import UndoRedo from "./undo-redo";

const Header = () => {
  return (
    <header className='w-full h-14 border-b-1 border-b-mist-700 flex items-center justify-between p-2 bg-background'>
      <ControlCenter />
      <UndoRedo />
      <Export />
    </header>
  );
};

export default Header;
