import { createContext, useContext } from 'react';

export const CategoriesContext = createContext({
  categories:     [],
  createCategory: async () => {},
  updateCategory: async () => {},
  deleteCategory: async () => {},
});

export function useCategoriesCtx() {
  return useContext(CategoriesContext);
}
