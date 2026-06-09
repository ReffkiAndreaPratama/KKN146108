import { Transaction } from "@/types";

export const transactions: Transaction[] = [];

export const budgetSummary: {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categories: { name: string; amount: number; color: string }[];
} = {
  totalIncome: 0,
  totalExpense: 0,
  balance: 0,
  categories: [],
};
