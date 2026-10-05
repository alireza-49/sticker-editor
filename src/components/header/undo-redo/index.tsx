import { Button } from "@/components/ui/button";
import { Redo, Undo } from "lucide-react";

const UndoRedo = () => {
  return (
    <div className='flex items-center justify-center gap-2'>
      <Button variant={"ghost"}>
        <Undo data-icon='inline-end' />
        Undo
      </Button>
      <Button variant={"ghost"}>
        <Redo data-icon='inline-start' />
        Redo
      </Button>
    </div>
  );
};

export default UndoRedo;
