import { IdType, idTypes } from "../constants/idTypes";
// import { Command, CommandGroup, CommandItem, CommandList } from "./ui/command";
// import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type IdTypeSelectProps = {
  idType: IdType;
  setIdType: (idType: IdType) => void;
};

export default function IdTypeSelect({ idType, setIdType }: IdTypeSelectProps) {
  return (
    <Select value={idType} onValueChange={setIdType}>
      <SelectTrigger>
        <SelectValue
          aria-label="Tipo de identificación"
          placeholder="Seleccione un tipo de identificación"
        />
      </SelectTrigger>
      <SelectContent>
        {idTypes.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
