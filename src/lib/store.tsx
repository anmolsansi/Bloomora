"use client";

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";
import type {
  BouquetState,
  SelectedFlower,
  ArrangementData,
  StyleData,
  MessageData,
} from "@/types/bouquet";

type BouquetAction =
  | { type: "SELECT_FLOWER"; flower: SelectedFlower }
  | { type: "REMOVE_FLOWER"; flowerId: string }
  | { type: "UPDATE_FLOWER_COUNT"; flowerId: string; count: number }
  | { type: "SET_ARRANGEMENT"; arrangement: ArrangementData }
  | { type: "SET_STYLE"; style: StyleData }
  | { type: "SET_MESSAGE"; message: MessageData }
  | { type: "SET_STEP"; step: number }
  | { type: "RESET" };

const initialState: BouquetState = {
  selectedFlowers: [],
  arrangement: {
    style: "romantic",
    positions: [],
    greeneryStyle: "soft_garden",
    bouquetShape: "round",
    fullness: 0.7,
  },
  style: {
    wrapper: "soft_pink",
    ribbon: "rose",
    background: "warm_cream",
    cardStyle: "floral_border",
  },
  message: {
    recipientName: "",
    senderName: "",
    message: "",
    occasion: "",
  },
  currentStep: 1,
};

function bouquetReducer(
  state: BouquetState,
  action: BouquetAction
): BouquetState {
  switch (action.type) {
    case "SELECT_FLOWER": {
      const existing = state.selectedFlowers.find(
        (f) => f.flowerId === action.flower.flowerId
      );
      if (existing) {
        return {
          ...state,
          selectedFlowers: state.selectedFlowers.map((f) =>
            f.flowerId === action.flower.flowerId
              ? { ...f, count: f.count + 1 }
              : f
          ),
        };
      }
      return {
        ...state,
        selectedFlowers: [...state.selectedFlowers, action.flower],
      };
    }
    case "REMOVE_FLOWER": {
      const existing = state.selectedFlowers.find(
        (f) => f.flowerId === action.flowerId
      );
      if (existing && existing.count > 1) {
        return {
          ...state,
          selectedFlowers: state.selectedFlowers.map((f) =>
            f.flowerId === action.flowerId ? { ...f, count: f.count - 1 } : f
          ),
        };
      }
      return {
        ...state,
        selectedFlowers: state.selectedFlowers.filter(
          (f) => f.flowerId !== action.flowerId
        ),
      };
    }
    case "UPDATE_FLOWER_COUNT": {
      if (action.count <= 0) {
        return {
          ...state,
          selectedFlowers: state.selectedFlowers.filter(
            (f) => f.flowerId !== action.flowerId
          ),
        };
      }
      return {
        ...state,
        selectedFlowers: state.selectedFlowers.map((f) =>
          f.flowerId === action.flowerId ? { ...f, count: action.count } : f
        ),
      };
    }
    case "SET_ARRANGEMENT":
      return { ...state, arrangement: action.arrangement };
    case "SET_STYLE":
      return { ...state, style: action.style };
    case "SET_MESSAGE":
      return { ...state, message: action.message };
    case "SET_STEP":
      return { ...state, currentStep: action.step };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

interface BouquetContextType {
  state: BouquetState;
  dispatch: React.Dispatch<BouquetAction>;
  totalFlowers: number;
}

const BouquetContext = createContext<BouquetContextType | null>(null);

export function BouquetProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bouquetReducer, initialState);
  const totalFlowers = state.selectedFlowers.reduce(
    (sum, f) => sum + f.count,
    0
  );

  return (
    <BouquetContext.Provider value={{ state, dispatch, totalFlowers }}>
      {children}
    </BouquetContext.Provider>
  );
}

export function useBouquet() {
  const context = useContext(BouquetContext);
  if (!context) {
    throw new Error("useBouquet must be used within a BouquetProvider");
  }
  return context;
}
