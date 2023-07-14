interface StoreFileDeliverableInterface {
  fileName: string;
  fileSize: string;
  downloadUrl: string;
}

interface DisplayFileDeliverableInterface
  extends StoreFileDeliverableInterface {
  progress: string;
}

export type { StoreFileDeliverableInterface, DisplayFileDeliverableInterface };
