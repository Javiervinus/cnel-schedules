import { BellPlus } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

interface Props {
  text: string;
  description?: string;
  duration?: number;
}

export default function Sonner(props: Props) {
  useEffect(() => {
    toast(props.text, {
      icon: <BellPlus size={20} />,
      description: props.description,
      position: "top-left",
      duration: props.duration,

      closeButton: true,
    });
  }, []);

  return <div></div>;
}
