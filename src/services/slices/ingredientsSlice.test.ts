import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '../../utils/types';

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [] as TIngredient[],
    isLoading: false,
    error: null as string | null
  };

  const mockIngredients: TIngredient[] = [
    { _id: '1', name: 'Булка', type: 'bun', proteins: 1, fat: 1, carbohydrates: 1, calories: 1, price: 1, image: '', image_mobile: '', image_large: '' },
    { _id: '2', name: 'Котлета', type: 'main', proteins: 2, fat: 2, carbohydrates: 2, calories: 2, price: 2, image: '', image_mobile: '', image_large: '' }
  ];

  it('возвращает начальное состояние при неизвестном экшене', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('обрабатывает fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('обрабатывает fetchIngredients.fulfilled', () => {
    const action = { type: fetchIngredients.fulfilled.type, payload: mockIngredients };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('обрабатывает fetchIngredients.rejected', () => {
    const action = { type: fetchIngredients.rejected.type, error: { message: 'Ошибка' } };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });
});