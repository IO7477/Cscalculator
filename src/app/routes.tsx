import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { RadixConverter } from "./pages/RadixConverter";
import { TwosComplement } from "./pages/TwosComplement";
import { BitwiseOperations } from "./pages/BitwiseOperations";
import { ArithmeticOperations } from "./pages/ArithmeticOperations";
import { MemoryAddressCalculator } from "./pages/MemoryAddressCalculator";
import { BigOCalculator } from "./pages/BigOCalculator";
import StackQueueCalculator2 from "./pages/StackQueueCalculator2";
import ExpressionEvaluator from "./pages/ExpressionEvaluator";
import { ScientificCalculator } from "./pages/ScientificCalculator";
import { SubnetCalculator } from "./pages/SubnetCalculator";
import { TreeCalculator } from "./pages/TreeCalculator";
import { GraphCalculator } from "./pages/GraphCalc";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/radix-converter",
    Component: RadixConverter,
  },
  {
    path: "/twos-complement",
    Component: TwosComplement,
  },
  {
    path: "/bitwise-operations",
    Component: BitwiseOperations,
  },
  {
    path: "/arithmetic-operations",
    Component: ArithmeticOperations,
  },
  {
    path: "/memory-address",
    Component: MemoryAddressCalculator,
  },
  {
    path: "/big-o-calculator",
    Component: BigOCalculator,
  },
  {
    path: "/stack-queue",
    Component: StackQueueCalculator2,
  },
  {
    path: "/expression-evaluator",
    Component: ExpressionEvaluator,
  },
  {
    path: "/scientific-calculator",
    Component: ScientificCalculator,
  },
  {
    path: "/subnet-calculator",
    Component: SubnetCalculator,
  },
  {
    path: "/tree-calculator",
    Component: TreeCalculator,
  },
  {
    path: "/graph-calculator", 
    Component: GraphCalculator
  },
]);