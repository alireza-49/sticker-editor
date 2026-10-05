import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const Export = () => {
  return (
    <ButtonGroup>
      <Button variant='default'>Export</Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant='default' size='icon' aria-label='More Options'>
              <ChevronDown />
            </Button>
          }
        />
        <DropdownMenuContent align='end' className='w-40'>
          <DropdownMenuGroup>
            <DropdownMenuItem>Download</DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuItem>Save</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
};

export default Export;
