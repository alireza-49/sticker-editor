import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const ControlCenter = () => {
  return (
    <div className='flex items-center justify-center gap-2'>
      <Button size={"icon"} variant={"outline"}>
        <LogOut />
      </Button>
      <Button>File</Button>
      <Button>Edit</Button>
      <Button>Help</Button>
    </div>
  );
};

export default ControlCenter;
