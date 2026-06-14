export interface Flower {
  id: string;
  name: string;
  meaning: string;
  category: "focal" | "filler" | "accent" | "greenery";
  colors: string[];
  size: "small" | "medium" | "large";
  layerPriority: number;
}

export interface SelectedFlower {
  flowerId: string;
  count: number;
  color: string;
}

export interface ArrangementPosition {
  flowerId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  layer: number;
}

export interface ArrangementData {
  style:
    | "romantic"
    | "wild_garden"
    | "classic"
    | "minimal"
    | "bright"
    | "soft_pastel"
    | "elegant";
  positions: ArrangementPosition[];
  greeneryStyle: "soft_garden" | "trailing" | "structured" | "wild";
  bouquetShape: "round" | "cascading" | "hand_tied" | "presentation";
  fullness: number;
}

export interface StyleData {
  wrapper: "soft_pink" | "kraft" | "white_satin" | "garden_green";
  ribbon: "rose" | "cream" | "sage" | "gold" | "lavender" | "navy";
  background: "warm_cream" | "soft_blush" | "sage_garden" | "twilight";
  cardStyle: "floral_border" | "minimal" | "vintage" | "modern";
}

export interface MessageData {
  recipientName: string;
  senderName: string;
  message: string;
  occasion: string;
}

export interface Bouquet {
  id: string;
  slug: string;
  recipientName: string;
  senderName: string;
  recipientEmail: string | null;
  senderEmail: string | null;
  message: string;
  occasion: string | null;
  selectedFlowers: SelectedFlower[];
  arrangementData: ArrangementData;
  styleData: StyleData;
  deliveryMethod: string | null;
  emailSentAt: string | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
}

export interface BouquetState {
  selectedFlowers: SelectedFlower[];
  arrangement: ArrangementData;
  style: StyleData;
  message: MessageData;
  currentStep: number;
}
