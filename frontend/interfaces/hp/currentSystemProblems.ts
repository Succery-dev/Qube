import { StaticImageData } from "next/image";

interface ProblemsInterface {
  id: string;
  image: StaticImageData;
  description: {
    main: string;
    footer: string;
  };
}

export type { ProblemsInterface };
