import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemActions,
  ItemDescription,
  ItemTitle,
  ItemMedia,
} from "@/components/ui/item";
import { DeleteIcon, LucideIcon, TextIcon, TrashIcon } from "lucide-react";

const Layers = () => {
  const layersData: { id: string; name: string; icon: LucideIcon }[] = [
    { id: "sdakfdf", name: "text", icon: TextIcon },
    { id: "dakfdf", name: "text", icon: TextIcon },
  ];
  return (
    <>
      {layersData.map((layer) => {
        return (
          <Item key={layer.id}>
            <ItemMedia variant='image'>
              <layer.icon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{layer.name}</ItemTitle>
              <ItemDescription>Description</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant={"destructive"} size={"icon"}>
                <TrashIcon />
              </Button>
            </ItemActions>
          </Item>
        );
      })}
    </>
  );
};

export default Layers;
